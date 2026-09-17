import React from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function MapView({ pastData, curr_pos, name }) {
  
  // Define a default center (e.g., Bay of Bengal / East Coast of India)
  const defaultCenter = [15.0, 85.0];
  
  // Determine if we have valid telemetry data
  const hasData = pastData && pastData.length > 0 && curr_pos && curr_pos.lat;

  // Set the map center to either the cyclone's current position or the default
  const mapCenter = hasData 
    ? [parseFloat(curr_pos.lat), parseFloat(curr_pos.lon)] 
    : defaultCenter;

  const pastOptions = { color: '#f59e0b', weight: 4, dashArray: '5, 5' }; 

  return (
    <div className="map-wrapper">
      <MapContainer 
        center={mapCenter} 
        zoom={5} 
        scrollWheelZoom={false} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Only render the path and marker if telemetry data exists */}
        {hasData && (
          <>
            <Polyline pathOptions={pastOptions} positions={pastData} />
            <Marker position={mapCenter}>
              <Popup>
                <b>{name || "Active Cyclone"}</b> <br /> Current Location
              </Popup>
            </Marker>
          </>
        )}
        
        {/* If no data exists yet, show a helpful overlay on top of the map */}
        {!hasData && (
          <div style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            zIndex: 1000, // Keeps it above the Leaflet tiles
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            padding: '8px 12px',
            borderRadius: '4px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            fontWeight: 'bold',
            color: '#ef4444'
          }}>
            Awaiting Satellite Telemetry...
          </div>
        )}
      </MapContainer>
    </div>
  );
}