const fs = require('fs');
const path = require('path');

const DIRECTORY = path.join(__dirname, 'src');

function findAndReplaceStrings(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      findAndReplaceStrings(fullPath);
    } else if (
      fullPath.endsWith('.tsx') ||
      fullPath.endsWith('.ts')
    ) {
      let content = fs.readFileSync(fullPath, 'utf8');

      // Do replacements
      content = content.replace(/bg-brand-black/g, 'bg-brand-bg');
      content = content.replace(/bg-brand-charcoal/g, 'bg-brand-surface');
      content = content.replace(/text-white/g, 'text-brand-text');
      content = content.replace(/text-gray-200/g, 'text-brand-muted');
      content = content.replace(/text-gray-300/g, 'text-brand-muted');
      content = content.replace(/text-gray-400/g, 'text-brand-mutedLight');
      content = content.replace(/text-gray-500/g, 'text-brand-mutedLight');
      content = content.replace(/text-gray-600/g, 'text-brand-border');
      content = content.replace(/border-brand-border\/30/g, 'border-brand-border');
      content = content.replace(/border-brand-border\/50/g, 'border-brand-border');
      content = content.replace(/bg-brand-border\/30/g, 'bg-brand-border');
      content = content.replace(/bg-brand-border\/50/g, 'bg-brand-border');

      fs.writeFileSync(fullPath, content, 'utf8');
    }
  }
}

findAndReplaceStrings(DIRECTORY);
console.log('Replaced colors successfully!');
