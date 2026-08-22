import re
import json

def main():
    with open("/Users/toanpham/Desktop/banking/jobs_database.json", "r", encoding="utf-8") as f:
        db = json.load(f)
        
    html = db.get("stb", {}).get("html", "")
    
    # Search for numbers and text
    # E.g. "Showing 1 - 20 of X" or similar SuccessFactors patterns
    matches = re.findall(r'(of\s+\d+|showing\s+\d+|results\s+\d+|\d+\s+results|\d+\s+jobs)', html, re.IGNORECASE)
    print("Found potential count texts:", set(matches))
    
    # Print lines containing "results" or "jobs" or class="pagination"
    for line in html.split('\n'):
        if any(w in line.lower() for w in ['pagination', 'pagination-meta', 'total-results', 'search-results-pagination', 'showing']):
            if len(line.strip()) < 500:
                print("Line:", line.strip())

if __name__ == '__main__':
    main()
