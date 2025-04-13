import requests
from bs4 import BeautifulSoup
import re
import time

def get_all_dropdown_words(pages=765):
    words = set()

    for page in range(1, pages + 1):
        url = f"https://www.aurakingdom-db.com/items/page/{page}"
        print(f"Scraping page {page}...")

        try:
            response = requests.get(url, timeout=10)
            if response.status_code != 200:
                print(f"Failed to fetch {url} (status code: {response.status_code})")
                continue

            soup = BeautifulSoup(response.text, "html.parser")
            dropdown_items = soup.find_all(class_="flex-grow-1 align-self-center ms-2 text-start")

            for item in dropdown_items:
                text = item.get_text(strip=True)
                cleaned = re.findall(r'\b\w+\b', text)
                words.update(word.lower() for word in cleaned)

            # Optional: delay to be polite to the server
            # time.sleep(0.5)

        except Exception as e:
            print(f"Error scraping page {page}: {e}")
            continue

    return sorted(words)

def save_to_whitelist_file(words, filename="whitelist.txt"):
    with open(filename, "w", encoding="utf-8") as f:
        for word in words:
            f.write(word + "\n")
    print(f"\n✅ Saved {len(words)} unique words to {filename}")

# Run it
whitelist_words = get_all_dropdown_words()
save_to_whitelist_file(whitelist_words)
