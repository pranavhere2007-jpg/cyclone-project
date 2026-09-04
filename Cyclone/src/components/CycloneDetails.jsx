import React from 'react';

export default function CycloneDetails({ cyclone }) {
  return (
    <div className="card" style={{ height: '100%' }}>
      <h3 className="card-title" style={{ paddingBottom: '0.75rem', borderBottom: '1px solid rgba(0,0,0,0.05)', marginBottom: '1rem' }}>
        Current Telemetry
      </h3>
      
      <div>
        <div className="telemetry-row">
          <span className="telemetry-label">Max Sustained Wind</span>
          <span className="telemetry-value danger">{cyclone.windSpeed} km/h</span>
        </div>
        
        <div className="telemetry-row">
          <span className="telemetry-label">Central Pressure</span>
          <span className="telemetry-value">{cyclone.pressure} hPa</span>
        </div>
        
        <div className="telemetry-row">
          <span className="telemetry-label">Destructive Scale</span>
          <span className="badge badge-severe">
            Category {cyclone.destructiveScale}
          </span>
        </div>
        
        <div className="telemetry-row">
          <span className="telemetry-label">Est. Storm Surge</span>
          <span className="telemetry-value" style={{ color: 'var(--primary)' }}>{cyclone.surgeEstimate} meters</span>
        </div>

        <div className="telemetry-row">
          <span className="telemetry-label">Current Status</span>
          <span className="telemetry-value" style={{ color: 'var(--success)', display: 'flex', alignItems: 'center' }}>
            <span className="status-pulse"></span>
            Active Tracking
          </span>
        </div>
      </div>
    </div>
  );
}