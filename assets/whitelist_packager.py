import pickle

with open("whitelist.txt", "r", encoding="utf-8") as f:
    words = {line.strip().lower() for line in f if line.strip()}

with open("whitelist.pkl", "wb") as f:
    pickle.dump(words, f)
