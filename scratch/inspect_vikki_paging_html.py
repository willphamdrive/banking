import re

def main():
    with open("/Users/toanpham/Desktop/banking/scratch/vikki_response.html", "r", encoding="utf-8") as f:
        html = f.read()

    # Search for lines containing avia-element-paging
    for line_no, line in enumerate(html.split('\n')):
        if 'avia-element-paging' in line:
            print(f"Line {line_no}: {line.strip()[:300]}")

if __name__ == '__main__':
    main()
