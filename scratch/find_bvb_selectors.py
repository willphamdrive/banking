from bs4 import BeautifulSoup

def main():
    with open("/Users/toanpham/Desktop/banking/scratch/bvb_response.html", "r", encoding="utf-8") as f:
        html = f.read()
        
    soup = BeautifulSoup(html, 'html.parser')
    
    # Check for .jobs
    jobs_div = soup.find(class_="jobs")
    print("Found .jobs:", jobs_div is not None)
    
    # Check for .jobs .item
    items = soup.select(".jobs .item")
    print("Found .jobs .item count:", len(items))
    
    if len(items) > 0:
        first_item = items[0]
        print("First item HTML:", str(first_item)[:1000])
        
        # Check sub-elements
        title_a = first_item.select_one(".title a")
        if title_a:
            print("Title text:", title_a.text.strip())
            print("Title href:", title_a.get("href"))
        else:
            print("No .title a found!")
            # Print all links in first item
            print("All links in first item:", [a.get("href") for a in first_item.find_all("a")])
            
        # Check info divs
        infos = first_item.select(".info")
        print("Found .info count:", len(infos))
        for idx, info in enumerate(infos):
            print(f"Info {idx} text:", info.text.strip())
            print(f"Info {idx} HTML:", str(info)[:300])

if __name__ == '__main__':
    main()
