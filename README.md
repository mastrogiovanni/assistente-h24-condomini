# Assistente H24 — sito prodotto

Sito statico (nessuna build, nessuna dipendenza) pubblicato su https://assistenteh24.com.
Nomi, indirizzi e dati negli esempi sono di fantasia.

## Struttura

| Percorso | Cosa contiene |
|---|---|
| `index.html` | Landing della piattaforma Assistente H24 (agenti AI, adattatori MCP, autonomia progressiva, prodotti) |
| `condomini/index.html` | Pagina prodotto a sé stante: Assistente H24 – Condomini, con demo interattiva |
| `segnalazioni/index.html` | Pagina prodotto di Assistente H24 – Segnalazioni (in arrivo): segnalazioni, interventi e squadre, accendibile e spegnibile |
| `mcp/index.html` | Pagina prodotto dei Connettori MCP (in arrivo) per CedHouse Suite e Gestendo, accendibile e spegnibile |
| `404.html` | Pagina "non trovata" servita da Netlify |
| `assets/config.js` | **Interruttori del sito**: mostra o nasconde sezioni intere (es. i connettori MCP) |
| `assets/shared.css` | Stili condivisi: menu "Prodotti" e form di contatto |
| `assets/site.js` | Script condiviso: apertura del menu e form di contatto via e-mail (qui c'è l'indirizzo che riceve le richieste) |
| `netlify.toml` | Configurazione di deploy, redirect www → dominio principale, header |
| `robots.txt`, `sitemap.xml` | Indicizzazione |

I link tra le pagine sono relativi, quindi il sito funziona anche aprendo i file in locale.

## Interruttori: mostrare o nascondere sezioni

Si fa da un solo file, `assets/config.js`:

```js
window.SITE_FEATURES = {
  mcp: true,            // false = nasconde la pagina /mcp/ e tutte le voci che la richiamano
  segnalazioni: true,   // false = nasconde la pagina /segnalazioni/ e tutte le voci che la richiamano
};
```

Con `mcp: false` (e allo stesso modo con `segnalazioni: false`):

- spariscono le voci "Connettori MCP" nel menu Prodotti di tutte le pagine, la fascia nella sezione Prodotti della home e il link nel piè di pagina;
- chi apre `/mcp/` direttamente viene riportato alla home;
- il form `contatti-mcp` resta registrato su Netlify ma non è raggiungibile.

Per riattivare tutto basta rimettere `true` e rifare il deploy. Se la spegni per molto tempo, togli `/mcp/` anche da `sitemap.xml`.

**Come funziona:**

- Ogni elemento con `data-feature="mcp"` viene nascosto quando l'interruttore è spento.
- La pagina dichiara `<html data-page-feature="mcp">`: se l'interruttore è spento, rimanda alla home.
- Per rendere spegnibile un'altra sezione:
  1. aggiungi una voce in `SITE_FEATURES`, per esempio `studi: true`;
  2. metti `data-feature="studi"` sugli elementi da nascondere.

  `config.js` va incluso nel `<head>` di ogni pagina, prima degli stili (è già così).

### Aggiungere un prodotto al menu

Il menu "Prodotti" è scritto in ciascuna pagina (cerca `class="dd-panel"`). Per un prodotto in arrivo:

```html
<div class="dd-item soon"><span class="di">📦</span><span><b>Nome <span class="tag">In arrivo</span></b><small>Descrizione breve</small></span></div>
```

Quando il prodotto è disponibile, trasforma il `div` in `<a class="dd-item" href="nome-prodotto/">` e cambia l'etichetta in `Disponibile`.
Aggiorna anche la sezione `#prodotti` di `index.html` e `sitemap.xml`.

## Form di contatto (via e-mail)

Il sito è statico e non ha un backend, come elpa-site. Ogni form, quando lo invii, **prepara un'e-mail**
con l'oggetto del form e i campi compilati, e apre il programma di posta del visitatore. La richiesta
arriva quando il visitatore preme **Invia** nella sua posta.

Ci sono quattro form, ciascuno con il suo oggetto (attributo `data-mail`):

