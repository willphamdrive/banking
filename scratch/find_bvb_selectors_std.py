from html.parser import HTMLParser

class TalentHTMLParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.in_jobs = False
        self.in_item = False
        self.in_title = False
        self.in_title_a = False
        self.in_info = False
        self.current_item = {}
        self.items = []
        self.depth = 0
        self.classes_stack = []

    def handle_starttag(self, tag, attrs):
        attrs_dict = dict(attrs)
        class_val = attrs_dict.get('class', '')
        
        self.classes_stack.append((tag, class_val))
        
        if 'jobs' in class_val.split():
            self.in_jobs = True
            
        if self.in_jobs and 'item' in class_val.split() and tag == 'div':
            self.in_item = True
            self.current_item = {'infos': []}
            
        if self.in_item:
            if 'title' in class_val.split():
                self.in_title = True
            if self.in_title and tag == 'a':
                self.in_title_a = True
                self.current_item['href'] = attrs_dict.get('href', '')
            if 'info' in class_val.split():
                self.in_info = True
                self.current_item['infos'].append({'html': '', 'text': '', 'links': []})
            if self.in_info and tag == 'a':
                self.current_item['infos'][-1]['links'].append({
                    'href': attrs_dict.get('href', ''),
                    'text': ''
                })

    def handle_endtag(self, tag):
        if self.classes_stack:
            start_tag, class_val = self.classes_stack.pop()
        else:
            class_val = ''
            
        if 'jobs' in class_val.split():
            self.in_jobs = False
            
        if self.in_item and 'item' in class_val.split() and tag == 'div':
            self.in_item = False
            self.items.append(self.current_item)
            
        if self.in_title and 'title' in class_val.split():
            self.in_title = False
        if self.in_title_a and tag == 'a':
            self.in_title_a = False
            
        if self.in_info and 'info' in class_val.split():
            self.in_info = False

    def handle_data(self, data):
        if self.in_item:
            if self.in_title_a:
                self.current_item['title'] = self.current_item.get('title', '') + data
            if self.in_info:
                current_info = self.current_item['infos'][-1]
                current_info['text'] += data
                if current_info['links']:
                    current_info['links'][-1]['text'] += data

def main():
    with open("/Users/toanpham/Desktop/banking/scratch/bvb_response.html", "r", encoding="utf-8") as f:
        html = f.read()
        
    parser = TalentHTMLParser()
    parser.feed(html)
    
    print("Found items count:", len(parser.items))
    if len(parser.items) > 0:
        for i, item in enumerate(parser.items[:5]):
            print(f"\nItem {i}:")
            print("  Title:", item.get('title', '').strip())
            print("  Href:", item.get('href', ''))
            print("  Infos:")
            for j, info in enumerate(item.get('infos', [])):
                print(f"    Info {j} text:", info['text'].strip())
                print(f"    Info {j} links:", info['links'])

if __name__ == '__main__':
    main()
