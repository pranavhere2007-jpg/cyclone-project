import cv2
import pytesseract
import re
import cv2
import numpy as np
from PIL import Image
import os

def extract_timestamp(image_path):
    # 1. Load the image
    img = cv2.imread(image_path)
    height, width, _ = img.shape
    
    # 2. Crop the bottom bar (adjust the '-30' based on the exact pixel height of the text bar)
    bottom_bar = img[height-30:height, 0:width]
    
    # 3. Preprocess for OCR (Convert to Grayscale and apply Threshold)
    gray = cv2.cvtColor(bottom_bar, cv2.COLOR_BGR2GRAY)
    _, thresh = cv2.threshold(gray, 150, 255, cv2.THRESH_BINARY)
    
    # 4. Extract Text
    raw_text = pytesseract.image_to_string(thresh)
    
    # 5. Parse the Date and Time using Regex
    # Looking for a pattern like "16 MAY 2013" and "084500"
    date_match = re.search(r'(\d{1,2}\s+[A-Z]{3}\s+\d{4})', raw_text)
    time_match = re.search(r'(\d{6})', raw_text) # Finds the 6-digit time string
    
    date_str = date_match.group(1) if date_match else "Date not found"
    time_str = time_match.group(1) if time_match else "Time not found"
    
    if time_str != "Time not found":
        # Format time to HH:MM:SS
        time_str = f"{time_str[0:2]}:{time_str[2:4]}:{time_str[4:6]} UTC"
        
    return date_str, time_str

#print(extract_timestamp('frame_0000.gif')) 
# Expected Output: ('16 MAY 2013', '08:45:00 UTC')

def pixel_to_latlong(px_x, px_y):
    # --- CALIBRATION DATA (Replace with exact pixel coordinates from your image) ---
    # Longitude Calibration (X-axis)
    pixel_x1, lon1 = 180, 80.0 # e.g., 80E is at x=180
    pixel_x2, lon2 = 520, 90.0 # e.g., 90E is at x=520
    
    # Latitude Calibration (Y-axis - Note: Y increases as you go DOWN the image)
    pixel_y1, lat1 = 350, 10.0 # e.g., 10N is at y=350
    pixel_y2, lat2 = 100, 20.0 # e.g., 20N is at y=100 (assuming 20N is higher up)
    
    # --- CALCULATE DEGREES PER PIXEL ---
    lon_per_pixel = (lon2 - lon1) / (pixel_x2 - pixel_x1)
    lat_per_pixel = (lat2 - lat1) / (pixel_y2 - pixel_y1) 
    
    # --- CONVERT TARGET PIXEL ---
    target_lon = lon1 + ((px_x - pixel_x1) * lon_per_pixel)
    target_lat = lat1 + ((px_y - pixel_y1) * lat_per_pixel)
    
    return round(target_lat, 2), round(target_lon, 2)

# Example: If your AI model detected the eye of the cyclone at pixel (x: 400, y: 320)
#cyclone_lat, cyclone_lon = pixel_to_latlong(400, 320)
#print(f"Cyclone Coordinate: {cyclone_lat}°N, {cyclone_lon}°E")

import numpy as np

import cv2
import numpy as np
from PIL import Image
import os

def find_cyclone_center_pixel(image_path):
    # 1. Safety check to ensure the file actually exists
    if not os.path.exists(image_path):
        print(f"Error: Could not find file at {image_path}")
        return None

    try:
        # 2. Use Pillow to open the image (handles GIFs perfectly)
        pil_img = Image.open(image_path).convert('RGB')
        
        # 3. Convert the Pillow image (RGB) to an OpenCV image array (BGR)
        img = cv2.cvtColor(np.array(pil_img), cv2.COLOR_RGB2BGR)
    except Exception as e:
        print(f"Error reading image {image_path}: {e}")
        return None

    # 4. Proceed with your original OpenCV code
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    
    lower_bound = np.array([0, 100, 200]) 
    upper_bound = np.array([10, 255, 255])
    
    mask = cv2.inRange(hsv, lower_bound, upper_bound)
    
    M = cv2.moments(mask)
    if M["m00"] != 0:
        center_x = int(M["m10"] / M["m00"])
        center_y = int(M["m01"] / M["m00"])
        return center_x, center_y
        
    return None
