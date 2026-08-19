import urllib.request
import json
import traceback

def main():
    print("Fetching jobs from local server...")
    
    # 1. VPBank
    vpb_jobs = []
    try:
        req = urllib.request.Request(
            "http://localhost:8000/api/jobs",
            data=json.dumps({
                "locale": "vi_VN",
                "keywords": "",
                "location": "",
                "pageNumber": 0,
                "facetFilters": { "sfstd_jobLocation_obj": ["Hồ Chí Minh"] },
                "sortBy": "recent"
            }).encode("utf-8"),
            headers={"Content-Type": "application/json"}
        )
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            vpb_jobs = data.get("jobSearchResult", [])
            print(f"Fetched {len(vpb_jobs)} VPB jobs.")
    except Exception as e:
        print(f"Error fetching VPB: {e}")
        
    # 2. MBBank
    mbb_jobs = {}
    try:
        qs = "workGroupId=&name=&skillTags=&city=TX701&size=15&page=1&type=TX105&region=&subRegion=&typicalSkills=&currentProvinceCode=&permanentProvinceCode="
        with urllib.request.urlopen(f"http://localhost:8000/api/jobs/mbbank?{qs}", timeout=10) as resp:
            mbb_jobs = json.loads(resp.read().decode("utf-8"))
            print(f"Fetched MBB page: {len(mbb_jobs.get('content', []))} jobs.")
    except Exception as e:
        print(f"Error fetching MBB: {e}")

    # 3. ACB HCM
    acb_hcm = {}
    try:
        qs = "office=3133&return=1&page=1"
        with urllib.request.urlopen(f"http://localhost:8000/api/jobs/acb?{qs}", timeout=10) as resp:
            # Note: ACB returns HTML text, we don't parse HTML in python easily unless we do regex or simple extraction,
            # but wait, we can just save the raw html or we can let the python scraper run the parse.
            # Wait, let's see. Let's just download the raw html response!
            raw_html = resp.read().decode("utf-8")
            acb_hcm = {"html": raw_html}
            print(f"Fetched ACB HCM HTML length: {len(raw_html)}.")
    except Exception as e:
        print(f"Error fetching ACB: {e}")

    # 4. LPBank
    lpb_jobs = {}
    try:
        qs = "DeltaDataLocation=01000000-6ba6-4a0b-c110-08de81da9f2e&pageIndex=1&pageSize=10&Domain=tuyendung.lpbank.com.vn"
        with urllib.request.urlopen(f"http://localhost:8000/api/jobs/lpbank?{qs}", timeout=10) as resp:
            lpb_jobs = json.loads(resp.read().decode("utf-8"))
            print(f"Fetched LPB jobs: {len(lpb_jobs.get('items', []))} jobs.")
    except Exception as e:
        print(f"Error fetching LPB: {e}")

    # Save to a temporary python raw database file in scratch directory
    result = {
        "vpb": vpb_jobs,
        "mbb": mbb_jobs,
        "acb_hcm": acb_hcm,
        "lpb": lpb_jobs
    }
    with open("/Users/toanpham/Desktop/banking/scratch_raw_jobs.json", "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)
    print("Done. Saved to scratch_raw_jobs.json.")

if __name__ == '__main__':
    main()
