import urllib.request
import json
import traceback
import subprocess
import sys
import os

def run_git_commands():
    try:
        print("\n=== Đang tự động commit và push lên GitHub ===")
        # Di chuyển vào đúng thư mục dự án
        project_dir = "/Users/toanpham/Desktop/banking"
        os.chdir(project_dir)
        
        # Git Add
        subprocess.run(["git", "add", "jobs_database.json"], check=True)
        
        # Kiểm tra xem có thay đổi nào để commit không
        status = subprocess.run(["git", "status", "--porcelain", "jobs_database.json"], capture_output=True, text=True, check=True)
        if not status.stdout.strip():
            print("Không có thay đổi mới trong dữ liệu tuyển dụng. Bỏ qua commit & push.")
            return
            
        # Git Commit
        subprocess.run(["git", "commit", "-m", "Auto-update jobs database snapshot [automated]"], check=True)
        
        # Git Push
        subprocess.run(["git", "push"], check=True)
        print("Đã push thành công dữ liệu mới lên GitHub Pages! Trang web sẽ cập nhật sau vài phút.")
    except Exception as e:
        print(f"Lỗi khi thực hiện lệnh Git: {e}", file=sys.stderr)

def main():
    print("Đang khởi động cào dữ liệu từ server local proxy...")
    
    # 1. VPBank (Fetch pages 0 and 1)
    vpb_jobs = []
    for page in [0, 1]:
        try:
            req = urllib.request.Request(
                "http://localhost:8000/api/jobs",
                data=json.dumps({
                    "locale": "vi_VN",
                    "keywords": "",
                    "location": "",
                    "pageNumber": page,
                    "facetFilters": { "sfstd_jobLocation_obj": ["Hồ Chí Minh"] },
                    "sortBy": "recent"
                }).encode("utf-8"),
                headers={"Content-Type": "application/json"}
            )
            with urllib.request.urlopen(req, timeout=10) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                page_jobs = data.get("jobSearchResult", [])
                vpb_jobs.extend(page_jobs)
                print(f"VPB page {page}: Tải thành công {len(page_jobs)} việc làm.")
        except Exception as e:
            print(f"Lỗi VPB page {page}: {e}")
        
    # 2. MBBank (Fetch pages 1 and 2)
    mbb_content = []
    for page in [1, 2]:
        try:
            qs = f"workGroupId=&name=&skillTags=&city=TX701&size=15&page={page}&type=TX105&region=&subRegion=&typicalSkills=&currentProvinceCode=&permanentProvinceCode="
            with urllib.request.urlopen(f"http://localhost:8000/api/jobs/mbbank?{qs}", timeout=10) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                page_jobs = data.get("content", [])
                mbb_content.extend(page_jobs)
                print(f"MBB page {page}: Tải thành công {len(page_jobs)} việc làm.")
        except Exception as e:
            print(f"Lỗi MBB page {page}: {e}")

    # 3. ACB HCM (office = 3133)
    acb_hcm_html = ""
    try:
        qs = "office=3133&return=1&page=1"
        with urllib.request.urlopen(f"http://localhost:8000/api/jobs/acb?{qs}", timeout=10) as resp:
            acb_hcm_html = resp.read().decode("utf-8")
            print(f"ACB HCM HTML: Tải thành công (Độ dài: {len(acb_hcm_html)} ký tự).")
    except Exception as e:
        print(f"Lỗi ACB HCM: {e}")

    # 4. ACB HO (office = 86)
    acb_ho_html = ""
    try:
        qs = "office=86&return=1&page=1"
        with urllib.request.urlopen(f"http://localhost:8000/api/jobs/acb?{qs}", timeout=10) as resp:
            acb_ho_html = resp.read().decode("utf-8")
            print(f"ACB HO HTML: Tải thành công (Độ dài: {len(acb_ho_html)} ký tự).")
    except Exception as e:
        print(f"Lỗi ACB HO: {e}")

    # 5. LPBank (pages 1 and 2)
    lpb_items = []
    for page in [1, 2]:
        try:
            qs = f"DeltaDataLocation=01000000-6ba6-4a0b-c110-08de81da9f2e&pageIndex={page}&pageSize=10&Domain=tuyendung.lpbank.com.vn"
            with urllib.request.urlopen(f"http://localhost:8000/api/jobs/lpbank?{qs}", timeout=10) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                page_jobs = data.get("items", [])
                lpb_items.extend(page_jobs)
                print(f"LPB page {page}: Tải thành công {len(page_jobs)} việc làm.")
        except Exception as e:
            print(f"Lỗi LPB page {page}: {e}")

    # 6. Sacombank
    stb_html_parts = []
    try:
        with urllib.request.urlopen("http://localhost:8000/api/jobs/sacombank", timeout=15) as resp:
            stb_html_parts.append(resp.read().decode("utf-8"))
            print("Sacombank page 1: Tải thành công.")
    except Exception as e:
        print(f"Lỗi Sacombank page 1: {e}")
        
    for startrow in [20, 40]:
        try:
            with urllib.request.urlopen(f"http://localhost:8000/api/jobs/sacombank?startrow={startrow}", timeout=15) as resp:
                stb_html_parts.append(resp.read().decode("utf-8"))
                print(f"Sacombank startrow {startrow}: Tải thành công.")
        except Exception as e:
            print(f"Lỗi Sacombank startrow {startrow}: {e}")
    stb_html = "\n".join(stb_html_parts)

    # 7. TPBank (pages 1 and 2)
    tpb_items = []
    for page in [1, 2]:
        try:
            qs = f"DeltaDataLocation=01000000-8233-ea27-774b-08ddec65d5a3&pageIndex={page}&pageSize=10&Domain=tuyendung.tpb.vn"
            with urllib.request.urlopen(f"http://localhost:8000/api/jobs/tpbank?{qs}", timeout=10) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                page_jobs = data.get("items", [])
                tpb_items.extend(page_jobs)
                print(f"TPB page {page}: Tải thành công {len(page_jobs)} việc làm.")
        except Exception as e:
            print(f"Lỗi TPB page {page}: {e}")

    # 8. HDBank (pages 1 and 2)
    hdb_jobs = []
    for page in [1, 2]:
        try:
            req = urllib.request.Request(
                "http://localhost:8000/api/jobs/hdbank",
                data=json.dumps({
                    "DataHeader": [{"P2": "", "P3": "", "P4": None, "P5": str(page - 1), "P6": "", "P7": "", "P10": "", "P11": ""}],
                    "LangID": "241"
                }).encode("utf-8"),
                headers={"Content-Type": "application/json;charset=UTF-8"}
            )
            with urllib.request.urlopen(req, timeout=10) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                page_jobs = data.get("dataItem", [])
                hdb_jobs.extend(page_jobs)
                print(f"HDB page {page}: Tải thành công {len(page_jobs)} việc làm.")
        except Exception as e:
            print(f"Lỗi HDB page {page}: {e}")

    # Tạo cấu trúc lưu trữ
    result = {
        "vpb": vpb_jobs,
        "mbb": {
            "content": mbb_content,
            "totalPages": 2
        },
        "acb_hcm": {
            "html": acb_hcm_html,
            "totalPages": 1
        },
        "acb_ho": {
            "html": acb_ho_html,
            "totalPages": 1
        },
        "lpb": {
            "items": lpb_items,
            "totalPage": 2
        },
        "stb": {
            "html": stb_html
        },
        "tpb": {
            "items": tpb_items,
            "totalPage": 2
        },
        "hdb": hdb_jobs
    }
    
    output_path = "/Users/toanpham/Desktop/banking/jobs_database.json"
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)
    print(f"Đã lưu cơ sở dữ liệu kết hợp vào: {output_path}")

    # Thực hiện commit và push lên Github
    run_git_commands()

if __name__ == '__main__':
    main()
