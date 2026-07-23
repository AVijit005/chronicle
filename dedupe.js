const fs = require('fs');
const path = require('path');
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

const stubs = [
  "COLLECTIONS", "JOURNAL", "THIS_WEEK", "ACTIVITY_30D", "STATS", 
  "CALENDAR_HERO", "CALENDAR_INSIGHTS", "YEAR_HEATMAP", "CALENDAR_HIGHLIGHTS", 
  "MEMORY_STREAKS", "UPCOMING_RELEASES", "CALENDAR_YEAR", "JOURNAL_PROMPTS", 
  "MEMORY_CLUSTERS", "QUOTES", "PINNED_MEDIA", "RECENT_JOURNALS", "ACHIEVEMENTS", "MEDIA"
];

for (const file of walkSync('./src')) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;
  let lines = content.split('\n');
  let newLines = [];
  let seen = new Set();
  
  for (let line of lines) {
    let isStubDecl = false;
    for (const stub of stubs) {
      if (line.trim().startsWith('const ' + stub + ': any') || line.trim().startsWith('const ' + stub + ' : any')) {
        isStubDecl = true;
        if (!seen.has(stub)) {
          seen.add(stub);
          newLines.push(line);
        }
        break;
      }
    }
    if (!isStubDecl) {
      newLines.push(line);
    } else {
      changed = true;
    }
  }
  
  if (changed) {
    fs.writeFileSync(file, newLines.join('\n'), 'utf8');
  }
}
