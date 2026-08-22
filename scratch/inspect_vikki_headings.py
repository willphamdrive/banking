import re

def main():
    with open("/Users/toanpham/Desktop/banking/scratch/vikki_response.html", "r", encoding="utf-8") as f:
        html = f.read()

    # Find heading tags (h1-h6) and see if they contain links
    headings = re.findall(r'(<h[1-6][^>]*>.*?</h[1-6]>)', html, re.DOTALL)
    print("Found headings:")
    for h in headings:
        if 'tuyển dụng' in h.lower() or 'chuyên viên' in h.lower() or 'nhân viên' in h.lower() or 'trưởng bộ phận' in h.lower() or 'qlcc' in h.lower():
            # Print the heading and some context
            pos = html.find(h)
            start = max(0, pos - 150)
            end = min(len(html), pos + len(h) + 300)
            print("\n" + "="*50)
            print("HEADING:", h.strip())
            print("CONTEXT:")
            print(html[start:end])

if __name__ == '__main__':
    main()
