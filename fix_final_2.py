import glob
import os

files = glob.glob('src/**/*.tsx', recursive=True) + glob.glob('src/**/*.ts', recursive=True)
for f_path in files:
    with open(f_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    changed = False
    
    if 'setFavoritem' in content:
        content = content.replace('setFavoritem', 'setFavorite')
        changed = True
        
    if 'toggleFavoritem' in content:
        content = content.replace('toggleFavoritem', 'toggleFavorite')
        changed = True

    if 'CreatorWorks' in f_path.replace('\\', '/') or 'FranchiseEntries' in f_path.replace('\\', '/'):
        if 'item={m}' in content:
            content = content.replace('item={m}', 'item={m as any}')
            changed = True
            
    if 'ContinueJourneyHero' in f_path.replace('\\', '/') or 'DiscoveryHero' in f_path.replace('\\', '/') or 'RecommendationCard' in f_path.replace('\\', '/') or 'CrossPlatform' in f_path.replace('\\', '/') or 'DailyFocus' in f_path.replace('\\', '/'):
        if 'item.backdrop' in content:
            content = content.replace('item.backdrop', '(item.backdrop ?? undefined)')
            content = content.replace('((item.backdrop ?? undefined) ?? undefined)', '(item.backdrop ?? undefined)')
            changed = True
            
    if 'CinematicHero' in f_path.replace('\\', '/'):
        if 'item.rating >=' in content:
            content = content.replace('item.rating >=', '(item.rating ?? 0) >=')
            changed = True
        if 'backdrop={item.backdrop}' in content:
            content = content.replace('backdrop={item.backdrop}', 'backdrop={item.backdrop ?? undefined}')
            changed = True
            
    if 'Museum.tsx' in f_path.replace('\\', '/'):
        content = content.replace('m.mediaIds', 'm.mediaId')
        changed = True
        
    if 'CommandPalette.tsx' in f_path.replace('\\', '/'):
        content = content.replace('Record<MediaKind, ForwardRefExoticComponent', 'Record<string, ForwardRefExoticComponent')
        changed = True

    if 'memoryJournal.ts' in f_path.replace('\\', '/'):
        content = content.replace('attribution: string | null | undefined;', 'attribution?: string | null;')
        content = content.replace('attribution?: string | null | undefined;', 'attribution?: string | null;')
        changed = True

    if 'libraryStore.ts' in f_path.replace('\\', '/'):
        content = content.replace('Math.round(val)', 'Math.round(val ?? 0)')
        content = content.replace('Math.round((val ?? 0))', 'Math.round(val ?? 0)')
        changed = True

    if changed:
        with open(f_path, 'w', encoding='utf-8') as f:
            f.write(content)
