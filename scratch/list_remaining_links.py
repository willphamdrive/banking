import re
from urllib.parse import urlparse

def main():
    with open("/Users/toanpham/Desktop/banking/scratch/vikki_response.html", "r", encoding="utf-8") as f:
        html = f.read()

    links = set(re.findall(r'href="([^"]*)"', html))
    
    internal_links = []
    for l in sorted(list(links)):
        if not l:
            continue
        parsed = urlparse(l)
        if 'vikkibank.vn' in parsed.netloc or (not parsed.netloc and l.startswith('/')):
            internal_links.append(l)
            
    print(f"Total internal links: {len(internal_links)}")
    for idx, l in enumerate(internal_links[40:]):
        print(f"  {idx+40}: {l}")

if __name__ == '__main__':
    main()
