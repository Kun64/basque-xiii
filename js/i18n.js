const DEFAULT_LANG = 'fr';

function getLang() {
  return localStorage.getItem('lang') || DEFAULT_LANG;
}

async function loadTranslations(lang) {
  const res = await fetch(`i18n/${lang}.json`);
  window.__translations = await res.json();
  applyTranslations(document);
}

function applyTranslations(container = document) {
  // Texte
  container.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    const value = getNestedValue(window.__translations, key);
    if (value) {
      el.innerHTML = value;
    }
  });

  // Placeholders
  container.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.dataset.i18nPlaceholder;
    const value = getNestedValue(window.__translations, key);
    if (value) {
      el.setAttribute('placeholder', value);
    }
  });
}

function getNestedValue(obj, path) {
  return path.split('.').reduce((acc, part) => {
    return acc && acc[part];
  }, obj);
}

function setLang(lang) {
  localStorage.setItem('lang', lang);
  loadTranslations(lang);
}

document.addEventListener('DOMContentLoaded', () => {
  loadTranslations(getLang());

  document.querySelectorAll('[data-lang]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault(); // empêche le saut de page
      const lang = link.getAttribute('data-lang');
      setLang(lang);
    });
  });
});
