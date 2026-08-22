export async function onRequest(context) {
  const url = new URL(context.request.url);
  const pathname = url.pathname;
  const searchParams = url.searchParams;
  const qs = searchParams.toString();
  const targetUrl = "https://sacombankcareer.com" + pathname + (qs ? "?" + qs : "");

  // Handle OPTIONS preflight
  if (context.request.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, X-Requested-With, Accept"
      }
    });
  }

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
