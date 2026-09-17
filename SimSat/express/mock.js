const express = require('express');
const multer = require('multer');
const cors = require("cors");

const app = express();
const upload = multer({ dest: 'uploads/' }); // temp storage for incoming images

app.use(cors({
    origin: 'http://localhost:5173'
}));

let frameCount = 0; // fake state to simulate mode switching over time

// Initialize with default mode so the frontend doesn't read 'undefined'
let data = {
  past_path: [],
  mode: 'normal'
}

app.get("/postime", (req, res)=> {
    res.json(data);
})

app.post('/api/ingest-frame', upload.single('image'), (req, res) => {
  const timestamp = req.body.timestamp;
  const lat = req.body.lat;
  const lon = req.body.lon;
  
  data.past_path.push({"lat": lat, "lon": lon});
  frameCount++;

  console.log(`Received frame at ${timestamp}, file: ${req.file.originalname}, lat: ${lat}, lon: ${lon}`);

  // Logic: Change to rapid 
  const mode = frameCount > 5 ? 'rapid_scan' : 'normal';
  //Call Model here to get: confidence_score, 
  /*const request = {
    "justification_text" : "More monitoring required due to high danger",
    "sector" : ,
    "ref_img_url" : ,
    "grad_cam_url" : ,
    "rapid_scan_request_pending": ,
  }*/
  data.mode = mode;
  
  res.json({
    cyclone_detected: true,
    intensity: 'Severe Cyclonic Storm',
    mode: mode,
    rapid_scan_request_pending: false
  });
});

app.listen(3000, () => {
  console.log('Mock backend listening on http://localhost:3000');
});