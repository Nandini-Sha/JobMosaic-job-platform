const fs = require('fs');
const path = require('path');

function generateTree(dirPath, indent = '') {
  const items = fs.readdirSync(dirPath);
  let tree = '';

  items.forEach((item, index) => {
    const fullPath = path.join(dirPath, item);
    const isLast = index === items.length - 1;
    const prefix = isLast ? '└── ' : '├── ';
    tree += `${indent}${prefix}${item}\n`;

    if (fs.statSync(fullPath).isDirectory()) {
      const nextIndent = indent + (isLast ? '    ' : '│   ');
      tree += generateTree(fullPath, nextIndent);
    }
  });

  return tree;
}

const rootDir = '.'; // Change to './frontend' or './backend' if needed
const output = `\`\`\`\n${generateTree(rootDir)}\`\`\``;

fs.writeFileSync('folder-structure.md', output);
console.log('✅ Folder structure saved to folder-structure.md');
