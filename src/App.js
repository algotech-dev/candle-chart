// src/App.js
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import CsvUploader from './components/CsvUploader';
import FinancialChartResponsive from './FinancialChartResponsive';
import Footer from './components/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  return (
    <HashRouter>
      <div className="app-container d-flex flex-column min-vh-100">
        <Navbar />
        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<CsvUploader />} />
            <Route path="/chart" element={<FinancialChartResponsive />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
};

export default App;