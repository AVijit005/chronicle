const fs = require('fs');
const path = require('path');

const files = [
  'src/components/memory/FirstMoments.tsx',
  'src/components/memory/LifeChapterCard.tsx',
  'src/components/memory/MemoryBookmarks.tsx',
  'src/components/memory/MemoryCapsule.tsx',
  'src/components/memory/MemoryConnections.tsx',
  'src/components/memory/MemoryHighlights.tsx'
];

for (const f of files) {
  let content = fs.readFileSync(f, 'utf8');
  
  // Remove import { MEDIA } from "@/lib/types";
  content = content.replace(/import \{.*?MEDIA.*?\} from ["']@\/lib\/types["'];?\r?\n?/g, '');
  
  // Remove const MEDIA: any[] = [];
  content = content.replace(/const MEDIA:\s*any\[\]\s*=\s*\[\];?\r?\n?/g, '');
  
  // Add import { useLibrary }
  if (!content.includes('useLibrary')) {
    content = 'import { useLibrary } from "@/hooks/use-library";\n' + content;
  }
  
  // Find component declaration to inject the hook
  content = content.replace(/(export function \w+\(.*?\)\s*\{)/, function(match) {
    return match + '\n  const { data: libraryData } = useLibrary({ limit: 100 });\n  const MEDIA = libraryData?.pages.flatMap(p => p.items) || [];';
  });
  
  fs.writeFileSync(f, content, 'utf8');
}
console.log('Fixed memory components');
