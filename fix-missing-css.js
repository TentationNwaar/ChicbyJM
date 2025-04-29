const fs = require('fs');
const path = require('path');

// Chemin de base de ton projet
const srcPath = path.join(__dirname, 'src');

// Fonction pour chercher tous les fichiers d'un dossier
function findFiles(dir, extensions) {
  let results = [];
  const list = fs.readdirSync(dir);

  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat && stat.isDirectory()) {
      results = results.concat(findFiles(filePath, extensions));
    } else {
      if (extensions.some(ext => filePath.endsWith(ext))) {
        results.push(filePath);
      }
    }
  });

  return results;
}

// Récupère toutes les utilisations de styles.xxx
function extractStyleClasses(content) {
  const regex = /styles\.([a-zA-Z0-9_]+)/g;
  const matches = [];
  let match;
  while ((match = regex.exec(content)) !== null) {
    matches.push(match[1]);
  }
  return matches;
}

// Lit un CSS module et liste les classes existantes
function readCssClasses(cssPath) {
  if (!fs.existsSync(cssPath)) return [];
  const content = fs.readFileSync(cssPath, 'utf8');
  const regex = /\.([a-zA-Z0-9_-]+)\s*\{/g;
  const classes = [];
  let match;
  while ((match = regex.exec(content)) !== null) {
    classes.push(match[1]);
  }
  return classes;
}

// Ajoute une classe vide au CSS module
function addCssClass(cssPath, className) {
  const content = fs.existsSync(cssPath) ? fs.readFileSync(cssPath, 'utf8') : '';
  const updatedContent = `${content}\n.${className} {\n  /* ajouté automatiquement */\n}\n`;
  fs.writeFileSync(cssPath, updatedContent, 'utf8');
  console.log(`➕ Ajouté .${className} dans ${cssPath}`);
}

// Analyse tous les fichiers
function fixMissingCssClasses() {
  const files = findFiles(srcPath, ['.js', '.jsx', '.tsx']);

  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');

    if (content.includes('import styles')) {
      const classesUsed = extractStyleClasses(content);

      const importRegex = /import styles from ['"](.*?\.module\.css)['"]/;
      const importMatch = content.match(importRegex);

      if (importMatch) {
        const cssImportPath = path.resolve(path.dirname(file), importMatch[1]);
        const existingClasses = readCssClasses(cssImportPath);

        classesUsed.forEach(className => {
          if (!existingClasses.includes(className)) {
            addCssClass(cssImportPath, className);
          }
        });
      }
    }
  });
}

fixMissingCssClasses();