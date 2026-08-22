import urllib.request
import re
import ssl

def main():
    url = "https://career.hdbank.com.vn/"
    headers = {
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36'
    }
    
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE

    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=10) as resp:
            html = resp.read().decode("utf-8")
            print("Fetched home page successfully.")
            # Search for any job links, like href="/job/..." or href="/co-hoi-nghe-nghiep/..." or similar
            links = re.findall(r'href="([^"]+)"', html)
            job_links = [l for l in links if "job" in l or "tuyen-dung" in l or "career" in l]
            print("Found job links:", job_links[:20])
            
            # Let's save a part of the HTML to inspect
            with open("/Users/toanpham/Desktop/banking/scratch/hdb_home.html", "w", encoding="utf-8") as f:
                f.write(html)
    except Exception as e:
        print("Error:", e)

if __name__ == '__main__':
    main()
