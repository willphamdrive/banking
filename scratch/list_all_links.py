import re
from urllib.parse import urlparse

def main():
    with open("/Users/toanpham/Desktop/banking/scratch/vikki_response.html", "r", encoding="utf-8") as f:
        html = f.read()

    links = set(re.findall(r'href="([^"]*)"', html))
    print(f"Total unique links: {len(links)}")
    
    internal_links = []
    external_links = []
    
    for l in sorted(list(links)):
        if not l:
            continue
        parsed = urlparse(l)
        if 'vikkibank.vn' in parsed.netloc or (not parsed.netloc and l.startswith('/')):
            # Internal
            internal_links.append(l)
        else:
            external_links.append(l)
            
    print(f"\nInternal links count: {len(internal_links)}")
    for idx, l in enumerate(internal_links[:40]):
        print(f"  {idx}: {l}")
        
    print(f"\nExternal links count: {len(external_links)}")
    for idx, l in enumerate(external_links[:10]):
        print(f"  {idx}: {l}")

if __name__ == '__main__':
    main()
