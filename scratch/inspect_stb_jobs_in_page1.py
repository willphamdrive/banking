def main():
    with open("/Users/toanpham/Desktop/banking/scratch/stb_page1.html", "r", encoding="utf-8") as f:
        content = f.read()

    print("HTML length:", len(content))
    print("Contains job-tile:", "job-tile" in content)
    print("Contains jobTitle-link:", "jobTitle-link" in content)
    
    # Print occurrences of job-tile
    import re
    tiles = re.findall(r'<li[^>]*class="[^"]*job-tile[^"]*"[^>]*>', content)
    print("Found job-tile count:", len(tiles))

if __name__ == '__main__':
    main()
