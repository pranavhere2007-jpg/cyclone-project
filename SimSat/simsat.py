import time
import requests
from datetime import datetime
import os
import extract_data
import imag

seq = imag.imag

class SimSat:
    def __init__(self, imag, api, normal=2, rapid=0.35):
        self.imag = seq
        self.index = 0
        self.api = api
        self.mode = "normal"
        self.monitor = normal
        self.rapid_view = rapid

    def current(self):
        # Ensured the mode string matches what your API likely returns
        if self.mode == "rapid_scan" or self.mode == "rapid":
            return self.rapid_view
        else:
            return self.monitor

    def send(self, timestamp, image_path):
        # Dynamically construct the absolute path relative to simsat.py's location
        script_dir = os.path.dirname(os.path.abspath(__file__))
        absolute_image_path = os.path.join(script_dir, image_path)

        # 1. Catch missing files before they hit OpenCV or the API
        if not os.path.exists(absolute_image_path):
            print(f"Error: File not found -> {absolute_image_path}")
            return {}

        center_pixel = extract_data.find_cyclone_center_pixel(absolute_image_path)
        
        # 2. Fix the UnboundLocalError by providing default values
        lat, lon = None, None 
        if center_pixel:
            lat, lon = extract_data.pixel_to_latlong(center_pixel[0], center_pixel[1])
        else:
            print(f"Warning: Cyclone center not detected for {absolute_image_path}")

        # 3. Prevent crashes if the localhost API is down
        try:
            with open(absolute_image_path, "rb") as f:
                response = requests.post(self.api,
                                      files={"image": f},
                                      data={"timestamp": timestamp.isoformat(), "lat": lat, "lon": lon}
                )
                response.raise_for_status() # Raise exception for 4xx/5xx errors
                return response.json()
        except requests.exceptions.RequestException as e:
            print(f"API Connection Error: {e}")
            return {}

    def run(self):
        while self.index < len(self.imag):
            timestamp, image_path = self.imag[self.index]
            self.index += 1
            
            result = self.send(timestamp, image_path)
            
            if result and result.get("mode") in ("normal", "rapid_scan", "rapid"):
                self.mode = result["mode"]
                
            print(f"[{timestamp}] sent frame, mode={self.mode}, next interval={self.current()}s")
            time.sleep(self.current())

if __name__ == "__main__":
    sim = SimSat(imag=seq, api="http://localhost:3000/api/ingest-frame")
    sim.run()