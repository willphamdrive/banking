import urllib.request
import ssl

def main():
    print("Testing Vikki Bank career page...")
    url = "https://vikkibank.vn/tuyen-dung/"
    headers = {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'Accept-Language': 'en-US,en;q=0.9,vi;q=0.8',
        'Referer': 'https://vikkibank.vn/',
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
            with open("/Users/toanpham/Desktop/banking/scratch/vikki_response.html", "w", encoding="utf-8") as f:
                f.write(content)
            print("HTML preview:", content[:500])
    except Exception as e:
        print(f"Error occurred: {e}")

if __name__ == '__main__':
    main()
