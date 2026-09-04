import React from 'react';
import { activeCyclones } from '../data/mockData';
import CycloneCard from '../components/CycloneCard';
import "../index.css";

export default function Home() {
  return (
    <div>
      <h2 className="ribbon-heading">Active Tropical Cyclones</h2>
      <div className="cards-grid">
        {activeCyclones.map((cyclone) => (
          <CycloneCard key={cyclone.id} cyclone={cyclone} />
        ))}
      </div>
    </div>
  );
}