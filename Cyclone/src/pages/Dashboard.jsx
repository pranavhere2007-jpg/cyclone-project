import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { activeCyclones, historicalData } from '../data/mockData';
import MapView from '../components/MapView';
import IntensityBadge from '../components/IntensityBadge';

export default function Dashboard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const cyclone = activeCyclones.find(c => c.id === id);

  if (!cyclone) return <div>Cyclone data not found.</div>;

  return (
    <div className="space-y-6">
      <button onClick={() => navigate('/')} className="text-blue-600 hover:underline">
        &larr; Back to Active List
      </button>

      <div className="bg-white p-6 rounded-lg shadow flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">{cyclone.name}</h2>
          <p className="text-gray-500 mt-1">ID: {cyclone.id}</p>
        </div>
        <IntensityBadge classification={cyclone.classification} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Map */}
        <div className="lg:col-span-2">
          <MapView 
            pastPath={cyclone.pastPath} 
            futurePath={cyclone.futurePath} 
            name={cyclone.name} 
          />
        </div>

        {/* Right Column: Details (Feature 3) */}
        <div className="bg-white p-6 rounded-lg shadow space-y-4">
          <h3 className="text-xl font-bold border-b pb-2">Current Telemetry</h3>
          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold text-gray-700">Max Wind Speed</span>
            <span className="text-red-600 font-bold">{cyclone.windSpeed} km/h</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold text-gray-700">Central Pressure</span>
            <span>{cyclone.pressure} hPa</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold text-gray-700">Destructive Scale</span>
            <span>Category {cyclone.destructiveScale}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold text-gray-700">Est. Storm Surge</span>
            <span>{cyclone.surgeEstimate} meters</span>
          </div>
        </div>
      </div>

      {/* Historical Comparison (Feature 4) */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-bold mb-4">Regional Historical Comparison</h3>
        <table className="min-w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b-2 border-gray-200">
              <th className="p-3 font-semibold">Cyclone Name</th>
              <th className="p-3 font-semibold">Region</th>
              <th className="p-3 font-semibold">Max Wind (km/h)</th>
              <th className="p-3 font-semibold">Damage Scale</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b bg-blue-50">
              <td className="p-3 font-bold">{cyclone.name} (Current)</td>
              <td className="p-3">Odisha Coast</td>
              <td className="p-3">{cyclone.windSpeed}</td>
              <td className="p-3">Pending</td>
            </tr>
            {historicalData.map((data, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="p-3">{data.name}</td>
                <td className="p-3">{data.region}</td>
                <td className="p-3">{data.maxWind}</td>
                <td className="p-3">{data.damage}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}