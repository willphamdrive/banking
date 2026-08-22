import re

def main():
    with open("/Users/toanpham/Desktop/banking/scratch/bvb_response.html", "r", encoding="utf-8") as f:
        html = f.read()
    
    print("HTML length:", len(html))
    
    # Search for links containing '/job/'
    job_links = re.findall(r'href="([^"]*job[^"]*)"', html)
    print("Found job links:", len(job_links))
    if len(job_links) > 0:
        print("First 15 job links:", job_links[:15])
        
    # Search for items
    # Let's search for typical classes, like class="job", class="item", class="title", class="card", etc.
    # Let's search for some strings that might be titles of jobs
    titles = re.findall(r'<a[^>]*class="[^"]*title[^"]*"[^>]*>(.*?)</a>', html, re.DOTALL)
    print("Found titles with class containing 'title':", len(titles))
    if len(titles) > 0:
        print("First 10 titles:", [t.strip() for t in titles[:10]])
        
    # Let's check for any divs with class containing 'item' or 'job'
    items = re.findall(r'<div[^>]*class="[^"]*item[^"]*"[^>]*>', html)
    print("Found items with class containing 'item':", len(items))
    if len(items) > 0:
         print("First 10 item divs:", items[:10])

    # Let's write a regex to find all links of the form '/job/[id]' or '/job/[slug]/[id]'
    detail_links = re.findall(r'href="/job/([^"]+)"', html)
    print("Found detail links (href='/job/...'):", len(detail_links))
    if len(detail_links) > 0:
        print("First 10 detail links:", detail_links[:10])

if __name__ == '__main__':
    main()
