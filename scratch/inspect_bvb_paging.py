import json
import re

def main():
    with open("/Users/toanpham/Desktop/banking/jobs_database.json", "r", encoding="utf-8") as f:
        db = json.load(f)
        
    html = db.get("bvb", {}).get("html", "")
    print("BVBank HTML length:", len(html))
    
    # Search for pagination links or page parameters
    # Let's search for "page=" or pagination related classes
    pages = re.findall(r'page=(\d+)', html)
    print("Page parameters found in links:", set(pages))
    
    # Search for pagination classes like pagination, pagination-wrap, page-link, page-item
    from html.parser import HTMLParser
    class BvbParser(HTMLParser):
        def handle_starttag(self, tag, attrs):
            attrs_dict = dict(attrs)
            classes = attrs_dict.get('class', '')
            tag_id = attrs_dict.get('id', '')
            if any(kw in classes.lower() or kw in tag_id.lower() for kw in ['pagination', 'pag', 'page', 'count']):
                print(f"Tag: {tag}, Class: {classes}, ID: {tag_id}, attributes: {attrs_dict}")
                
    p = BvbParser()
    p.feed(html)

if __name__ == '__main__':
    main()
