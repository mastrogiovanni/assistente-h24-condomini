// Script condiviso tra le pagine: menu "Prodotti" e form di contatto via e-mail.

// Indirizzo che riceve le richieste dei form. Cambialo qui se serve.
const SITE_EMAIL = 'info@elpaproject.com';

(() => {
  // ---------- Menu Prodotti ----------
  document.querySelectorAll('.dd').forEach(dd => {
    const btn = dd.querySelector('.dd-btn');
    const set = open => { dd.classList.toggle('open', open); btn.setAttribute('aria-expanded', open); };
    btn.addEventListener('click', e => { e.stopPropagation(); set(!dd.classList.contains('open')); });
    document.addEventListener('click', e => { if (!dd.contains(e.target)) set(false); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') set(false); });
  });

  // ---------- Badge "Powered by Netlify" ----------
  // Netlify aggiunge in fondo alla pagina un <iframe id="nl-badge-frame">. Lo nascondiamo appena
  // compare, anche se viene inserito dopo il caricamento. Il CSS in shared.css fa lo stesso.
  const hideBadge = () => document.querySelectorAll('#nl-badge-frame').forEach(f => {
    f.style.setProperty('display', 'none', 'important');
    f.setAttribute('aria-hidden', 'true');
    f.tabIndex = -1;
  });
  hideBadge();
  new MutationObserver(hideBadge).observe(document.documentElement, {childList: true, subtree: true});
  window.addEventListener('load', hideBadge);

  // ---------- Form di contatto (e-mail) ----------
  // Il sito è statico e non ha un backend: ogni <form data-mail="Oggetto"> prepara un'e-mail
  // verso SITE_EMAIL con l'oggetto indicato e i campi compilati, e apre il programma di posta
  // del visitatore. La richiesta arriva quando il visitatore preme "Invia" nella sua posta.
  const label = el => {
    if (!el) return '';
    const c = el.cloneNode(true);
    c.querySelectorAll('i').forEach(i => i.remove());
    return c.textContent.replace('*', '').trim();
  };

  document.querySelectorAll('[data-mail-address]').forEach(a => {
    a.href = 'mailto:' + SITE_EMAIL;
    a.textContent = SITE_EMAIL;
  });

  document.querySelectorAll('form[data-mail]').forEach(form => {
    const card = form.closest('.form-card');
    const back = card && card.querySelector('.form-back');
    if (back) back.addEventListener('click', () => card.classList.remove('sent'));

    form.addEventListener('submit', e => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const lines = [];
      const groups = {};
      form.querySelectorAll('input, select, textarea').forEach(f => {
        if (!f.name || f.type === 'hidden' || f.name === 'consenso') return;
        if (f.type === 'checkbox') {
          // Gruppi di scelte multiple (name="strumenti[]"): un'unica riga con tutti i valori scelti.
          if (!groups[f.name]) {
            const wrap = f.closest('.full');
            groups[f.name] = {title: label(wrap && wrap.querySelector('.fl')) || f.name, values: []};
            lines.push(groups[f.name]);
          }
          if (f.checked) groups[f.name].values.push(f.value);
          return;
        }
        const v = f.value.trim();
        if (!v) return;
        const t = label(form.querySelector('label[for="' + f.id + '"]')) || f.name;
        lines.push(t + (/[?:]$/.test(t) ? ' ' : ': ') + v);
      });
      const body = lines
        .map(l => typeof l === 'string' ? l : (l.values.length ? l.title + ' ' + l.values.join(', ') : ''))
        .filter(Boolean)
        .join('\n');
      location.href = 'mailto:' + SITE_EMAIL +
        '?subject=' + encodeURIComponent(form.dataset.mail) +
        '&body=' + encodeURIComponent(body);
      card.classList.add('sent');
      card.scrollIntoView({behavior: 'smooth', block: 'center'});
    });
  });
})();
