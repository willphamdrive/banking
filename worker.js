export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname;
    const searchParams = url.searchParams;
    const method = request.method;

    // Handle CORS preflight options request for API routes
    if (method === "OPTIONS" && (pathname.startsWith("/api/") || pathname.startsWith("/job/"))) {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, X-Requested-With, Accept, Authorization, clientMessageId",
          "Access-Control-Max-Age": "86400"
        }
      });
    }

    // 1. Route: saved-jobs API
    if (pathname === "/api/saved-jobs") {
      if (method === "GET") {
        if (env.SAVED_JOBS) {
          try {
            const list = await env.SAVED_JOBS.get("jobs_list");
            if (list) {
              return new Response(list, {
                headers: {
                  "Content-Type": "application/json; charset=utf-8",
                  "Access-Control-Allow-Origin": "*",
                  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                  "Access-Control-Allow-Headers": "Content-Type"
                }
              });
            }
          } catch (e) {
            console.error("Error reading from SAVED_JOBS KV:", e);
          }
        }

        // Return default jobs list if KV is not bound or empty
        return new Response(JSON.stringify(getDefaultJobs(), null, 2), {
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type"
          }
        });
      } else if (method === "POST") {
        try {
          const list = await request.json();
          if (env.SAVED_JOBS) {
            await env.SAVED_JOBS.put("jobs_list", JSON.stringify(list));
            return new Response(JSON.stringify({ status: "success" }), {
              headers: {
                "Content-Type": "application/json; charset=utf-8",
                "Access-Control-Allow-Origin": "*"
              }
            });
          }
          return new Response(JSON.stringify({ status: "success", note: "No KV bound, using browser localStorage fallback" }), {
            headers: {
              "Content-Type": "application/json; charset=utf-8",
              "Access-Control-Allow-Origin": "*"
            }
          });
        } catch (err) {
          return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: {
              "Content-Type": "application/json; charset=utf-8",
              "Access-Control-Allow-Origin": "*"
            }
          });
        }
      }
    }

    // 2. Route: jobs recruitment proxies
    if (pathname.startsWith("/api/jobs")) {
      try {
        let targetUrl = "";
        let headers = {
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        };
        let body = null;

        if (pathname.startsWith("/api/jobs/acb")) {
          const qs = searchParams.toString();
          targetUrl = "https://www.acbjobs.com.vn/jobs" + (qs ? "?" + qs : "");
          headers = {
            ...headers,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9,vi;q=0.8',
            'Referer': 'https://www.acbjobs.com.vn/jobs?office=3133&return=1&page=1',
            'Cookie': 'talentssid=698fc15fcc5eff6bfc2386d211c9d3b8; lang_talent=vi; consent_landing_seen=2026-05-29T18%3A10%3A58%2B07%3A00'
          };
        } else if (pathname.startsWith("/api/jobs/bvbank")) {
          const qs = searchParams.toString();
          targetUrl = "https://bvbank.talent.vn/jobs" + (qs ? "?" + qs : "");
          headers = {
            ...headers,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9,vi;q=0.8',
            'Referer': 'https://bvbank.talent.vn/home?office=5322&return=1',
            'Cookie': 'talentssid=f91a3db2ae85bdea46918d2f9db34cf5; lang_talent=vi'
          };
        } else if (pathname.startsWith("/api/jobs/vikki")) {
          const qs = searchParams.toString();
          targetUrl = "https://vikkibank.vn/tuyen-dung/" + (qs ? "?" + qs : "");
          headers = {
            ...headers,
            'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
            'referer': 'https://vikkibank.vn/tuyen-dung/',
            'Cookie': 'pll_language=vi; _wpfuuid=95f89a92-983b-4f8e-8680-137183df0189'
          };
        } else if (pathname.startsWith("/api/jobs/lpbank")) {
          const qs = searchParams.toString();
          targetUrl = "https://centralize-api-v2.iviec.vn/api/recruitment/Recruitment/GetRecruitmentsByDomain" + (qs ? "?" + qs : "");
          headers = {
            ...headers,
            'accept': 'application/json, text/plain, */*',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
            'origin': 'https://tuyendung.lpbank.com.vn',
            'referer': 'https://tuyendung.lpbank.com.vn/'
          };
        } else if (pathname.startsWith("/api/jobs/tpbank")) {
          const qs = searchParams.toString();
          targetUrl = "https://centralize-api-v2.iviec.vn/api/recruitment/Recruitment/GetRecruitmentsByDomain" + (qs ? "?" + qs : "");
          headers = {
            ...headers,
            'accept': 'application/json, text/plain, */*',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
            'origin': 'https://tuyendung.tpb.vn',
            'referer': 'https://tuyendung.tpb.vn/'
          };
        } else if (pathname.startsWith("/api/jobs/namabank")) {
          const qs = searchParams.toString();
          targetUrl = "https://centralize-api-v2.iviec.vn/api/recruitment/Recruitment/GetRecruitmentsByDomain" + (qs ? "?" + qs : "");
          headers = {
            ...headers,
            'accept': 'application/json, text/plain, */*',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
            'origin': 'https://tuyendung.namabank.com.vn',
            'referer': 'https://tuyendung.namabank.com.vn/'
          };
        } else if (pathname.startsWith("/api/jobs/mbbank")) {
          const qs = searchParams.toString();
          targetUrl = "https://careers.mbbank.com.vn/libra-job-management/public/recruitment-news" + (qs ? "?" + qs : "");
          headers = {
            ...headers,
            'Accept': 'application/json, text/plain, */*',
            'Accept-Language': 'vn',
            'Referer': 'https://careers.mbbank.com.vn/list-of-posts?type=TX105',
            'clientMessageId': '75ac8418-b0d1-47de-980c-1e3fb7d5d7d8',
            'Cookie': 'mbbank=872077066.47873.0000'
          };
        } else if (pathname.startsWith("/api/jobs/sacombank")) {
          const startrowStr = searchParams.get("startrow");
          const startrow = startrowStr ? parseInt(startrowStr) : 0;
          if (startrow > 0) {
            targetUrl = `https://sacombankcareer.com/tile-search-results/category/628544/&startrow=${startrow}`;
          } else {
            targetUrl = "https://sacombankcareer.com/go/V%E1%BB%8A-TR%C3%8D-T%E1%BA%A0I-H%E1%BB%98I-S%E1%BB%9E/628544/";
          }
          headers = {
            ...headers,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*',
            'Accept-Language': 'en-US,en;q=0.9,vi;q=0.8',
            'Referer': 'https://sacombankcareer.com/go/V%E1%BB%8A-TR%C3%8D-T%E1%BA%A0I-H%E1%BB%98I-S%E1%BB%9E/628544/'
          };
        } else if (pathname === "/api/jobs/hdbank" && method === "POST") {
          targetUrl = "https://proxyapi.hdbank.com.vn/CVT_HDBank/api/v1/job/search";
          headers = {
            ...headers,
            'accept': 'application/json, text/plain, */*',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
            'content-type': 'application/json;charset=UTF-8',
            'origin': 'https://career.hdbank.com.vn',
            'referer': 'https://career.hdbank.com.vn/'
          };
          body = await request.text();
        } else if (pathname === "/api/jobs" && method === "POST") {
          targetUrl = "https://tuyendung.vpbank.com.vn/services/recruiting/v1/jobs";
          headers = {
            ...headers,
            'accept': '*/*',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
            'content-type': 'application/json',
            'origin': 'https://tuyendung.vpbank.com.vn',
            'referer': 'https://tuyendung.vpbank.com.vn/search?q=&facetFilters=%7B%22sfstd_jobLocation_obj%22%3A%5B%22H%E1%BB%93+Ch%C3%AD+Minh%22%5D%7D&pageNumber=1',
            'x-csrf-token': 'fe00f1eb-e3b7-4023-b3f1-64e0e6324fed',
            'Cookie': 'visid_incap_3015578=JIYPROE9SXa0hKqLV0YJSOWMX2kAAAAAQUIPAAAAAACmD4XssQCpMmlJixy/VwKh; visid_incap_3240839=bb/84OQtTHib120o2CbV4OWMX2kAAAAAQUIPAAAAAABvj2qTg9nKs6l332lz7+no; nlbi_3013408=XMAtEZXE9FNUim5GNOcgLwAAAADCcxH+z7TQVXCx0E0kZenX; visid_incap_3013408=Ra1jH8sjQHi32bJGrYgWpPRHhGoAAAAAQUIPAAAAAABDMFVESTYSQEbN6nAf7ZZE; incap_ses_283_3013408=WgJOR09PSjBhQI97rGvtA/RHhGoAAAAAoK2r7f3fprGmh8v7rM9i2Q==; incap_ses_283_3015578=Bd3cDfnT7gjOQY97rGvtA/VHhGoAAAAAOtkn/YJJ9Io9/poaN1X51g==; JSESSIONID=w2~04FF94FE255ED17F039B9E63E4762132'
          };
          body = await request.text();
        } else {
          return new Response(JSON.stringify({ error: "Endpoint Not Found", path: pathname }), {
            status: 404,
            headers: { "Content-Type": "application/json" }
          });
        }

        const fetchOptions = {
          method: method,
          headers: headers
        };

        if (body) {
          fetchOptions.body = body;
        }

        const response = await fetch(targetUrl, fetchOptions);

        const newHeaders = new Headers();
        newHeaders.set("Access-Control-Allow-Origin", "*");
        newHeaders.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        newHeaders.set("Access-Control-Allow-Headers", "Content-Type, X-Requested-With, Accept, Authorization, clientMessageId");

        for (const [key, value] of response.headers.entries()) {
          const lowerKey = key.toLowerCase();
          if (![
            'content-encoding', 
            'transfer-encoding', 
            'content-length', 
            'connection',
            'access-control-allow-origin',
            'access-control-allow-methods',
            'access-control-allow-headers'
          ].includes(lowerKey)) {
            newHeaders.set(key, value);
          }
        }

        if (!newHeaders.has("Content-Type")) {
          const isJson = pathname.includes("/jobs/lpbank") || 
                         pathname.includes("/jobs/tpbank") || 
                         pathname.includes("/jobs/namabank") || 
                         pathname.includes("/jobs/mbbank") || 
                         pathname.includes("/jobs/hdbank") || 
                         pathname === "/api/jobs";
          newHeaders.set("Content-Type", isJson ? "application/json; charset=utf-8" : "text/html; charset=utf-8");
        }

        const responseBody = await response.arrayBuffer();
        return new Response(responseBody, {
          status: response.status,
          headers: newHeaders
        });

      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        });
      }
    }

    // 3. Route: Sacombank job details page proxy
    if (pathname.startsWith("/job/")) {
      const qs = searchParams.toString();
      const targetUrl = "https://sacombankcareer.com" + pathname + (qs ? "?" + qs : "");

      const headers = {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*',
        'Accept-Language': 'en-US,en;q=0.9,vi;q=0.8',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      };

      try {
        const response = await fetch(targetUrl, {
          method: "GET",
          headers: headers
        });

        const newHeaders = new Headers();
        newHeaders.set("Access-Control-Allow-Origin", "*");
        
        for (const [key, value] of response.headers.entries()) {
          const lowerKey = key.toLowerCase();
          if (![
            'content-encoding', 
            'transfer-encoding', 
            'content-length', 
            'connection',
            'access-control-allow-origin'
          ].includes(lowerKey)) {
            newHeaders.set(key, value);
          }
        }

        if (!newHeaders.has("Content-Type")) {
          newHeaders.set("Content-Type", "text/html; charset=utf-8");
        }

        const responseBody = await response.arrayBuffer();
        return new Response(responseBody, {
          status: response.status,
          headers: newHeaders
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        });
      }
    }

    // 4. Default fallback: serve static assets using Workers Assets
    try {
      return await env.ASSETS.fetch(request);
    } catch (e) {
      return new Response("Not Found", { status: 404 });
    }
  }
};

