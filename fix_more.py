import os, glob

files = glob.glob('src/**/*.tsx', recursive=True) + glob.glob('src/**/*.ts', recursive=True)
for f_path in files:
    with open(f_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    changed = False
    
    if "status === \"watching\"" in content:
        content = content.replace("status === \"watching\"", "(status === \"watching\" || status === \"in_progress\")")
        changed = True
        
    if "CinematicHero" in f_path.replace("\\", "/"):
        if "backdrop," in content and "(backdrop" not in content:
            # CinematicHero might be passing backdrop: string | null to something that expects string | undefined
            pass
            
    if "Museum.tsx" in f_path.replace("\\", "/"):
        content = content.replace("m.mediaIds", "m.mediaId")
        changed = True

    if changed:
        with open(f_path, 'w', encoding='utf-8') as f:
            f.write(content)

path = "src/components/media-detail/CinematicHero.tsx"
if os.path.exists(path):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    content = content.replace("getGradientFromOklch(item.accent)", "getGradientFromOklch(item.accent ?? undefined)")
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
