import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { activeCyclones, historicalData } from '../data/mockData';
import MapView from '../components/MapView';
import IntensityBadge from '../components/IntensityBadge';
import CycloneDetails from '../components/CycloneDetails';
import ComparisonTable from '../components/ComparisionTable';
import "../index.css";

export default function Dashboard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const cyclone = activeCyclones.find(c => c.id === id);

  if (!cyclone) return <div>Cyclone data not found.</div>;

  return (
    <div>
      <button onClick={() => navigate('/')} className="btn-primary">
        &larr; Back to Active List
      </button>

      <div className="card dashboard-header">
        <div>
          <h2 className="page-title" style={{ marginBottom: 0 }}>{cyclone.name}</h2>
          <p className="page-subtitle">ID: {cyclone.id}</p>
        </div>
        <IntensityBadge classification={cyclone.classification} />
      </div>

      <div className="dashboard-grid">
        {/* Left Column: Map */}
        <div className="map-column">
          <MapView 
            pastPath={cyclone.pastPath} 
            futurePath={cyclone.futurePath} 
            name={cyclone.name} 
          />
        </div>

        {/* Right Column: Details (Feature 3) */}
        <div>
          <CycloneDetails cyclone={cyclone} />
        </div>
      </div>

      {/* Historical Comparison (Feature 4) */}
      <ComparisonTable 
        currentCyclone={cyclone} 
        historicalData={historicalData} 
      />
    </div>
  );
}