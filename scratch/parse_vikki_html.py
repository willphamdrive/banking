import re

def main():
    with open("/Users/toanpham/Desktop/banking/scratch/vikki_response.html", "r", encoding="utf-8") as f:
        html = f.read()
    
    print("HTML length:", len(html))
    
    # Let's search for links on the page
    links = re.findall(r'href="([^"]*)"', html)
    print("Total links found:", len(links))
    
    # Filter links that might be job details
    # Look for /tuyen-dung/[slug] or career/ or job/
    tuyen_dung_links = [l for l in links if '/tuyen-dung/' in l and l != 'https://vikkibank.vn/tuyen-dung/' and l != 'https://vikkibank.vn/tuyen-dung/?avia-element-paging=2']
    print("Found potential job links containing /tuyen-dung/:", len(tuyen_dung_links))
    if len(tuyen_dung_links) > 0:
        print("Unique potential job links:")
        for idx, l in enumerate(sorted(list(set(tuyen_dung_links)))[:20]):
            print(f"  {idx}: {l}")

    # Let's print some sample HTML sections containing these links to understand the structure
    if tuyen_dung_links:
        first_link = sorted(list(set(tuyen_dung_links)))[0]
        # Find position of this link in HTML
        pos = html.find(first_link)
        if pos != -1:
            print("\nSample HTML snippet surrounding potential job link:")
            start = max(0, pos - 200)
            end = min(len(html), pos + 300)
            print(html[start:end])

if __name__ == '__main__':
    main()
