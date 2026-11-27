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
| `grazie/index.html` | Pagina di conferma dopo l'invio di un form (usata se JavaScript è disattivato) |
| `404.html` | Pagina "non trovata" servita da Netlify |
| `assets/config.js` | **Interruttori del sito**: mostra o nasconde sezioni intere (es. i connettori MCP) |
| `assets/shared.css` | Stili condivisi: menu "Prodotti" e form di contatto |
| `assets/site.js` | Script condiviso: apertura del menu e invio dei form a Netlify |
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

## Form di contatto (Netlify Forms)

Ci sono quattro form:

- `contatti-assistente-h24` in `index.html`
- `contatti-condomini` in `condomini/index.html`
- `contatti-segnalazioni` in `segnalazioni/index.html`
- `contatti-mcp` in `mcp/index.html` (lista d'attesa dei connettori)

Netlify li riconosce al deploy grazie all'attributo `data-netlify="true"`. Le risposte arrivano in
**Netlify → il sito → Forms**, separate per nome del form.

### Prima attivazione

1. Netlify → *Site configuration → Forms* → **Enable form detection**.
2. Fai un nuovo deploy: i form compariranno nell'elenco.
3. *Forms → Form notifications* → **Add notification → Email notification**: scegli il form e l'indirizzo che deve ricevere le richieste. Puoi aggiungere anche notifiche Slack o webhook.

### Modificare i campi

Ogni campo è un normale elemento HTML dentro il `<form>`:

```html
<div><label class="fl" for="m-azienda">Azienda <i>(facoltativo)</i></label>
  <input id="m-azienda" type="text" name="azienda"></div>
```

- `name` è il nome con cui il dato appare in Netlify: cambiarlo crea una nuova colonna.
- `required` rende il campo obbligatorio.
- `<div class="full">` occupa tutta la larghezza, senza `full` il campo sta a metà riga.
- Menu a tendina: `<select name="...">` con le `<option>` che vuoi.
- Scelte multiple a "pillola": copia una riga dentro `<div class="checks">`, mantenendo `name="strumenti[]"` (le parentesi servono a ricevere più valori).
- Il campo nascosto `pagina` dice da quale pagina arriva la richiesta.

Dopo ogni modifica serve un nuovo deploy perché Netlify aggiorni la struttura del form.

### Testi, conferma e aspetto

- **Messaggio di conferma:** è il blocco `<div class="form-ok">` subito dopo il form, e compare al posto del form senza ricaricare la pagina.
- **Pagina di conferma senza JavaScript:** si trova in `grazie/index.html`. Per usarne un'altra cambia l'attributo `action` del form.
- **Messaggio d'errore:** è in `<p class="form-err">`.
- **Colori e forme:** sono in `assets/shared.css`, nella sezione "Form di contatto".

### Antispam

- **Honeypot:** è attivo con il campo nascosto `sito-web` (attributo `netlify-honeypot`). Netlify filtra anche lo spam con Akismet.
- **reCAPTCHA (se serve):** aggiungi `data-netlify-recaptcha="true"` al `<form>` e `<div data-netlify-recaptcha="true"></div>` prima del pulsante di invio.

### Privacy

La casella di consenso è obbligatoria. Prima di andare online, aggiungi una pagina di informativa privacy (GDPR) e collegala nel testo del consenso.

### Usare un altro servizio al posto di Netlify Forms

Per Formspree, Getform o un tuo backend:

1. Cambia l'attributo `action` del form con l'URL del servizio.
2. Togli `data-netlify="true"` e `netlify-honeypot`.
3. In `assets/site.js` sostituisci `fetch('/', ...)` con l'URL del servizio, oppure togli lo script e lascia l'invio classico.

## Deploy su Netlify

La configurazione è in `netlify.toml`: non c'è build e viene pubblicata la cartella radice.

- **Da Git:** *Add new site → Import an existing project* e scegli questo repository.
- **Da CLI:** `netlify deploy` per un'anteprima, `netlify deploy --prod` per la produzione.

### Dominio assistenteh24.com

1. Netlify → *Domain management → Add a domain*: inserisci `assistenteh24.com` e aggiungi anche `www.assistenteh24.com`.
2. Dal registrar: usa i nameserver di Netlify (consigliato), oppure crea un record `A` verso il load balancer di Netlify e un `CNAME` `www` verso `<nome-sito>.netlify.app`.
3. Il certificato HTTPS si attiva da solo. Il redirect da `www` al dominio senza `www` è già in `netlify.toml`.
