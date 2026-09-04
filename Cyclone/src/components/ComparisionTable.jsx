import React from 'react';

export default function ComparisonTable({ currentCyclone, historicalData }) {
  return (
    <div className="card" style={{ marginTop: '2.5rem' }}>
      <div style={{ marginBottom: '1rem' }}>
        <h3 className="card-title">Regional Historical Comparison</h3>
        <p className="card-subtitle">Comparing active threat metrics against historical baselines in the current trajectory region.</p>
      </div>
      
      <div className="table-container">
        <table className="comparison-table">
          <thead>
            <tr>
              <th>Cyclone Name</th>
              <th>Region</th>
              <th>Max Wind (km/h)</th>
              <th>Damage Scale</th>
            </tr>
          </thead>
          <tbody>
            {/* Current Cyclone Highlighted */}
            <tr className="current-row">
              <td>
                <span className="status-pulse"></span>
                {currentCyclone.name} (Current)
              </td>
              <td>Odisha Coast</td>
              <td className="danger-text">{currentCyclone.windSpeed}</td>
              <td>Projected</td>
            </tr>
            
            {/* Historical Data Mapping */}
            {historicalData.map((data, index) => (
              <tr key={index}>
                <td>{data.name}</td>
                <td>{data.region}</td>
                <td>{data.maxWind}</td>
                <td>{data.damage}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}