import glob

# 1. fix setFavoritem and toggleFavoritem
files = glob.glob('src/**/*.tsx', recursive=True) + glob.glob('src/**/*.ts', recursive=True)
for f_path in files:
    with open(f_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    changed = False
    if 'setFavoritem.' in content:
        content = content.replace('setFavoritem.', 'setFavorite(m.')
        changed = True
    if 'toggleFavoritem.' in content:
        content = content.replace('toggleFavoritem.', 'toggleFavorite(m.')
        changed = True
    
    # 3. CinematicHero.tsx
    if 'CinematicHero' in f_path.replace('\\', '/'):
        if 'item.status === "watching" || ' in content:
            content = content.replace('item.status === "watching" || ', '')
            changed = True
        if 'item.rating >=' in content and '(item.rating ?? 0) >=' not in content:
            content = content.replace('item.rating >=', '(item.rating ?? 0) >=')
            changed = True
            
    # PosterCard.tsx
    if 'PosterCard' in f_path.replace('\\', '/'):
        if 'item.rating' in content and '(item.rating ?? 0)' not in content:
            content = content.replace('item.rating', '(item.rating ?? 0)')
            changed = True

    # Museum.tsx
    if 'Museum.tsx' in f_path.replace('\\', '/'):
        content = content.replace('m.mediaId', 'm.mediaIds')
        changed = True
        
    # CreatorWorks and FranchiseEntries
    if 'CreatorWorks' in f_path.replace('\\', '/') or 'FranchiseEntries' in f_path.replace('\\', '/'):
        if 'item={m}' in content:
            content = content.replace('item={m}', 'item={m as any}')
            changed = True

    if changed:
        with open(f_path, 'w', encoding='utf-8') as f:
            f.write(content)

# API generic casting for LibraryFilterParams / SearchParams
# Actually, it's easier to just change the interface definition in src/hooks/use-library.ts etc
api_files = [
    'src/hooks/use-library.ts',
    'src/hooks/use-media.ts',
    'src/hooks/use-search.ts',
    'src/lib/api/library.ts',
    'src/lib/api/media.ts',
    'src/lib/api/search.ts',
]
for f_path in api_files:
    if not glob.os.path.exists(f_path): continue
    with open(f_path, 'r', encoding='utf-8') as f:
        content = f.read()
    changed = False
    if 'export interface LibraryFilterParams {' in content:
        content = content.replace('export interface LibraryFilterParams {', 'export interface LibraryFilterParams {\n  [key: string]: any;')
        changed = True
    if 'export interface MediaFilterParams {' in content:
        content = content.replace('export interface MediaFilterParams {', 'export interface MediaFilterParams {\n  [key: string]: any;')
        changed = True
    if 'export interface MediaSearchParams {' in content:
        content = content.replace('export interface MediaSearchParams {', 'export interface MediaSearchParams {\n  [key: string]: any;')
        changed = True
    if 'export interface SearchParams {' in content:
        content = content.replace('export interface SearchParams {', 'export interface SearchParams {\n  [key: string]: any;')
        changed = True
        
    if changed:
        with open(f_path, 'w', encoding='utf-8') as f:
            f.write(content)
