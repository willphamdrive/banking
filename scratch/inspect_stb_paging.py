import re

def main():
    # Let's read from the local fallback static json database or cache if available
    # Wait, we have jobs_database.json which contains stb: { html: ... }
    import json
    with open("/Users/toanpham/Desktop/banking/jobs_database.json", "r", encoding="utf-8") as f:
        db = json.load(f)
        
    html = db.get("stb", {}).get("html", "")
    print("Sacombank HTML length:", len(html))
    
    # Search for pagination
    # Search for links containing startrow=
    startrow_links = re.findall(r'startrow=(\d+)', html)
    print("Startrow parameters found:", startrow_links)
    
    # Look for any text or tags related to pagination
    # E.g. class="pagination", class="page", class="next", or similar
    pagination_divs = re.findall(r'<[^>]*pagination[^>]*>', html)
    print("Pagination divs:", pagination_divs)
    
    # Let's print out all links on Sacombank page to see if there are pagination links
    links = re.findall(r'href="([^"]*)"', html)
    print("Links on page containing pagination words:")
    for l in set(links):
        if any(w in l for w in ['startrow', 'page', 'next']):
            print("  -", l)
            
if __name__ == '__main__':
    main()
