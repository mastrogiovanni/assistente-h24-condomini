# Assistente H24 – Condomini — sito vetrina

Pagina di presentazione statica (un solo `index.html`, nessuna dipendenza) dell'assistente IA per condomini.
Nomi, indirizzi e dati negli esempi sono di fantasia.

## Deploy su Netlify

La configurazione è in `netlify.toml` (nessuna build, si pubblica la cartella radice).

- **Da Git:** su Netlify *Add new site → Import an existing project*, scegli questo repository e conferma: build command e publish directory vengono letti da `netlify.toml`.
- **Da CLI:**
  ```sh
  npm install -g netlify-cli
  netlify login
  netlify deploy            # anteprima
  netlify deploy --prod     # produzione
  ```
- **Drag & drop:** trascina la cartella del progetto su https://app.netlify.com/drop.

Il sito resta pubblicabile anche con GitHub Pages (`.nojekyll`).
