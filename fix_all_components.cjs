const fs = require('fs');
const path = require('path');
const execSync = require('child_process').execSync;

const pattern = 'import.*from.*(discovery|intelligence|recommendationEngine|profileEngine|statsEngine|collectionEngine|mediaStory|quoteEngine|memoryCapsuleEngine|relationshipEngine|resurfacing|searchIndex|smartCollections|tagEngine|productAudit)';

try {
  const result = execSync(`Get-ChildItem -Path src -Recurse -File | Select-String "${pattern}"`, { shell: 'powershell.exe' }).toString();
  const lines = result.split('\n');
  const filesToFix = new Set();
  
  lines.forEach(line => {
    const match = line.match(/^(src\\[^:]+\.tsx?)/);
    if (match) {
      filesToFix.add(match[1]);
    }
  });

  filesToFix.forEach(file => {
    const isComponent = file.includes('components\\');
    if (isComponent) {
      const content = fs.readFileSync(file, 'utf8');
      const exports = [];
      const exportRegex = /export\s+(?:const|function)\s+([A-Za-z0-9_]+)/g;
      let m;
      while ((m = exportRegex.exec(content)) !== null) {
        exports.push(m[1]);
      }
      
      let newContent = '';
      exports.forEach(exp => {
        newContent += `export function ${exp}(props: any) { return null; }\n`;
      });
      fs.writeFileSync(file, newContent);
      console.log('Stubbed component:', file);
    }
  });

} catch (e) {
  console.log('Error', e);
}
