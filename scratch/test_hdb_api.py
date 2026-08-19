import urllib.request
import json
import ssl

def main():
    print("Testing HDBank job search API...")
    url = "https://proxyapi.hdbank.com.vn/CVT_HDBank/api/v1/job/search"
    headers = {
        'accept': 'application/json, text/plain, */*',
        'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
        'content-type': 'application/json;charset=UTF-8',
        'origin': 'https://career.hdbank.com.vn',
        'referer': 'https://career.hdbank.com.vn/',
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36 Edg/151.0.0.0'
    }
    payload = {
        "DataHeader": [{"P2": "", "P3": "", "P4": None, "P5": "0", "P6": "", "P7": "", "P10": "", "P11": ""}],
        "LangID": "241"
    }
    
    # Disable SSL verification for testing if needed, though let's keep it default
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE

    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers=headers,
        method="POST"
    )
    
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=10) as resp:
            content = resp.read().decode("utf-8")
            data = json.loads(content)
            print("Response loaded successfully!")
            # Save the first 3 items or keys to see the structure
            with open("/Users/toanpham/Desktop/banking/scratch/hdb_response.json", "w", encoding="utf-8") as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            print("Keys in response:", data.keys() if isinstance(data, dict) else "Not a dict")
            if isinstance(data, dict):
                # Print some keys/subfields
                for k, v in data.items():
                    if isinstance(v, list):
                        print(f"List key: {k}, length: {len(v)}")
                        if len(v) > 0:
                            print("First item keys/fields:", v[0])
                    elif isinstance(v, dict):
                        print(f"Dict key: {k}, subkeys: {v.keys()}")
    except Exception as e:
        print(f"Error occurred: {e}")

if __name__ == '__main__':
    main()
