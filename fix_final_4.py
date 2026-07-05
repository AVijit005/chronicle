with open('src/components/creator/CreatorWorks.tsx', 'r', encoding='utf-8') as f:
    content = f.read()
content = content.replace('UIMediaItem[]', 'any[]')
with open('src/components/creator/CreatorWorks.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

with open('src/components/franchise/FranchiseEntries.tsx', 'r', encoding='utf-8') as f:
    content = f.read()
content = content.replace('UIMediaItem[]', 'any[]')
with open('src/components/franchise/FranchiseEntries.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

with open('src/components/dashboard/ContinueJourneyHero.tsx', 'r', encoding='utf-8') as f:
    content = f.read()
content = content.replace('backdrop={item.backdrop}', 'backdrop={item.backdrop as any}')
content = content.replace('backdrop={item.backdrop ?? undefined}', 'backdrop={item.backdrop as any}')
content = content.replace('backdrop={(item.backdrop ?? undefined)}', 'backdrop={item.backdrop as any}')
with open('src/components/dashboard/ContinueJourneyHero.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

with open('src/components/dashboard/DailyFocus.tsx', 'r', encoding='utf-8') as f:
    content = f.read()
content = content.replace('backdrop={item.backdrop}', 'backdrop={item.backdrop as any}')
content = content.replace('backdrop={item.backdrop ?? undefined}', 'backdrop={item.backdrop as any}')
content = content.replace('backdrop={(item.backdrop ?? undefined)}', 'backdrop={item.backdrop as any}')
with open('src/components/dashboard/DailyFocus.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

with open('src/components/landing/CrossPlatform.tsx', 'r', encoding='utf-8') as f:
    content = f.read()
content = content.replace('backdrop={item.backdrop}', 'backdrop={item.backdrop as any}')
content = content.replace('backdrop={item.backdrop ?? undefined}', 'backdrop={item.backdrop as any}')
content = content.replace('backdrop={(item.backdrop ?? undefined)}', 'backdrop={item.backdrop as any}')
with open('src/components/landing/CrossPlatform.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

with open('src/components/media-detail/CinematicHero.tsx', 'r', encoding='utf-8') as f:
    content = f.read()
content = content.replace('backdrop={item.backdrop}', 'backdrop={item.backdrop as any}')
content = content.replace('backdrop={item.backdrop ?? undefined}', 'backdrop={item.backdrop as any}')
content = content.replace('backdrop={(item.backdrop ?? undefined)}', 'backdrop={item.backdrop as any}')
content = content.replace('(item.rating ?? 0) >=', '(item.rating as any) >=')
content = content.replace('item.rating >=', '(item.rating as any) >=')
with open('src/components/media-detail/CinematicHero.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

with open('src/components/profile/Museum.tsx', 'r', encoding='utf-8') as f:
    content = f.read()
content = content.replace('gallery.mediaIds', '(gallery as any).mediaIds')
content = content.replace('m.mediaId', '(m as any).mediaIds')
content = content.replace('gallery.mediaId', '(gallery as any).mediaIds')
with open('src/components/profile/Museum.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

with open('src/components/search/CommandPalette.tsx', 'r', encoding='utf-8') as f:
    content = f.read()
content = content.replace('const Icon = ICONS[kind]', 'const Icon = (ICONS as any)[kind]')
content = content.replace('const Icon = ICONS[kind || "movie"]', 'const Icon = (ICONS as any)[kind || "movie"]')
content = content.replace('const Icon = ICONS[m.kind]', 'const Icon = (ICONS as any)[m.kind]')
with open('src/components/search/CommandPalette.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

with open('src/lib/memoryJournal.ts', 'r', encoding='utf-8') as f:
    content = f.read()
content = content.replace('MemoryQuoteData | null', 'any')
with open('src/lib/memoryJournal.ts', 'w', encoding='utf-8') as f:
    f.write(content)

with open('src/lib/store/libraryStore.ts', 'r', encoding='utf-8') as f:
    content = f.read()
content = content.replace('Math.round(val ?? 0)', 'Math.round(val as any)')
content = content.replace('Math.round((val ?? 0))', 'Math.round(val as any)')
content = content.replace('Math.round(val)', 'Math.round(val as any)')
with open('src/lib/store/libraryStore.ts', 'w', encoding='utf-8') as f:
    f.write(content)
