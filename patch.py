import os
import re

hooks_dir = r"C:\chronicle-your-media-story-mainzipzip\src\hooks"
hook_files = [
    "use-analytics.ts",
    "use-collections.ts",
    "use-journal.ts",
    "use-library.ts",
    "use-media.ts",
    "use-notifications.ts",
    "use-search.ts",
    "use-users.ts"
]

for filename in hook_files:
    filepath = os.path.join(hooks_dir, filename)
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    if "useCurrentUser" not in content:
        # insert import
        content = re.sub(r"import \{", "import { useCurrentUser } from '@/hooks/use-auth';\nimport {", content, count=1)

    def func_replacement(m):
        func_body = m.group(0)
        # only insert if we actually return useQuery or useInfiniteQuery in the function body
        if "useQuery(" in func_body or "useInfiniteQuery(" in func_body:
            return m.group(1) + "\n  const { data: user } = useCurrentUser();\n" + m.group(2)
        return m.group(0)
        
    content = re.sub(r"(export function \w+\([^)]*\)(?:\s*:\s*[^\{]+)?\s*\{)([\s\S]*?(?=\nexport function|\Z))", func_replacement, content)
    
    # replace queryFn: with enabled: !!user, queryFn: ONLY if enabled: is not already there
    def replace_query(m):
        q = m.group(0)
        if "enabled:" not in q:
            return re.sub(r"queryFn:", "enabled: !!user,\n    queryFn:", q)
        else:
            return q
            
    content = re.sub(r"(?:useQuery|useInfiniteQuery)\(\{[\s\S]*?\}\);", replace_query, content)

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)
