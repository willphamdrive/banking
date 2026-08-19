import urllib.request
import ssl
import re

def main():
    print("Testing Sacombank page 1...")
    url = "https://sacombankcareer.com/go/V%E1%BB%8A-TR%C3%8D-T%E1%BA%A0I-H%E1%BB%98I-S%E1%BB%9E/628544/"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36 Edg/151.0.0.0'
    }
    
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE

    req = urllib.request.Request(
        url,
        headers=headers,
        method="GET"
    )
    
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=15) as resp:
            content = resp.read().decode("utf-8")
            print("Response loaded successfully! Length:", len(content))
            with open("/Users/toanpham/Desktop/banking/scratch/stb_page1.html", "w", encoding="utf-8") as f:
                f.write(content)
                
            # Search for numbers and text
            # E.g. "of X results" or "X jobs found"
            matches = re.findall(r'(of\s+\d+|showing\s+\d+|results\s+\d+|\d+\s+results|\d+\s+jobs)', content, re.IGNORECASE)
            print("Found potential count texts in page 1:", set(matches))
            
            # Print lines containing pagination or count
            for line in content.split('\n'):
                if any(w in line.lower() for w in ['pagination', 'results-count', 'totalresults', 'total-results', 'showing']):
                    if len(line.strip()) < 500:
                        print("Line:", line.strip())
    except Exception as e:
        print(f"Error occurred: {e}")

if __name__ == '__main__':
    main()
