import React from 'react';
import { activeCyclones } from '../data/mockData';
import CycloneCard from '../components/CycloneCard';
import "../index.css";
import Helplines from '../components/HelpLines';

export default function Home() {
  return (
    <div>
      <div className="ribbon-container">
        <h2 className="ribbon-heading">Active Tropical Cyclones</h2>
      </div>
      <div>
        <Helplines />
      </div>
      <div className="cards-grid">
        {activeCyclones.map((cyclone) => (
          <CycloneCard key={cyclone.id} cyclone={cyclone} />
        ))}
      </div>
    </div>
  );
}