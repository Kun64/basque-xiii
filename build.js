#!/usr/bin/env node

/**
 * Script de build pour fusionner les composants HTML
 * Utilisation: node build.js
 * 
 * Ce script cherche les balises <!-- @include: components/file.html -->
 * et les remplace par le contenu du fichier
 */

const fs = require('fs');
const path = require('path');

const TEMPLATE_FILE = 'index.html.template';
const OUTPUT_FILE = 'index.html';
const COMPONENTS_DIR = 'components';

const includeRegex = /<!-- @include:\s*(.+?)\s*-->/g;

function readFileSync(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch (err) {
    console.error(`❌ Erreur lecture ${filePath}:`, err.message);
    process.exit(1);
  }
}

function processIncludes(content, baseDir = '') {
  return content.replace(includeRegex, (match, filePath) => {
    const fullPath = path.join(baseDir, COMPONENTS_DIR, filePath.trim());
    console.log(`  ✓ Inclusion: ${filePath}`);
    return readFileSync(fullPath);
  });
}

function build() {
  console.log('🔨 Build HTML en cours...\n');

  // Vérifier que template existe
  if (!fs.existsSync(TEMPLATE_FILE)) {
    console.error(`❌ Fichier template non trouvé: ${TEMPLATE_FILE}`);
    process.exit(1);
  }

  // Lire le template
  const template = readFileSync(TEMPLATE_FILE);

  // Traiter les includes
  const output = processIncludes(template);

  // Écrire le fichier final
  fs.writeFileSync(OUTPUT_FILE, output, 'utf-8');

  console.log(`\n✅ Build réussi!`);
  console.log(`   Fichier généré: ${OUTPUT_FILE}`);
}

// Lancer le build
build();
