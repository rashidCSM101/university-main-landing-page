import os
import re
import urllib.request
import urllib.parse
from html.parser import HTMLParser

BASE_URL = "https://wenclims.org"
OUTPUT_DIR = os.path.join(os.getcwd(), "scraping_data")
PAGES_DIR = os.path.join(OUTPUT_DIR, "pages")

os.makedirs(PAGES_DIR, exist_ok=True)

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

class HTMLTextExtractor(HTMLParser):
    def __init__(self):
        super().__init__()
        self.text_parts = []
        self.title = ""
        self.in_title = False
        self.headings = []
        self.in_heading = False
        self.current_heading_level = ""
        self.current_heading_text = ""
        self.links = []
        self.images = []
        self.skip_tags = {'script', 'style', 'noscript', 'svg', 'iframe'}
        self.current_tag_stack = []

    def handle_starttag(self, tag, attrs):
        self.current_tag_stack.append(tag)
        attrs_dict = dict(attrs)

        if tag == 'title':
            self.in_title = True
        elif tag in ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']:
            self.in_heading = True
            self.current_heading_level = tag.upper()
            self.current_heading_text = ""
        elif tag == 'a' and 'href' in attrs_dict:
            self.links.append((attrs_dict.get('href', ''), attrs_dict.get('title', '')))
        elif tag == 'img' and 'src' in attrs_dict:
            self.images.append((attrs_dict.get('src', ''), attrs_dict.get('alt', '')))

    def handle_endtag(self, tag):
        if self.current_tag_stack and self.current_tag_stack[-1] == tag:
            self.current_tag_stack.pop()

        if tag == 'title':
            self.in_title = False
        elif tag in ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']:
            if self.in_heading:
                clean_h = self.current_heading_text.strip()
                if clean_h:
                    self.headings.append(f"[{self.current_heading_level}] {clean_h}")
                self.in_heading = False

    def handle_data(self, data):
        if any(tag in self.skip_tags for tag in self.current_tag_stack):
            return

        text = data.strip()
        if not text:
            return

        if self.in_title:
            self.title += text + " "
        
        if self.in_heading:
            self.current_heading_text += text + " "

        self.text_parts.append(text)

    def get_clean_text(self):
        return "\n".join(self.text_parts)


def fetch_url(url):
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        with urllib.request.urlopen(req, timeout=15) as response:
            content_type = response.headers.get("Content-Type", "")
            if "text/html" not in content_type:
                return None
            html_bytes = response.read()
            return html_bytes.decode('utf-8', errors='ignore')
    except Exception as e:
        print(f"[-] Error fetching {url}: {e}")
        return None


def get_slug_filename(url):
    parsed = urllib.parse.urlparse(url)
    path = parsed.path.strip("/")
    if not path:
        return "index.txt"
    slug = re.sub(r'[^a-zA-Z0-9_-]', '_', path)
    return f"{slug}.txt"


