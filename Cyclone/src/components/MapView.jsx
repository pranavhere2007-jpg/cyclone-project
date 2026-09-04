import React from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function MapView({ pastPath, futurePath, name }) {
  // Center map on the latest known coordinate
  const currentPosition = pastPath[pastPath.length - 1];

  const pastOptions = { color: '#f59e0b', weight: 4, dashArray: '5, 5' }; // Warning orange
  const futureOptions = { color: '#ef4444', weight: 4 }; // Danger red

  return (
    <div className="map-wrapper">
      <MapContainer 
        center={currentPosition} 
        zoom={6} 
        scrollWheelZoom={false} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Past Path */}
        <Polyline pathOptions={pastOptions} positions={pastPath} />
        
        {/* Future/Predicted Path */}
        <Polyline pathOptions={futureOptions} positions={futurePath} />
        
        {/* Current Location Marker */}
        <Marker position={currentPosition}>
          <Popup>
            <b>{name}</b> <br /> Current Location
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}