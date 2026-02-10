import os
import re

# Define the directory
events_dir = r"c:\Users\LENOVA\OneDrive\Desktop\TechFest2k26\public\pages\tech_fest_events"

# The replacement content
new_footer = """        <footer class="footer"></footer>
        <script src="/js/footer.js"></script>"""

# Regex to find the footer block
# It matches <footer class="footer"> ... </footer>
# We use dotall to match newlines
footer_pattern = re.compile(r'<footer class="footer">.*?</footer>', re.DOTALL)

count = 0
for filename in os.listdir(events_dir):
    if filename.endswith(".html"):
        filepath = os.path.join(events_dir, filename)
        
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # Check if footer exists
        if '<footer class="footer">' in content:
            new_content = footer_pattern.sub(new_footer, content)
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated {filename}")
            count += 1
        else:
            print(f"Footer not found in {filename}")

print(f"Total files updated: {count}")
