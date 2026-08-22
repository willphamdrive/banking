export async function onRequest(context) {
  const url = new URL(context.request.url);
  const pathname = url.pathname;
  const searchParams = url.searchParams;
  const method = context.request.method;

  // Handle CORS preflight options request
  if (method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, X-Requested-With, Accept, Authorization, clientMessageId",
        "Access-Control-Max-Age": "86400"
      }
    });
  }

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
      body = await context.request.text();
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
      body = await context.request.text();
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

    // Build response headers to allow CORS and forward useful headers
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

    // Explicitly set content type based on path if not clearly provided
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
