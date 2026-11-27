// ============================================================
//  INTERRUTTORI DEL SITO
//  true  = la sezione è visibile (menu, link, pagina)
//  false = la sezione sparisce ovunque e la sua pagina rimanda alla home
// ============================================================
window.SITE_FEATURES = {
  mcp: true,   // Connettori MCP (CedHouse Suite, Gestendo): pagina /mcp/ e voci di menu
};

// ------------------------------------------------------------
// Come funziona (non serve toccarlo):
// - ogni elemento con data-feature="nome" viene nascosto se SITE_FEATURES.nome è false;
// - una pagina con <html data-page-feature="nome"> rimanda alla home se la funzione è spenta.
// Questo file va caricato nel <head>, prima del resto, così non c'è sfarfallio.
// ------------------------------------------------------------
(() => {
  const f = window.SITE_FEATURES;
  const off = Object.keys(f).filter(k => !f[k]);
  const page = document.documentElement.dataset.pageFeature;
  if (page && !f[page]) {
    location.replace(new URL('../', document.currentScript.src).href);
    return;
  }
  if (!off.length) return;
  const css = off.map(k => `[data-feature="${k}"]{display:none!important}`).join('');
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
})();
