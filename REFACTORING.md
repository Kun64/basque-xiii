# Structure refactorisée du projet Basque XIII

## 📁 Nouvelle architecture

Le projet HTML a été refactorisé en une **architecture modulaire** pour améliorer la maintenabilité :

```
basque-xiii/
├── index.html              ← Fichier principal (généré)
├── index.html.template     ← Template de base (éditer ici)
├── build.js               ← Script de build
├── package.json           ← Configuration npm
├── js/
│   ├── script.js         ← Logique refactorisée (sans duplication)
│   └── i18n.js           ← Internationalisation
├── components/            ← Composants HTML réutilisables
│   ├── header.html       ← Navigation
│   └── modals.html       ← Toutes les modales
├── equipes/
├── resumes/
├── joueurs/
├── i18n/
├── images/
└── ...autres dossiers
```

## 🔄 Comment maintenir le projet

### Modifier le contenu HTML

**Ne pas éditer** `index.html` directement. À la place :

1. Modifiez `index.html.template` pour les sections principales
2. Modifiez les fichiers dans `components/` pour les éléments réutilisables

### Ajouter/Modifier un composant

1. **Créer/éditer** le fichier dans `components/`
2. **Ajouter l'include** dans le template :
   ```html
   <!-- @include: components/votre-fichier.html -->
   ```
3. **Générer** le HTML final :
   ```bash
   npm run build
   ```

### Exemple : Ajouter une nouvelle section

```bash
# 1. Créer le composant
echo "<!-- Ma nouvelle section -->" > components/ma-section.html

# 2. Éditer index.html.template et ajouter:
<!-- @include: components/ma-section.html -->

# 3. Générer le fichier final
npm run build
```

## 📜 Scripts disponibles

```bash
npm run build    # Génère index.html à partir du template
npm run dev      # Build + message confirmation
```

## ✨ Améliorations apportées

| Aspect | Avant | Après |
|--------|-------|-------|
| **Taille du fichier** | 571 lignes monolithique | Modulaire (template + composants) |
| **Duplication** | Modales répétées 3 fois | 1 seul fichier `modals.html` |
| **Maintenabilité** | Difficile (tout dans un fichier) | Facile (sections séparées) |
| **JavaScript** | ~160 lignes dupliquées | ~170 lignes refactorisées |
| **Réutilisabilité** | Faible | Haute (composants) |

## 🚀 Prochaines étapes recommandées

1. **Lazy loading images** - Ajouter `loading="lazy"` aux images
2. **Bundler/Minification** - Setup Vite ou esbuild
3. **Tests** - Ajouter des tests e2e (Playwright)
4. **CSS personnalisé** - Passer de Tailwind CDN à local

---

**Notes :**
- Les fichiers `components/*.html` ne contiennent PAS les tags `<html>`, `<head>`, `<body>`
- Le build remplace les balises `<!-- @include: -->` par le contenu du fichier
- `index.html` est généré et ne doit pas être modifié manuellement
