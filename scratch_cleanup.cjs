const fs = require('fs');

// 1. auth.tsx
let auth = fs.readFileSync('src/routes/auth.tsx', 'utf8');
auth = auth.replace(/\{\/\* Social proof \*\/\}[\s\S]*?chroniclers\n\s*<\/span>\n\s*<\/motion\.div>/, '');
fs.writeFileSync('src/routes/auth.tsx', auth);

// 2. app.analytics.tsx
let analytics = fs.readFileSync('src/routes/app.analytics.tsx', 'utf8');
analytics = analytics.replace(/\{\/\* ============ Zone 7[\s\S]*?\{\/\* ============ Zone 10/g, '{/* ============ Zone 10');
analytics = analytics.replace(/\{\/\* ============ Zone 11[\s\S]*?\{\/\* ============ Zone 17/g, '{/* ============ Zone 17');
analytics = analytics.replace(/\{\/\* ============ Zone 18[\s\S]*?\{\/\* Memory · What Chronicle noticed \*\//g, '{/* Memory · What Chronicle noticed */');
analytics = analytics.replace(/<Zone eyebrow="Discovery"[\s\S]*?<\/Zone>\n\s*<\/div>\n\s*\);\n\}/, '</div>\n  );\n}');
fs.writeFileSync('src/routes/app.analytics.tsx', analytics);

// 3. app.index.tsx
let index = fs.readFileSync('src/routes/app.index.tsx', 'utf8');
index = index.replace(/import \{ DiscoveryHero[^\n]*\n/g, '');
index = index.replace(/import \{ ContinueUniverse[^\n]*\n/g, '');
index = index.replace(/import \{ TasteProfile[^\n]*\n/g, '');
index = index.replace(/<DiscoveryHero[^\n]*\n/g, '');
index = index.replace(/<QuietRecommendations[^\n]*\n/g, '');
index = index.replace(/<ContinueUniverse[^\n]*\n/g, '');
index = index.replace(/<TasteProfile[^\n]*\n/g, '');
fs.writeFileSync('src/routes/app.index.tsx', index);

// 4. app.wrapped.tsx
let wrapped = fs.readFileSync('src/routes/app.wrapped.tsx', 'utf8');
wrapped = wrapped.replace(/import \{ RecommendationCard[^\n]*\n/g, '');
wrapped = wrapped.replace(/import \{ getHiddenGems[^\n]*\n/g, '');
wrapped = wrapped.replace(/import \{ AchievementHero[^\n]*\n/g, '');
wrapped = wrapped.replace(/import \{ StoryImpact[^\n]*\n/g, '');
wrapped = wrapped.replace(/import \{ buildEditorialInsight[^\n]*\n/g, '');
wrapped = wrapped.replace(/<AchievementHero \/>\n/g, '');
wrapped = wrapped.replace(/<p className="glass-subtle[\s\S]*?<\/p>\n/g, '');
wrapped = wrapped.replace(/<StoryImpact \/>\n/g, '');
wrapped = wrapped.replace(/<section className="space-y-4">[\s\S]*?<\/section>\n/g, '');
fs.writeFileSync('src/routes/app.wrapped.tsx', wrapped);

console.log('Cleaned up 4 routes');
