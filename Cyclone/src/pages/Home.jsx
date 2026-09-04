import React from 'react';
import { useNavigate } from 'react-router-dom';
import { activeCyclones } from '../data/mockData';
import IntensityBadge from '../components/IntensityBadge';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Active Tropical Cyclones</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeCyclones.map((cyclone) => (
          <div 
            key={cyclone.id} 
            onClick={() => navigate(`/dashboard/${cyclone.id}`)}
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg cursor-pointer transition-shadow"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">{cyclone.name}</h3>
              <IntensityBadge classification={cyclone.classification} />
            </div>
            <p className="text-gray-600">Current Wind Speed: {cyclone.windSpeed} km/h</p>
            <p className="text-gray-600">Pressure: {cyclone.pressure} hPa</p>
            <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
              Open Dashboard
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}