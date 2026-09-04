import React from 'react';

export default function IntensityBadge({ classification }) {
  let bgColor = 'bg-gray-200';
  let textColor = 'text-gray-800';

  if (classification.includes('Super')) {
    bgColor = 'bg-purple-200';
    textColor = 'text-purple-800';
  } else if (classification.includes('Severe')) {
    bgColor = 'bg-red-200';
    textColor = 'text-red-800';
  } else if (classification.includes('Storm')) {
    bgColor = 'bg-orange-200';
    textColor = 'text-orange-800';
  }

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${bgColor} ${textColor}`}>
      {classification}
    </span>
  );
}