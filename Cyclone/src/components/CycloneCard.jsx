import React from 'react';
import { useNavigate } from 'react-router-dom';
import IntensityBadge from './IntensityBadge';
import "../index.css";

export default function CycloneCard({ cyclone }) {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(`/dashboard/${cyclone.id}`)}
      className="card clickable-card"
    >
      <div className="card-header">
        <div>
          <h3 className="card-title">{cyclone.name}</h3>
          <p className="card-subtitle">ID: {cyclone.id}</p>
        </div>
        <IntensityBadge classification={cyclone.classification} />
      </div>
      
      <div style={{ marginTop: '1rem' }}>
        <div className="telemetry-row">
          <span className="telemetry-label">Current Wind Speed:</span>
          <span className="telemetry-value danger">{cyclone.windSpeed} km/h</span>
        </div>
        <div className="telemetry-row">
          <span className="telemetry-label">Central Pressure:</span>
          <span className="telemetry-value">{cyclone.pressure} hPa</span>
        </div>
      </div>
      
      <button className="btn-primary">
        View Full Dashboard
      </button>
    </div>
  );
}