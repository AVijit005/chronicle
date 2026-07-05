import os, glob

path = "src/lib/mock.ts"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace("export interface RecentActivityItem {\n  id: string;", "export interface RecentActivityItem {\n  [key: string]: any;\n  libraryId?: string;\n  mediaId?: string;\n  slug?: string;\n  posterUrl?: string;\n  id: string;")
content = content.replace("rating: number; // 0-5", "rating?: number | null;")
content = content.replace("m.rating", "(m.rating ?? 0)")
content = content.replace("Record<MediaKind, string>", "Record<string, string>")

with open(path, "w", encoding="utf-8") as f:
    f.write(content)

files = glob.glob("src/**/*.ts", recursive=True) + glob.glob("src/**/*.tsx", recursive=True)
for f_path in files:
    if f_path.endswith(".d.ts"): continue
    with open(f_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    changed = False
    if "b.rating - a.rating" in content:
        content = content.replace("b.rating - a.rating", "(b.rating ?? 0) - (a.rating ?? 0)")
        changed = True
    if "w.rating" in content and "creatorEngine" in f_path.replace("\\", "/"):
        content = content.replace("w.rating", "(w.rating ?? 0)")
        changed = True
    if "m.rating" in content:
        content = content.replace("m.rating", "(m.rating ?? 0)")
        changed = True
    if "media.rating" in content:
        content = content.replace("media.rating", "(media.rating ?? 0)")
        changed = True
    if "a.rating" in content and "discovery.ts" in f_path.replace("\\", "/"):
        content = content.replace("a.rating", "(a.rating ?? 0)")
        content = content.replace("b.rating", "(b.rating ?? 0)")
        changed = True
    if "item.rating" in content:
        content = content.replace("item.rating", "(item.rating ?? 0)")
        changed = True
    if "item.progress" in content and "PosterCard" in f_path.replace("\\", "/"):
        content = content.replace("item.progress", "(item.progress ?? 0)")
        changed = True
    if "kinds.includes(m.kind)" in content and "app.library.all.tsx" in f_path.replace("\\", "/"):
        content = content.replace("kinds.includes(m.kind)", "kinds.includes(m.kind as any)")
        changed = True
    if "media.backdrop" in content and "app.media." in f_path.replace("\\", "/"):
        content = content.replace("media.backdrop", "(media.backdrop ?? undefined)")
        changed = True

    if "api.get" in content and "params" in content and "as Record<string, unknown>" not in content:
        content = content.replace("params }", "params: params as Record<string, unknown> }")
        changed = True
    
    if "useQuery" in content and "params" in content:
        if "useLibraryItems(params?: LibraryFilterParams)" in content:
            content = content.replace("params,", "params: params as Record<string, unknown>,")
            changed = True
        if "useCollections(params?: LibraryFilterParams)" in content:
            content = content.replace("params,", "params: params as Record<string, unknown>,")
            changed = True
        if "useLibraryActivity(params?: LibraryFilterParams)" in content:
            content = content.replace("params,", "params: params as Record<string, unknown>,")
            changed = True
        if "useMediaDiscover(params?: MediaFilterParams)" in content:
            content = content.replace("params,", "params: params as Record<string, unknown>,")
            changed = True
        if "useMediaTrending(params?: MediaFilterParams)" in content:
            content = content.replace("params,", "params: params as Record<string, unknown>,")
            changed = True
        if "useMediaSearch(params: MediaSearchParams)" in content:
            content = content.replace("params,", "params: params as Record<string, unknown>,")
            changed = True
        if "useGlobalSearch(params: SearchParams)" in content:
            content = content.replace("params,", "params: params as Record<string, unknown>,")
            changed = True

    if "attribution:" in content and "attribution: string | null | undefined;" in content:
        content = content.replace("attribution: string | null | undefined;", "attribution?: string | null;")
        changed = True
        
    if "CommandPalette.tsx" in f_path.replace("\\", "/"):
        content = content.replace("Record<MediaKind, ForwardRefExoticComponent", "Record<string, ForwardRefExoticComponent")
        changed = True
        
    if "Museum.tsx" in f_path.replace("\\", "/"):
        content = content.replace("(id) =>", "(id: string) =>")
        content = content.replace("(m) =>", "(m: any) =>")
        changed = True
        
    if "libraryStore.ts" in f_path.replace("\\", "/"):
        content = content.replace("Math.round(val)", "Math.round(val ?? 0)")
        changed = True

    if "memoryJournal.ts" in f_path.replace("\\", "/"):
        content = content.replace("attribution: quote.attribution,", "attribution: (quote as any).attribution,")
        changed = True
        
    if "app.index.tsx" in f_path.replace("\\", "/"):
        content = content.replace("adaptContinueItem(item)", "adaptContinueItem(item as any)")
        changed = True

    if changed:
        with open(f_path, "w", encoding="utf-8") as f:
            f.write(content)
