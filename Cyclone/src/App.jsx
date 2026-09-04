import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 font-sans text-gray-900">
        <header className="bg-blue-900 text-white p-4 shadow-md">
          <h1 className="text-2xl font-bold">GovTrack: National Cyclone Command</h1>
        </header>
        <main className="p-6 max-w-7xl mx-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard/:id" element={<Dashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}