const fs = require('fs');
const path = require('path');

const stubs = [
  "COLLECTIONS", "JOURNAL", "THIS_WEEK", "ACTIVITY_30D", "STATS", 
  "CALENDAR_HERO", "CALENDAR_INSIGHTS", "YEAR_HEATMAP", "CALENDAR_HIGHLIGHTS", 
  "MEMORY_STREAKS", "UPCOMING_RELEASES", "CALENDAR_YEAR", "JOURNAL_PROMPTS", 
  "MEMORY_CLUSTERS", "QUOTES", "PINNED_MEDIA", "RECENT_JOURNALS", "ACHIEVEMENTS"
];

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) {
      filelist = walkSync(dirFile, filelist);
    } else {
      if (dirFile.endsWith('.ts') || dirFile.endsWith('.tsx')) {
        filelist.push(dirFile);
      }
    }
  });
  return filelist;
};

const files = walkSync('./src');

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;
  let localDecls = "";
  
  for (const stub of stubs) {
    if (content.includes(stub) && content.includes('@/lib/types')) {
      // Remove from import
      // Using literal splits instead of Regex backslashes
      content = content.replace(', ' + stub, '');
      content = content.replace(',' + stub, '');
      content = content.replace(stub + ', ', '');
      content = content.replace(stub + ',', '');
      content = content.replace('{ ' + stub + ' }', '{ }');
      content = content.replace('{' + stub + '}', '{ }');
      
      const isObject = ["STATS", "CALENDAR_HERO", "CALENDAR_INSIGHTS", "YEAR_HEATMAP", "MEMORY_STREAKS", "CALENDAR_YEAR"].includes(stub);
      if (isObject) {
        localDecls += 'const ' + stub + ': any = {};\n';
      } else {
        localDecls += 'const ' + stub + ': any[] = [];\n';
      }
      changed = true;
    }
  }
  
  if (changed) {
    // replace empty imports
    content = content.replace('import { } from "@/lib/types";\n', '');
    content = content.replace('import {} from "@/lib/types";\n', '');
    
    const lines = content.split('\n');
    let lastImportIdx = -1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('import ')) {
        lastImportIdx = i;
      }
    }
    
    if (lastImportIdx !== -1) {
      lines.splice(lastImportIdx + 1, 0, localDecls);
      content = lines.join('\n');
    } else {
      content = localDecls + content;
    }
    
    fs.writeFileSync(file, content, 'utf8');
  }
}
