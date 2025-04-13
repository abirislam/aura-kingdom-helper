import dxcam
import cv2
from PIL import Image
import numpy as np
import pyautogui
import pytesseract
import os
import re
import pickle
import sys

camera = dxcam.create()
base_dir = os.path.dirname(os.path.abspath(__file__))
pytesseract.pytesseract.tesseract_cmd = os.path.join(base_dir, 'tesseract', 'tesseract.exe')
whitelist_path = sys.argv[1]
with open(whitelist_path, "rb") as f:
    whitelist = pickle.load(f)

def capture_item() -> np.array:
    x, y = pyautogui.position()
    x1 = x + 20
    y1 = y + 20
    x2 = x + 325
    y2 = y + 105

    if (x1 > 1920):
        x1 = 1920
    if (y1 > 1080):
        y1 = 1080
    if (x2 > 1920):
        x2 = 1920
    if (y2 > 1080):
        y2 = 1080

    area = (x1, y1, x2, y2)
    frame = camera.grab(region=area)
    return frame

def parse_item(frame: np.array):
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    try:
        tessdata_dir = os.path.join(base_dir, 'tesseract', 'tessdata')
        os.environ['TESSDATA_PREFIX'] = tessdata_dir
        whitelist = "tessedit_char_whitelist=ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 \n"

        text = pytesseract.image_to_string(gray, lang='eng', config=whitelist)
        string_parser(text)

    except Exception as e:
        print("OCR error:", e)

def string_parser(string: str):
    base_string = "https://www.aurakingdom-db.com/search?s="
    unwanted_phrases = [
        r'item',
        r'gaia crystal',
        r'rclick to open',
        r'click to open',
        r'mount'
    ]

    s1 = string.replace("\n", " ")
    s2 = s1.strip()
    s3 = [word for word in s2.split() if word.lower() in whitelist]
    s4 = " ".join(s3)

    for phrase in unwanted_phrases:
        s4 = re.sub(phrase, '', s4, flags=re.IGNORECASE)

    cleaned = s4.strip().replace(" ", "+")
    print(base_string + cleaned)

item = capture_item()
parse_item(item)