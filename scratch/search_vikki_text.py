import re

def main():
    with open("/Users/toanpham/Desktop/banking/scratch/vikki_response.html", "r", encoding="utf-8") as f:
        html = f.read()

    # Search for headings
    headings = re.findall(r'<h[1-6][^>]*>(.*?)</h[1-6]>', html, re.DOTALL)
    print(f"Total headings: {len(headings)}")
    for h in headings[:30]:
        clean_h = re.sub('<[^<]+?>', '', h).strip()
        if clean_h:
            print(f"  - {clean_h}")

    # Let's search for "chuyên viên" or "giám đốc" or "nhân viên" in the file
    matches = []
    for line_no, line in enumerate(html.split('\n')):
        if any(w in line.lower() for w in ['chuyên viên', 'giám đốc', 'tuyển dụng', 'developer', 'hội sở', 'nhân viên', 'trưởng phòng']):
            matches.append((line_no, line.strip()))
            
    print(f"\nFound {len(matches)} matching lines containing job-related keywords.")
    for line_no, content in matches[:25]:
        print(f"  Line {line_no}: {content[:150]}")

if __name__ == '__main__':
    main()
