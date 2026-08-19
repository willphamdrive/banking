import re

def main():
    with open("/Users/toanpham/Desktop/banking/scratch/stb_page1.html", "r", encoding="utf-8") as f:
        content = f.read()

    # Search for tile-search-results-label span contents
    match = re.search(r'id="tile-search-results-label"[^>]*>(.*?)</span>', content, re.DOTALL)
    if match:
        print("Label content:", match.group(1).strip())
    else:
        print("Label not found")

if __name__ == '__main__':
    main()
