const fs = require('fs');
const files = [
  'src/lib/activityFeed.ts', 'src/lib/challenges.ts', 'src/lib/characters.ts', 
  'src/lib/collectionWorkspace.ts', 'src/lib/collectionRelationships.ts', 
  'src/lib/creatorEngine.ts', 'src/lib/crosslinks.ts', 'src/lib/franchiseEngine.ts', 
  'src/lib/goals.ts', 'src/lib/lifeChapters.ts', 'src/lib/mediaGraph.ts', 
  'src/lib/memory.ts', 'src/lib/memoryInsights.ts', 'src/lib/memoryJournal.ts', 
  'src/lib/museumEngine.ts', 'src/lib/seed.ts', 'src/lib/dashboardGreeting.ts', 'src/lib/achievements.ts'
];

files.forEach(f => {
  if (!fs.existsSync(f)) return;
  let content = fs.readFileSync(f, 'utf8');
  
  content = content.replace(/export\s+const\s+(\w+)\s*(?::\s*[^=]+)?\s*=\s*\[[\s\S]*?\];/g, (match, p1) => {
    return 'export const ' + p1 + ': any[] = [];';
  });
  
  content = content.replace(/export\s+const\s+(\w+)\s*(?::\s*[^=]+)?\s*=\s*\{[\s\S]*?\};/g, (match, p1) => {
    return 'export const ' + p1 + ': any = {};';
  });
  
  fs.writeFileSync(f, content);
});
console.log('Done!');
