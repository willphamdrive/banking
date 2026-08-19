import http.server
import socketserver
import os
import sys
import requests

PORT = 8000

class ProxyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Bổ sung các header CORS để hỗ trợ gọi từ file://
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With, Accept, Authorization')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_GET(self):
        if self.path == '/api/saved-jobs':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            file_path = 'saved_jobs.json'
            if os.path.exists(file_path):
                with open(file_path, 'rb') as f:
                    self.wfile.write(f.read())
            else:
                self.wfile.write(b'[]')
        elif self.path.startswith('/api/jobs/acb'):
            query_string = ""
            if '?' in self.path:
                query_string = self.path.split('?', 1)[1]
            
            target_url = "https://www.acbjobs.com.vn/jobs"
            if query_string:
                target_url += "?" + query_string
                
            headers = {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                'Accept-Language': 'en-US,en;q=0.9,vi;q=0.8',
                'Connection': 'keep-alive',
                'Referer': 'https://www.acbjobs.com.vn/jobs?office=3133&return=1&page=1',
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36 Edg/151.0.0.0',
                'sec-ch-ua': '"Not=A?Brand";v="99", "Microsoft Edge";v="151", "Chromium";v="151"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"macOS"'
            }
            cookies = {
                'talentssid': '698fc15fcc5eff6bfc2386d211c9d3b8',
                'lang_talent': 'vi',
                'consent_landing_seen': '2026-05-29T18%3A10%3A58%2B07%3A00'
            }
            
            try:
                resp = requests.get(target_url, headers=headers, cookies=cookies, timeout=15)
                self.send_response(resp.status_code)
                self.send_header('Content-Type', 'text/html; charset=utf-8')
                self.send_header('Content-Length', str(len(resp.content)))
                self.send_header('Connection', 'close')
                self.end_headers()
                self.wfile.write(resp.content)
            except Exception as e:
                self.send_response(500)
                self.end_headers()
                self.wfile.write(str(e).encode('utf-8'))
        elif self.path.startswith('/api/jobs/lpbank'):
            query_string = ""
            if '?' in self.path:
                query_string = self.path.split('?', 1)[1]
            
            target_url = "https://centralize-api-v2.iviec.vn/api/recruitment/Recruitment/GetRecruitmentsByDomain"
            if query_string:
                target_url += "?" + query_string
                
            headers = {
                'accept': 'application/json, text/plain, */*',
                'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
                'origin': 'https://tuyendung.lpbank.com.vn',
                'priority': 'u=1, i',
                'referer': 'https://tuyendung.lpbank.com.vn/',
                'sec-ch-ua': '"Not=A?Brand";v="99", "Microsoft Edge";v="151", "Chromium";v="151"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"macOS"',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'cross-site',
                'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36 Edg/151.0.0.0'
            }
            
            try:
                resp = requests.get(target_url, headers=headers, timeout=15)
                self.send_response(resp.status_code)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.send_header('Content-Length', str(len(resp.content)))
                self.send_header('Connection', 'close')
                self.end_headers()
                self.wfile.write(resp.content)
            except Exception as e:
                self.send_response(500)
                self.end_headers()
                self.wfile.write(str(e).encode('utf-8'))
        elif self.path.startswith('/api/jobs/tpbank'):
            query_string = ""
            if '?' in self.path:
                query_string = self.path.split('?', 1)[1]
            
            target_url = "https://centralize-api-v2.iviec.vn/api/recruitment/Recruitment/GetRecruitmentsByDomain"
            if query_string:
                target_url += "?" + query_string
                
            headers = {
                'accept': 'application/json, text/plain, */*',
                'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
                'origin': 'https://tuyendung.tpb.vn',
                'priority': 'u=1, i',
                'referer': 'https://tuyendung.tpb.vn/',
                'sec-ch-ua': '"Not=A?Brand";v="99", "Microsoft Edge";v="151", "Chromium";v="151"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"macOS"',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'cross-site',
                'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36 Edg/151.0.0.0'
            }
            
            try:
                resp = requests.get(target_url, headers=headers, timeout=15)
                self.send_response(resp.status_code)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.send_header('Content-Length', str(len(resp.content)))
                self.send_header('Connection', 'close')
                self.end_headers()
                self.wfile.write(resp.content)
            except Exception as e:
                self.send_response(500)
                self.end_headers()
                self.wfile.write(str(e).encode('utf-8'))
        elif self.path.startswith('/api/jobs/mbbank'):
            query_string = ""
            if '?' in self.path:
                query_string = self.path.split('?', 1)[1]
            
            target_url = "https://careers.mbbank.com.vn/libra-job-management/public/recruitment-news"
            if query_string:
                target_url += "?" + query_string
                
            headers = {
                'Accept': 'application/json, text/plain, */*',
                'Accept-Language': 'vn',
                'Connection': 'keep-alive',
                'Referer': 'https://careers.mbbank.com.vn/list-of-posts?type=TX105',
                'Sec-Fetch-Dest': 'empty',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'same-origin',
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36 Edg/151.0.0.0',
                'clientMessageId': '75ac8418-b0d1-47de-980c-1e3fb7d5d7d8',
                'sec-ch-ua': '"Not=A?Brand";v="99", "Microsoft Edge";v="151", "Chromium";v="151"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"macOS"'
            }
            cookies = {
                'mbbank': '872077066.47873.0000'
            }
            
            try:
                resp = requests.get(target_url, headers=headers, cookies=cookies, timeout=15)
                self.send_response(resp.status_code)
                for key, val in resp.headers.items():
                    if key.lower() not in ['content-encoding', 'transfer-encoding', 'content-length', 'connection']:
                        self.send_header(key, val)
                self.send_header('Content-Length', str(len(resp.content)))
                self.send_header('Connection', 'close')
                self.end_headers()
                self.wfile.write(resp.content)
            except Exception as e:
                self.send_response(500)
                self.end_headers()
                self.wfile.write(str(e).encode('utf-8'))
        elif self.path.startswith('/api/jobs/sacombank'):
            query_string = ""
            if '?' in self.path:
                query_string = self.path.split('?', 1)[1]
            
            startrow = 0
            if 'startrow=' in query_string:
                try:
                    parts = query_string.split('startrow=')
                    if len(parts) > 1:
                        startrow = int(parts[1].split('&')[0])
                except ValueError:
                    startrow = 0
                    
            if startrow > 0:
                target_url = f"https://sacombankcareer.com/tile-search-results/category/628544/&startrow={startrow}"
            else:
                target_url = "https://sacombankcareer.com/go/V%E1%BB%8A-TR%C3%8D-T%E1%BA%A0I-H%E1%BB%98I-S%E1%BB%9E/628544/"

            headers = {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                'Accept-Language': 'en-US,en;q=0.9,vi;q=0.8',
                'Connection': 'keep-alive',
                'Referer': 'https://sacombankcareer.com/go/V%E1%BB%8A-TR%C3%8D-T%E1%BA%A0I-H%E1%BB%98I-S%E1%BB%9E/628544/',
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36 Edg/151.0.0.0',
                'sec-ch-ua': '"Not=A?Brand";v="99", "Microsoft Edge";v="151", "Chromium";v="151"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"macOS"'
            }
            try:
                resp = requests.get(target_url, headers=headers, timeout=15)
                self.send_response(resp.status_code)
                self.send_header('Content-Type', 'text/html; charset=utf-8')
                self.send_header('Content-Length', str(len(resp.content)))
                self.send_header('Connection', 'close')
                self.end_headers()
                self.wfile.write(resp.content)
            except Exception as e:
                self.send_response(500)
                self.end_headers()
                self.wfile.write(str(e).encode('utf-8'))
        elif self.path.startswith('/job/'):
            target_url = "https://sacombankcareer.com" + self.path
            headers = {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                'Accept-Language': 'en-US,en;q=0.9,vi;q=0.8',
                'Connection': 'keep-alive',
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36 Edg/151.0.0.0',
                'sec-ch-ua': '"Not=A?Brand";v="99", "Microsoft Edge";v="151", "Chromium";v="151"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"macOS"'
            }
            try:
                resp = requests.get(target_url, headers=headers, timeout=15)
                self.send_response(resp.status_code)
                self.send_header('Content-Type', 'text/html; charset=utf-8')
                self.send_header('Content-Length', str(len(resp.content)))
                self.send_header('Connection', 'close')
                self.end_headers()
                self.wfile.write(resp.content)
            except Exception as e:
                self.send_response(500)
                self.end_headers()
                self.wfile.write(str(e).encode('utf-8'))
        else:
            super().do_GET()

    def do_POST(self):
        if self.path == '/api/saved-jobs':
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            file_path = 'saved_jobs.json'
            try:
                import json
                data = json.loads(post_data.decode('utf-8'))
                with open(file_path, 'w', encoding='utf-8') as f:
                    json.dump(data, f, ensure_ascii=False, indent=2)
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(b'{"status":"success"}')
            except Exception as e:
                self.send_response(500)
                self.end_headers()
                self.wfile.write(str(e).encode('utf-8'))
        elif self.path == '/api/jobs':
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            
            # Gửi tiếp yêu cầu POST lên API của VPBank
            target_url = "https://tuyendung.vpbank.com.vn/services/recruiting/v1/jobs"
            headers = {
                'accept': '*/*',
                'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
                'content-type': 'application/json',
                'origin': 'https://tuyendung.vpbank.com.vn',
                'priority': 'u=1, i',
                'referer': 'https://tuyendung.vpbank.com.vn/search?q=&facetFilters=%7B%22sfstd_jobLocation_obj%22%3A%5B%22H%E1%BB%93+Ch%C3%AD+Minh%22%5D%7D&pageNumber=1',
                'sec-ch-ua': '"Not=A?Brand";v="99", "Microsoft Edge";v="151", "Chromium";v="151"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"macOS"',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-origin',
                'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36 Edg/151.0.0.0',
                'x-csrf-token': 'fe00f1eb-e3b7-4023-b3f1-64e0e6324fed'
            }
            cookies = {
                'visid_incap_3015578': 'JIYPROE9SXa0hKqLV0YJSOWMX2kAAAAAQUIPAAAAAACmD4XssQCpMmlJixy/VwKh',
                'visid_incap_3240839': 'bb/84OQtTHib120o2CbV4OWMX2kAAAAAQUIPAAAAAABvj2qTg9nKs6l332lz7+no',
                'nlbi_3013408': 'XMAtEZXE9FNUim5GNOcgLwAAAADCcxH+z7TQVXCx0E0kZenX',
                'visid_incap_3013408': 'Ra1jH8sjQHi32bJGrYgWpPRHhGoAAAAAQUIPAAAAAABDMFVESTYSQEbN6nAf7ZZE',
                'incap_ses_283_3013408': 'WgJOR09PSjBhQI97rGvtA/RHhGoAAAAAoK2r7f3fprGmh8v7rM9i2Q==',
                'incap_ses_283_3015578': 'Bd3cDfnT7gjOQY97rGvtA/VHhGoAAAAAOtkn/YJJ9Io9/poaN1X51g==',
                'JSESSIONID': 'w2~04FF94FE255ED17F039B9E63E4762132'
            }
            
            try:
                resp = requests.post(target_url, headers=headers, cookies=cookies, data=post_data, timeout=15)
                self.send_response(resp.status_code)
                for key, val in resp.headers.items():
                    if key.lower() not in ['content-encoding', 'transfer-encoding', 'content-length', 'connection']:
                        self.send_header(key, val)
                self.send_header('Content-Length', str(len(resp.content)))
                self.send_header('Connection', 'close')
                self.end_headers()
                self.wfile.write(resp.content)
            except Exception as e:
                self.send_response(500)
                self.end_headers()
                self.wfile.write(str(e).encode('utf-8'))
        else:
            super().do_POST()

class ThreadingTCPServer(socketserver.ThreadingMixIn, socketserver.TCPServer):
    allow_reuse_address = True

if __name__ == '__main__':
    # Di chuyển đến thư mục chứa file script
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)
    
    try:
        with ThreadingTCPServer(("", PORT), ProxyHTTPRequestHandler) as httpd:
            print(f"\n=======================================================")
            print(f"  SERVER LOCAL ĐANG CHẠY TẠI: http://localhost:{PORT}")
            print(f"=======================================================")
            print("  Vui lòng truy cập đường dẫn trên để chạy ứng dụng không bị lỗi CORS.")
            print("  Nhấn Ctrl+C để dừng server.")
            
            # Tự động mở trình duyệt web
            try:
                import webbrowser
                webbrowser.open(f"http://localhost:{PORT}")
            except Exception:
                pass
                
            httpd.serve_forever()
    except Exception as e:
        print(f"Lỗi khởi chạy server: {e}", file=sys.stderr)