function getDefaultJobs() {
  return [
    {
      "id": "job-acb-39343",
      "title": "HO - Chuyên viên Xây Dựng Mô Hình & Định Lượng",
      "bank": "ACB",
      "bankCode": "ACB",
      "logoColor": "linear-gradient(135deg,#fb923c 0%,#f97316 100%)",
      "department": "risk-legal",
      "departmentName": "Khối Quản lý Rủi ro",
      "location": "Hội sở (Tp. HCM)",
      "salary": "Thương lượng",
      "level": "junior-mid",
      "levelName": "Chuyên viên",
      "deadline": "2026-10-31",
      "tags": ["ACB TP.HCM", "Experience", "Toàn thời gian"],
      "hrEmail": "tuyendung@acb.com.vn",
      "originalUrl": "https://www.acbjobs.com.vn/job/ho-chuyen-vien-xay-dung-mo-hinh-dinh-luong-39343",
      "area": "Hội sở"
    },
    {
      "id": "job-bvb-40281",
      "title": "New Plus Banker - Thực tập sinh tiềm năng",
      "bank": "BVBank",
      "bankCode": "BVB",
      "logoColor": "linear-gradient(135deg,#0369a1 0%,#0284c7 100%)",
      "department": "business",
      "departmentName": "Hội sở",
      "location": "Toàn quốc",
      "salary": "Thỏa thuận",
      "level": "intern",
      "levelName": "Thực tập sinh / Tập sự",
      "deadline": "2026-12-31",
      "tags": ["BVBank", "Toàn thời gian"],
      "hrEmail": "tuyendung@bvbank.com.vn",
      "originalUrl": "https://bvbank.talent.vn/job/new-plus-banker-thuc-tap-sinh-tiem-nang-40281",
      "area": "Toàn quốc"
    },
    {
      "id": "job-tpb-01000000-b1f8-ce4d-7bac-08ded295d265",
      "title": "Tập sự KHDN tiềm năng",
      "bank": "TPBank",
      "bankCode": "TPB",
      "logoColor": "linear-gradient(135deg,#7c3aed 0%,#a78bfa 100%)",
      "department": "business",
      "departmentName": "Các Đơn vị kinh doanh",
      "location": "Hồ Chí Minh, Đồng Nai",
      "salary": "Thỏa thuận",
      "level": "intern",
      "levelName": "Thực tập sinh / Tập sự",
      "deadline": "2026-10-31",
      "tags": ["TPBank", "Hồ Chí Minh"],
      "hrEmail": "tuyendung@tpb.vn",
      "originalUrl": "https://tuyendung.tpb.vn/vi/jobs/RZa3JP",
      "area": "Hồ Chí Minh, Đồng Nai"
    },
    {
      "id": "job-mbb-69cccdbd5872bf1517e29d59",
      "title": "Chuyên viên Tập sự Khách hàng Cá nhân - CN. Quang Trung - Phường Gò Vấp, Hồ Chí Minh",
      "bank": "MB Bank",
      "bankCode": "MBB",
      "logoColor": "linear-gradient(135deg,#1e40af 0%,#1d4ed8 100%)",
      "department": "risk-legal",
      "departmentName": "Khối Quản trị Rủi ro & Pháp chế",
      "location": "TP. Hồ Chí Minh",
      "salary": "Thỏa thuận",
      "level": "intern",
      "levelName": "Thực tập sinh / Tập sự",
      "deadline": "2026-08-25",
      "tags": ["MB Bank TP.HCM", "Banking", "Business Development"],
      "hrEmail": "hr.contact@mbbank.com.vn",
      "originalUrl": "https://careers.mbbank.com.vn/list-of-posts/detail-list-of-posts?id=69cccdbd5872bf1517e29d59&workGroupId=11258",
      "area": "CN. Quang Trung - Phường Gò Vấp, Hồ Chí Minh"
    },
    {
      "id": "job-acb-54624",
      "title": "The Next Banker 2026 (Đợt trải nghiệm T09/2026)",
      "bank": "ACB",
      "bankCode": "ACB",
      "logoColor": "linear-gradient(135deg,#fb923c 0%,#f97316 100%)",
      "department": "business",
      "departmentName": "Event ACB",
      "location": "TP. Hồ Chí Minh",
      "salary": "Thương lượng",
      "level": "junior-mid",
      "levelName": "Chuyên viên",
      "deadline": "2026-10-31",
      "tags": ["ACB TP.HCM", "Experience", "Toàn thời gian"],
      "hrEmail": "tuyendung@acb.com.vn",
      "originalUrl": "https://www.acbjobs.com.vn/job/the-next-banker-2026-dot-trai-nghiem-t092026-54624",
      "area": "TP. Hồ Chí Minh"
    },
    {
      "id": "job-tpb-01000000-4513-6ea4-1000-08def2ab8973",
      "title": "(ĐVKD) - Tập sự tiềm năng Khách hàng Cá nhân",
      "bank": "TPBank",
      "bankCode": "TPB",
      "logoColor": "linear-gradient(135deg,#7c3aed 0%,#a78bfa 100%)",
      "department": "business",
      "departmentName": "Khối Bán lẻ & Kinh doanh",
      "location": "TP. Hồ Chí Minh",
      "salary": "6 - 14 triệu",
      "level": "intern",
      "levelName": "Thực tập sinh / Tập sự",
      "deadline": "2026-10-31",
      "tags": ["TPBank", "Hồ Chí Minh"],
      "hrEmail": "tuyendung@tpb.vn",
      "originalUrl": "https://tuyendung.tpb.vn/vi/jobs/qzNOrq",
      "area": "TP. Hồ Chí Minh"
    }
  ];
}
