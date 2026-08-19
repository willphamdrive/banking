import re

def main():
    with open("/Users/toanpham/Desktop/banking/scratch/vikki_response.html", "r", encoding="utf-8") as f:
        html = f.read()

    # Search for pagination links
    # Look for patterns like ?avia-element-paging=
    paging_links = re.findall(r'avia-element-paging=(\d+)', html)
    print("Found avia-element-paging parameters in HTML:", paging_links)
    
    # Print the links containing avia-element-paging
    links = re.findall(r'href="([^"]*avia-element-paging[^"]*)"', html)
    print("Found paging links:")
    for l in set(links):
        print("  -", l)

if __name__ == '__main__':
    main()
