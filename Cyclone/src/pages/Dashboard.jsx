import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { activeCyclones, historicalData } from '../data/mockData';
import MapView from '../components/MapView';
import IntensityBadge from '../components/IntensityBadge';
import CycloneDetails from '../components/CycloneDetails';
import ComparisonTable from '../components/ComparisonTable'; 
import "../index.css";

export default function Dashboard() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Use toString() to ensure a match even if the backend returns an integer ID
  const cyclone = activeCyclones.find(c => c.id.toString() === id);  

  if (!cyclone) return (
    <div className="flex items-center justify-center h-64">
      <h2 className="text-xl font-bold text-gray-500">Cyclone data not found.</h2>
    </div>
  );

  return (
    <div>
      <button onClick={() => navigate('/')} className="btn-primary">
        &larr; Back to Active List
      </button>

      <div className="card dashboard-header">
        <div>
          {/* Fixed the property name from cyclone.name to cyclone.cyclone_name */}
          <h2 className="page-title" style={{ marginBottom: 0 }}>{cyclone.cyclone_name}</h2>
          <p className="page-subtitle">ID: {cyclone.id}</p>
        </div>
        <IntensityBadge classification={cyclone.classification} />
      </div>

      <div className="dashboard-grid">
        {/* Left Column: Map */}
        <div className="map-column">
          <MapView 
            pastData={cyclone.pastData} 
            curr_pos={{ lat: cyclone.current_lat, lon: cyclone.current_lon }} 
            name={cyclone.cyclone_name}
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