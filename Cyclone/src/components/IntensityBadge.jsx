import React from 'react';

export default function IntensityBadge({ classification }) {
  let typeClass = 'badge-default';

  if (classification.includes('Super')) {
    typeClass = 'badge-super';
  } else if (classification.includes('Severe')) {
    typeClass = 'badge-severe';
  } else if (classification.includes('Storm')) {
    typeClass = 'badge-storm';
  }

  return (
    <span className={`badge ${typeClass}`}>
      {classification}
    </span>
  );
}