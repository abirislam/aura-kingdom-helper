import dxcam
import cv2
from PIL import Image
import numpy as np
import pyautogui
import keyboard
import pytesseract

camera = dxcam.create()
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

def capture_item():
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
    parse_item(frame)

def parse_item(frame: np.array):
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    text = pytesseract.image_to_string(gray)
    string_parser(text)

def string_parser(string: str):
    base_string = "https://www.aurakingdom-db.com/search?s="
    s1 = string.replace("\n", " ")
    s2 = s1.strip()
    s3 = s2.replace("Item", "")
    s4 = s3.replace("Gaia Crystal", "")
    s5 = s4.replace("(Non-tradable)", "")
    s6 = s5.strip().replace(" ", "+")
    print(base_string + s6)

capture_item()