import glob

files = glob.glob('src/**/*.ts', recursive=True) + glob.glob('src/**/*.tsx', recursive=True)
for f_path in files:
    with open(f_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    changed = False
    
    if 'm.(status' in content:
        content = content.replace('m.(status === "watching" || status === "in_progress")', '(m.status === "watching" || m.status === "in_progress")')
        changed = True
        
    if 'item.(status' in content:
        content = content.replace('item.(status === "watching" || status === "in_progress")', '(item.status === "watching" || item.status === "in_progress")')
        changed = True
        
    if changed:
        with open(f_path, 'w', encoding='utf-8') as f:
            f.write(content)
