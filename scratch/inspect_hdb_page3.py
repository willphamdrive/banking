import urllib.request
import json

def main():
    print("Testing HDBank page 3 (P5='2')...")
    url = "http://localhost:8000/api/jobs/hdbank"
    payload = {
        "DataHeader": [{"P2": "", "P3": "", "P4": None, "P5": "2", "P6": "", "P7": "", "P10": "", "P11": ""}],
        "LangID": "241"
    }
    
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json;charset=UTF-8"},
        method="POST"
    )
    
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            items = data.get("dataItem", [])
            print(f"HDBank page 3 returned {len(items)} items.")
            if items:
                print("First item on page 3:", items[0].get("P2"))
    except Exception as e:
        print(f"Error: {e}")

if __name__ == '__main__':
    main()
