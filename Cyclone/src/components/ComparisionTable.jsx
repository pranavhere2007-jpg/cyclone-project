import React from 'react';

export default function ComparisonTable({ currentCyclone, historicalData }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow border border-gray-100 mt-6">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-800">Regional Historical Comparison</h3>
        <p className="text-sm text-gray-500">Comparing active threat metrics against historical baselines in the current trajectory region.</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b-2 border-gray-200 text-gray-700">
              <th className="p-3 font-semibold rounded-tl-lg">Cyclone Name</th>
              <th className="p-3 font-semibold">Region</th>
              <th className="p-3 font-semibold">Max Wind (km/h)</th>
              <th className="p-3 font-semibold rounded-tr-lg">Damage Scale</th>
            </tr>
          </thead>
          <tbody>
            {/* Current Cyclone Highlighted */}
            <tr className="border-b-2 border-blue-200 bg-blue-50">
              <td className="p-3 font-bold text-blue-900 flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                {currentCyclone.name} (Current)
              </td>
              <td className="p-3 font-medium text-blue-800">Odisha Coast</td>
              <td className="p-3 font-bold text-red-600">{currentCyclone.windSpeed}</td>
              <td className="p-3 font-medium text-blue-800">Projected</td>
            </tr>
            
            {/* Historical Data Mapping */}
            {historicalData.map((data, index) => (
              <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="p-3 text-gray-800">{data.name}</td>
                <td className="p-3 text-gray-600">{data.region}</td>
                <td className="p-3 text-gray-800">{data.maxWind}</td>
                <td className="p-3 text-gray-600">{data.damage}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}