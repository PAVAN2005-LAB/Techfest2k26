import os
import re

# Define the directory
events_dir = r"c:\Users\LENOVA\OneDrive\Desktop\TechFest2k26\public\pages\tech_fest_events"

# The replacement content
new_navbar = """    <script src="/js/navbar.js"></script>"""

# Regex to find the navbar blocks (top-bar + side-bar)
# Pattern logic:
# 1. Match <!-- Top Bar --> ... </div>
# 2. Match <!-- Side Bar --> ... </nav>
# We'll try to match them together if they are adjacent, or handle them.
# The previous files showed they appear sequentially.
# Let's match from <div class="top-bar"> to </nav> including comments if possible
# Or just match the two blocks.

# Pattern: <div class="top-bar"> ... </div> ... <nav class="side-bar"> ... </nav>
# We use non-greedy matching .*?
navbar_pattern = re.compile(
    r'(<!--\s*Top Bar\s*-->\s*)?<div class="top-bar">.*?</div>\s*'
    r'(<!--\s*Side Bar\s*-->\s*)?<nav class="side-bar">.*?</nav>', 
    re.DOTALL
)

count = 0
for filename in os.listdir(events_dir):
    if filename.endswith(".html"):
        filepath = os.path.join(events_dir, filename)
        
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # Check if navbar exists
        if '<div class="top-bar">' in content and '<nav class="side-bar">' in content:
            new_content = navbar_pattern.sub(new_navbar, content)
            
            # Double check if substitution happened (regex might fail if html structure varies slightly)
            if new_content != content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"Updated {filename}")
                count += 1
            else:
                 print(f"Regex match failed for {filename} - checking formatting")
        else:
            print(f"Navbar components not found in {filename}")

print(f"Total files updated: {count}")
