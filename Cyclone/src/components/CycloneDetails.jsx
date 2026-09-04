import React from 'react';

export default function CycloneDetails({ cyclone }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow border border-gray-100 h-full">
      <h3 className="text-xl font-bold border-b pb-3 mb-4 text-gray-800">
        Current Telemetry
      </h3>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center border-b border-gray-50 pb-3">
          <span className="font-semibold text-gray-700">Max Sustained Wind</span>
          <span className="text-red-600 font-bold text-lg">{cyclone.windSpeed} km/h</span>
        </div>
        
        <div className="flex justify-between items-center border-b border-gray-50 pb-3">
          <span className="font-semibold text-gray-700">Central Pressure</span>
          <span className="text-gray-900 font-medium">{cyclone.pressure} hPa</span>
        </div>
        
        <div className="flex justify-between items-center border-b border-gray-50 pb-3">
          <span className="font-semibold text-gray-700">Destructive Scale</span>
          <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-bold">
            Category {cyclone.destructiveScale}
          </span>
        </div>
        
        <div className="flex justify-between items-center border-b border-gray-50 pb-3">
          <span className="font-semibold text-gray-700">Est. Storm Surge</span>
          <span className="text-blue-600 font-medium">{cyclone.surgeEstimate} meters</span>
        </div>

        <div className="flex justify-between items-center pt-1">
          <span className="font-semibold text-gray-700">Current Status</span>
          <span className="text-green-600 font-medium flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Active Tracking
          </span>
        </div>
      </div>
    </div>
  );
}