| Pagina | Oggetto dell'e-mail |
|---|---|
| `index.html` | Assistente H24 - Richiesta informazioni |
| `condomini/index.html` | Assistente H24 – Condomini - Richiesta demo |
| `segnalazioni/index.html` | Assistente H24 – Segnalazioni - Richiesta demo |
| `mcp/index.html` | Connettori MCP - Lista d'attesa |

### Indirizzo che riceve le richieste

Si trova in cima ad `assets/site.js`:

```js
const SITE_EMAIL = 'info@elpaproject.com';
```

Cambialo lì: vale per tutti i form e per il link "Scrivici a…" nel messaggio di conferma.

### Modificare i campi

Ogni campo è un normale elemento HTML dentro il `<form>`:

```html
<div><label class="fl" for="m-azienda">Azienda <i>(facoltativo)</i></label>
  <input id="m-azienda" type="text" name="azienda"></div>
```

- Nell'e-mail ogni campo compilato diventa una riga `Etichetta: valore`. L'etichetta è il testo del `<label for="...">`, senza la parte in `<i>`. Quindi servono un `id` sul campo e un `for` uguale sul label.
- `required` rende il campo obbligatorio.
- `<div class="full">` occupa tutta la larghezza, senza `full` il campo sta a metà riga.
- Menu a tendina: `<select name="...">` con le `<option>` che vuoi.
- Scelte multiple a "pillola": copia una riga dentro `<div class="checks">` e mantieni lo stesso `name`. Nell'e-mail i valori scelti finiscono su una sola riga, dopo il titolo del gruppo (`<span class="fl">`).
- La casella del consenso (`name="consenso"`) è obbligatoria, ma non viene scritta nell'e-mail.
- Per cambiare l'oggetto, modifica `data-mail` sul `<form>`.

### Testi, conferma e aspetto

- **Messaggio di conferma:** è il blocco `<div class="form-ok">` subito dopo il form. Compare al posto del form e ricorda al visitatore di premere Invia. Se il programma di posta non si apre, il blocco mostra l'indirizzo e un pulsante per tornare al modulo.
- **Colori e forme:** sono in `assets/shared.css`, nella sezione "Form di contatto".

### Limiti

- Serve un programma di posta configurato sul dispositivo del visitatore (Gmail, Outlook, Mail…). Senza, resta solo l'indirizzo da copiare.
- Senza JavaScript il form non invia nulla.
- Non c'è un elenco delle richieste ricevute: arrivano nella casella dell'indirizzo indicato.

### Privacy

La casella di consenso è obbligatoria. Prima di andare online, aggiungi una pagina di informativa privacy (GDPR) e collegala nel testo del consenso.

## Badge "Powered by Netlify"

Sul piano gratuito Netlify aggiunge in fondo a ogni pagina un `<iframe id="nl-badge-frame">` con il badge
"Powered by Netlify". Il sito lo nasconde in due modi: una regola in `assets/shared.css` e un controllo in
`assets/site.js` che lo nasconde anche quando compare dopo il caricamento. Sul piano gratuito Netlify non
consente di nascondere il badge dalle impostazioni: verifica che questa soluzione rispetti i loro termini di
servizio, oppure passa a un piano a pagamento. Se Netlify cambia l'`id` dell'iframe, va aggiornato in entrambi i file.

## Deploy su Netlify

La configurazione è in `netlify.toml`: non c'è build e viene pubblicata la cartella radice.

- **Da Git:** *Add new site → Import an existing project* e scegli questo repository.
- **Da CLI:** `netlify deploy` per un'anteprima, `netlify deploy --prod` per la produzione.

### Dominio assistenteh24.com

1. Netlify → *Domain management → Add a domain*: inserisci `assistenteh24.com` e aggiungi anche `www.assistenteh24.com`.
2. Dal registrar: usa i nameserver di Netlify (consigliato), oppure crea un record `A` verso il load balancer di Netlify e un `CNAME` `www` verso `<nome-sito>.netlify.app`.
3. Il certificato HTTPS si attiva da solo. Il redirect da `www` al dominio senza `www` è già in `netlify.toml`.
