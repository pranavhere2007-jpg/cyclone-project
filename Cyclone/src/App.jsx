import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import './index.css';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <header className="app-header">
          <h1 className="app-title">GovTrak: National Cyclone Command</h1>
        </header>
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard/:id" element={<Dashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}