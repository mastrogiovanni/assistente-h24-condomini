// Script condiviso tra le pagine: menu "Prodotti" e invio dei form a Netlify Forms.
(() => {
  // ---------- Menu Prodotti ----------
  document.querySelectorAll('.dd').forEach(dd => {
    const btn = dd.querySelector('.dd-btn');
    const set = open => { dd.classList.toggle('open', open); btn.setAttribute('aria-expanded', open); };
    btn.addEventListener('click', e => { e.stopPropagation(); set(!dd.classList.contains('open')); });
    document.addEventListener('click', e => { if (!dd.contains(e.target)) set(false); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') set(false); });
  });

  // ---------- Form di contatto (Netlify Forms) ----------
  // Ogni <form data-netlify="true"> viene inviato in background: la pagina non si ricarica
  // e al posto del form compare il messaggio di conferma (.form-ok nella stessa .form-card).
  // Senza JavaScript il form funziona lo stesso e porta alla pagina indicata in "action".
  document.querySelectorAll('form[data-netlify="true"]').forEach(form => {
    const card = form.closest('.form-card');
    const err = card && card.querySelector('.form-err');
    const submit = form.querySelector('[type=submit]');

    form.addEventListener('submit', async e => {
      e.preventDefault();
      if (err) err.classList.remove('show');
      submit.disabled = true;
      const label = submit.textContent;
      submit.textContent = 'Invio in corso…';
      try {
        const body = new URLSearchParams(new FormData(form)).toString();
        const res = await fetch('/', {
          method: 'POST',
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          body
        });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        card.classList.add('sent');
        card.scrollIntoView({behavior: 'smooth', block: 'center'});
      } catch (_) {
        if (err) err.classList.add('show');
      } finally {
        submit.disabled = false;
        submit.textContent = label;
      }
    });
  });
})();
