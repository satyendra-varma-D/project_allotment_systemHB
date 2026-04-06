import os
import re
import glob

components_dir = r"c:\Users\hb\project_allotment_systemHB\src\app\components"
panel_files = glob.glob(os.path.join(components_dir, "*Panel.tsx"))

# The standardized outer div classes for Side Panels
standard_panel_class = 'fixed right-0 top-0 bottom-0 w-full max-w-2xl bg-white dark:bg-neutral-900 shadow-2xl z-[100] flex flex-col animate-in slide-in-from-right duration-300'

count = 0
for file_path in panel_files:
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Regex to find the side panel div
    # It usually looks like: <div className="fixed right-0... flex-col..."> or <div className="fixed right-0 top-0 h-full w-full max-w-lg bg-white dark:bg-neutral-900 shadow-2xl z-50 overflow-y-auto">
    
    # Let's match `<div className="fixed right-0 [^>]*">`
    # and replace the className contents with the standard ones
    new_content = re.sub(
        r'<div\s+className="fixed right-0[^"]*"',
        f'<div className="{standard_panel_class}"',
        content
    )
    
    if new_content != content:
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(new_content)
        print(f"Updated {os.path.basename(file_path)}")
        count += 1

print(f"Total panels updated: {count}")
