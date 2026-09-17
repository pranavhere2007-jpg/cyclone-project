async function get_data(){
  const url = "http://localhost:4000/cyclones/active";
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (err) {
    console.log(`Error: ${err}`);
    return [];
  }
}

async function get_postime(){
  const url = "http://localhost:3000/postime";
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (err) {
    console.log(`Error: ${err}`);
    return { past_path: [], mode: 'normal' };
  }
}

async function get_helplines(){
  const url = "http://localhost:4000/helplines";
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (err) {
    console.log(`Error fetching helplines: ${err}`);
    // Fallback data in case the server is offline
    return [
      { name: "National Emergency", phone: "112" },
      { name: "NDRF Control Room", phone: "9711077372" }
    ];
  }
}

const cy_data = await get_data(); 
const postime_data = await get_postime();
export const helplinesData = await get_helplines();



//console.log(helpline_data);

const formattedPath = (postime_data.past_path || []).map(pos => [
  parseFloat(pos.lat), 
  parseFloat(pos.lon)
]);

// Safely attach telemetry data to ALL active cyclones to prevent crashes
if (cy_data && cy_data.length > 0) {
  cy_data.forEach((cyclone, index) => {
    // If you only want the simulator to control the FIRST cyclone, 
    // you can conditionally apply the mock path, or apply it to all for testing.
    cyclone.pastData = index === 0 ? formattedPath : [];
    cyclone.status = index === 0 ? (postime_data.mode || 'normal') : 'Pending Tracking';
    
    if (cyclone.pastData.length > 0) {
      const latestPos = cyclone.pastData[cyclone.pastData.length - 1];
      cyclone.current_lat = latestPos[0];
      cyclone.current_lon = latestPos[1];
    } else {
      cyclone.current_lat = null;
      cyclone.current_lon = null;
    }
  });
}

export const activeCyclones = cy_data;

export const historicalData = [
  { name: "Phailin (2013)", region: "Odisha Coast", maxWind: 215, damage: "High" },
  { name: "Fani (2019)", region: "Odisha Coast", maxWind: 250, damage: "Severe" }
];