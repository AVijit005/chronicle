import os
import re

components_to_update = [
    r"src\components\atmosphere\ParticleField.tsx",
    r"src\components\ui\EmptyState.tsx",
    r"src\components\ui\PremiumGlass.tsx"
]

for file in components_to_update:
    filepath = os.path.join(r"C:\chronicle-your-media-story-mainzipzip", file)
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # insert import { useTheme } from "@/hooks/use-theme"; if not there
    if "useTheme" not in content:
        # replace import { useState, useEffect } with useTheme + them if needed
        # Or just prepend it.
        content = "import { useTheme } from \"@/hooks/use-theme\";\n" + content
    
    # regex to replace:
    # const [isLight, setIsLight] = useState(false);
    # useEffect(() => {
    #   const ob = new MutationObserver(() => setIsLight(document.documentElement.classList.contains('light')));
    #   ob.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    #   setIsLight(document.documentElement.classList.contains('light'));
    #   return () => ob.disconnect();
    # }, []);
    
    # We can match this multiline block or similar.
    # It might have different spacing.
    content = re.sub(
        r"const\s+\[isLight,\s*setIsLight\]\s*=\s*useState[^;]+;\s*useEffect\(\(\)\s*=>\s*\{[\s\S]*?\}\s*,\s*\[\]\);?",
        "const { isLight } = useTheme();",
        content
    )

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)

print("Updated 3 files.")
