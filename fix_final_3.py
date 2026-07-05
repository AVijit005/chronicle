import glob

files = glob.glob('src/**/*.tsx', recursive=True) + glob.glob('src/**/*.ts', recursive=True)
for f_path in files:
    with open(f_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    changed = False

    if 'BottomBorderInput.tsx' in f_path.replace('\\', '/'):
        if 'const gradCore = (a: typeof V.coreDim, c: typeof V.centerDim) =>' in content:
            content = content.replace('const gradCore = (a: typeof V.coreDim, c: typeof V.centerDim) =>', 'const gradCore = (a: string, c: string) =>')
            changed = True
            
    if 'CreatorWorks' in f_path.replace('\\', '/') or 'FranchiseEntries' in f_path.replace('\\', '/'):
        if 'item={m}' in content:
            content = content.replace('item={m}', 'item={m as any}')
            changed = True
            
    if 'Museum.tsx' in f_path.replace('\\', '/'):
        if 'm.mediaIds' in content:
            content = content.replace('m.mediaIds', 'm.mediaId')
            changed = True
        if 'id =>' in content:
            content = content.replace('id =>', '(id: string) =>')
            changed = True
            
    if 'CommandPalette.tsx' in f_path.replace('\\', '/'):
        if 'Record<MediaKind, ForwardRefExoticComponent' in content:
            content = content.replace('Record<MediaKind, ForwardRefExoticComponent', 'Record<string, ForwardRefExoticComponent')
            changed = True

    if 'memoryJournal.ts' in f_path.replace('\\', '/'):
        if 'attribution: string | null | undefined;' in content:
            content = content.replace('attribution: string | null | undefined;', 'attribution?: string | null;')
            changed = True
            
    if 'libraryStore.ts' in f_path.replace('\\', '/'):
        if 'Math.round(val)' in content:
            content = content.replace('Math.round(val)', 'Math.round(val ?? 0)')
            changed = True

    # Fix item.backdrop string | null | undefined
    if 'backdrop={item.backdrop}' in content:
        content = content.replace('backdrop={item.backdrop}', 'backdrop={item.backdrop ?? undefined}')
        changed = True
    if 'backdrop={m.backdrop}' in content:
        content = content.replace('backdrop={m.backdrop}', 'backdrop={m.backdrop ?? undefined}')
        changed = True
    if 'accent={item.accent}' in content:
        content = content.replace('accent={item.accent}', 'accent={item.accent ?? undefined}')
        changed = True
    if 'accent={m.accent}' in content:
        content = content.replace('accent={m.accent}', 'accent={m.accent ?? undefined}')
        changed = True

    if 'CinematicHero.tsx' in f_path.replace('\\', '/'):
        if 'item.rating >=' in content and '(item.rating ?? 0) >=' not in content:
            content = content.replace('item.rating >=', '(item.rating ?? 0) >=')
            changed = True

    if changed:
        with open(f_path, 'w', encoding='utf-8') as f:
            f.write(content)
