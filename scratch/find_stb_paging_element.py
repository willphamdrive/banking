import re
from html.parser import HTMLParser

class MyHTMLParser(HTMLParser):
    def handle_starttag(self, tag, attrs):
        attrs_dict = dict(attrs)
        classes = attrs_dict.get('class', '')
        tag_id = attrs_dict.get('id', '')
        
        # Check if class or id contains pagination/paging keywords
        if any(kw in classes.lower() or kw in tag_id.lower() for kw in ['pagination', 'paging', 'page', 'count', 'result']):
            print(f"Tag: {tag}, Class: {classes}, ID: {tag_id}")

def main():
    with open("/Users/toanpham/Desktop/banking/scratch/stb_page1.html", "r", encoding="utf-8") as f:
        content = f.read()

    parser = MyHTMLParser()
    parser.feed(content)

if __name__ == '__main__':
    main()
