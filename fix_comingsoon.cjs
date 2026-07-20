const fs = require('fs');
const files = [
  'src/components/profile/IdentityHero.tsx',
  'src/components/profile/MediaDNA.tsx',
  'src/components/profile/MemoryCapsules.tsx',
  'src/components/profile/QuoteGallery.tsx',
  'src/components/profile/RelationshipPanel.tsx',
  'src/components/media/StoryJourney.tsx',
  'src/components/media/WhyItWorked.tsx'
];
files.forEach(file => {
  let c = fs.readFileSync(file, 'utf8');
  c = c.replace(/import \{ ComingSoon \} from "@\/components\/ui\/ComingSoon";\n/g, '');
  c = c.replace(/<ComingSoon \/>/g, 'null');
  fs.writeFileSync(file, c);
});
