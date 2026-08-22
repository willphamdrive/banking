import urllib.request
import json

def main():
    print("Testing HDBank response keys...")
    url = "http://localhost:8000/api/jobs/hdbank"
    payload = {
        "DataHeader": [{"P2": "", "P3": "", "P4": None, "P5": "0", "P6": "", "P7": "", "P10": "", "P11": ""}],
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
            print("HDBank response keys:", list(data.keys()))
            if "total" in data:
                print("total:", data["total"])
            if "totalRecord" in data:
                print("totalRecord:", data["totalRecord"])
            if "totalPage" in data:
                print("totalPage:", data["totalPage"])
            for k, v in data.items():
                if not isinstance(v, (list, dict)):
                    print(f"  {k}: {v}")
                elif isinstance(v, list):
                    print(f"  {k}: list of length {len(v)}")
                elif isinstance(v, dict):
                    print(f"  {k}: dict with keys {list(v.keys())}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == '__main__':
    main()
