import urllib.request
import json
import ssl

def main():
    print("Testing BVBank job search API...")
    url = "https://bvbank.talent.vn/jobs?location=&type=&dept=&return=1"
    headers = {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'Accept-Language': 'en-US,en;q=0.9,vi;q=0.8',
        'Connection': 'keep-alive',
        'Cookie': 'talentssid=f91a3db2ae85bdea46918d2f9db34cf5; lang_talent=vi',
        'Referer': 'https://bvbank.talent.vn/home?office=5322&return=1',
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
        with urllib.request.urlopen(req, context=ctx, timeout=10) as resp:
            content = resp.read().decode("utf-8")
            print("Response loaded successfully! Length:", len(content))
            
            # Let's see if it's JSON or HTML
            try:
                data = json.loads(content)
                print("Response is JSON!")
                with open("/Users/toanpham/Desktop/banking/scratch/bvb_response.json", "w", encoding="utf-8") as f:
                    json.dump(data, f, ensure_ascii=False, indent=2)
                print("Keys in JSON response:", data.keys())
            except json.JSONDecodeError:
                print("Response is HTML!")
                with open("/Users/toanpham/Desktop/banking/scratch/bvb_response.html", "w", encoding="utf-8") as f:
                    f.write(content)
                # Print first 200 chars
                print("HTML preview:", content[:500])
    except Exception as e:
        print(f"Error occurred: {e}")

if __name__ == '__main__':
    main()
