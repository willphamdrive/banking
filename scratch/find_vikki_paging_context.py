import re

def main():
    with open("/Users/toanpham/Desktop/banking/scratch/vikki_response.html", "r", encoding="utf-8") as f:
        html = f.read()

    for m in re.finditer(r'avia-element-paging=\d+', html):
        start = max(0, m.start() - 100)
        end = min(len(html), m.end() + 150)
        print("MATCH:", m.group())
        print("CONTEXT:", html[start:end])
        print("="*60)

if __name__ == '__main__':
    main()
