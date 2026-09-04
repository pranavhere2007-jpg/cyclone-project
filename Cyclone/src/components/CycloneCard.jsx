import React from 'react';
import { useNavigate } from 'react-router-dom';
import IntensityBadge from './IntensityBadge';

export default function CycloneCard({ cyclone }) {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(`/dashboard/${cyclone.id}`)}
      className="bg-white p-6 rounded-lg shadow border border-gray-100 hover:shadow-lg hover:border-blue-300 cursor-pointer transition-all"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{cyclone.name}</h3>
          <p className="text-sm text-gray-500 mt-1">ID: {cyclone.id}</p>
        </div>
        <IntensityBadge classification={cyclone.classification} />
      </div>
      
      <div className="space-y-2 mt-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Current Wind Speed:</span>
          <span className="font-semibold text-red-600">{cyclone.windSpeed} km/h</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Central Pressure:</span>
          <span className="font-semibold">{cyclone.pressure} hPa</span>
        </div>
      </div>
      
      <button className="mt-6 w-full bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700 transition-colors">
        View Full Dashboard
      </button>
    </div>
  );
}