def main():
    print(f"Starting web scraping for {BASE_URL}...")
    visited = set()
    to_visit = [BASE_URL, f"{BASE_URL}/", f"{BASE_URL}/about/", f"{BASE_URL}/projects/", 
                f"{BASE_URL}/publications/", f"{BASE_URL}/media/", f"{BASE_URL}/blogs/", 
                f"{BASE_URL}/tools/", f"{BASE_URL}/contact/", f"{BASE_URL}/team/"]
    
    pages_scraped = {}

    while to_visit:
        url = to_visit.pop(0)
        # Normalize URL
        parsed = urllib.parse.urlparse(url)
        clean_url = urllib.parse.urlunparse((parsed.scheme, parsed.netloc, parsed.path, '', '', ''))
        if clean_url.endswith('/'):
            clean_url = clean_url[:-1]

        if clean_url in visited or not clean_url.startswith(BASE_URL):
            continue

        visited.add(clean_url)
        print(f"[+] Scraping: {clean_url}")

        html = fetch_url(clean_url)
        if not html:
            continue

        parser = HTMLTextExtractor()
        try:
            parser.feed(html)
        except Exception as e:
            print(f"[-] HTML parsing error on {clean_url}: {e}")
            continue

        title = parser.title.strip()
        body_text = parser.get_clean_text()
        headings = parser.headings
        images = parser.images
        links = parser.links

        # Collect internal links to visit
        for link_url, _ in links:
            full_url = urllib.parse.urljoin(clean_url, link_url)
            parsed_link = urllib.parse.urlparse(full_url)
            clean_link = urllib.parse.urlunparse((parsed_link.scheme, parsed_link.netloc, parsed_link.path, '', '', ''))
            if clean_link.endswith('/'):
                clean_link = clean_link[:-1]

            if clean_link.startswith(BASE_URL) and clean_link not in visited:
                # Exclude media/wp-content files, RSS feeds, etc.
                if not any(ext in clean_link for ext in ['.png', '.jpg', '.jpeg', '.gif', '.pdf', '.css', '.js', '/feed', '/wp-json', '/wp-admin']):
                    to_visit.append(clean_link)

        # Save individual page .txt file
        filename = get_slug_filename(clean_url)
        filepath = os.path.join(PAGES_DIR, filename)

        file_content = f"========================================================================\n"
        file_content += f"URL: {clean_url}\n"
        file_content += f"PAGE TITLE: {title}\n"
        file_content += f"========================================================================\n\n"
        
        if headings:
            file_content += "--- HEADINGS ---\n"
            for h in headings:
                file_content += f"{h}\n"
            file_content += "\n"

        file_content += "--- PAGE TEXT CONTENT ---\n"
        file_content += body_text + "\n\n"

        if images:
            file_content += "--- EXTRACTED IMAGES ---\n"
            for src, alt in images:
                file_content += f"Image: {src} | Alt: {alt}\n"
            file_content += "\n"

        with open(filepath, "w", encoding="utf-8") as f:
            f.write(file_content)

        pages_scraped[clean_url] = {
            "title": title,
            "filename": filename,
            "filepath": filepath,
            "text_length": len(body_text),
            "headings_count": len(headings),
            "images_count": len(images)
        }

    # Write Master File (all_scraped_data.txt)
    master_path = os.path.join(OUTPUT_DIR, "all_scraped_data.txt")
    print(f"\n[+] Compiling all data into master text file: {master_path}")
    with open(master_path, "w", encoding="utf-8") as master_f:
        master_f.write(f"WENCLIMS.ORG SCRAPED CONTENT MASTER FILE\n")
        master_f.write(f"Total Pages Scraped: {len(pages_scraped)}\n")
        master_f.write(f"========================================================================\n\n")

        for url, data in pages_scraped.items():
            master_f.write(f"########################################################################\n")
            master_f.write(f"PAGE: {data['title']}\n")
            master_f.write(f"URL: {url}\n")
            master_f.write(f"FILE: pages/{data['filename']}\n")
            master_f.write(f"########################################################################\n\n")
            
            with open(data['filepath'], "r", encoding="utf-8") as pf:
                master_f.write(pf.read())
            master_f.write("\n\n" + "="*80 + "\n\n")

    # Write Summary Sitemap Index
    summary_path = os.path.join(OUTPUT_DIR, "summary_sitemap.txt")
    with open(summary_path, "w", encoding="utf-8") as sum_f:
        sum_f.write("SCRAPED PAGES SUMMARY INDEX\n")
        sum_f.write("========================================================================\n\n")
        for url, data in pages_scraped.items():
            sum_f.write(f"- Title: {data['title']}\n")
            sum_f.write(f"  URL: {url}\n")
            sum_f.write(f"  File: pages/{data['filename']}\n")
            sum_f.write(f"  Text Character Count: {data['text_length']}\n")
            sum_f.write(f"  Headings Count: {data['headings_count']}\n")
            sum_f.write(f"  Images Found: {data['images_count']}\n\n")

    print(f"\n[✓] Scraping complete! Scraped {len(pages_scraped)} pages.")
    print(f"Files saved in:\n- Individual pages: {PAGES_DIR}\n- Combined master file: {master_path}\n- Sitemap summary: {summary_path}")

if __name__ == "__main__":
    main()
