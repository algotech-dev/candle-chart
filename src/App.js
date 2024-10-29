import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate, HashRouter } from 'react-router-dom';
import Papa from 'papaparse';
import './App.css';
import FinancialChartResponsive from './FinancialChartResponsive';

const CsvUploader = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [symbols, setSymbols] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.size <= 100 * 1024 * 1024) {
      setLoading(true);
      setErrorMsg(""); // Reset error message on new upload
      Papa.parse(file, {
        dynamicTyping: true,
        header: true,
        complete: (results) => {
          const rows = results.data;
          console.log(rows)
          const dataWithTimestamp = addTimestampColumn(rows);
          setData(dataWithTimestamp);
          const uniqueSymbols = [...new Set(dataWithTimestamp.map(row => row.symbol))];
          setSymbols(uniqueSymbols);
          setLoading(false);
        },
        error: (error) => {
          console.error("Error parsing CSV: ", error);
          setErrorMsg("Failed to parse CSV file.");
          setLoading(false);
        },
      });
    } else {
      alert('Please upload a CSV file less than 100MB.');
    }
  };

  const addTimestampColumn = (data) => {
    return data.map(row => {
      if (row.DATE && row.TIME) {
        let formattedDate;
  
        // Check the format of the date
        const parts = row.DATE.split('-');
        if (parts.length === 3) {
          if (parts[0].length === 2) {
            // MM-DD-YYYY format
            const [month, day, year] = parts;
            formattedDate = `${year}-${month}-${day}`; // Convert to YYYY-MM-DD
          } else {
            // Assume it's already in YYYY-MM-DD format
            formattedDate = row.DATE;
          }
        } else {
          setErrorMsg("Invalid date format in CSV file.");
          return null;
        }
  
        // Ensure time is in HH:mm:ss format
        const timeParts = row.TIME.split(':');
        if (timeParts.length === 3) {
          const [hours, minutes, seconds] = timeParts;
          const formattedTime = `${String(hours).padStart(2, '0')}:${minutes}:${seconds}`;
  
          const combinedDateTime = `${formattedDate}T${formattedTime}`;
          const timestamp = new Date(combinedDateTime).getTime();
          const time = Math.floor(timestamp / 1000);
  
          // Log if timestamp is NaN
          if (isNaN(time)) {
            setErrorMsg("Invalid date/time for row: " + JSON.stringify(row));
            return null;
          }
  
          // Validate numerical values
          if (typeof row.OPEN !== 'number' || typeof row.HIGH !== 'number' ||
              typeof row.LOW !== 'number' || typeof row.CLOSE !== 'number' || 
              typeof row.VOLUME !== 'number') {
            setErrorMsg("Invalid numerical values in row: " + JSON.stringify(row));
            return null;
          }
  
          return {
            symbol: row.SYMBOL,
            time,
            open: row.OPEN,
            high: row.HIGH,
            low: row.LOW,
            close: row.CLOSE,
            volume: row.VOLUME
          };
        } else {
          setErrorMsg("Invalid time format for row: " + JSON.stringify(row));
          return null;
        }
      }
      return null;
    }).filter(row => row);
  };
  
  
  

  const handleNavigate = () => {
    if (data.length > 0) {
      const symbolFilteredData = data.filter(row => row.symbol === symbols[0]);
      navigate(`/symbol-chart/`, { state: { symbolFilteredData: symbolFilteredData, data, symbols } });
    } else {
      setErrorMsg("Please upload a file before proceeding.");
    }
  };

  return (
    <div className="container">
      <h1>CSV Uploader</h1>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <button className="button" onClick={handleNavigate} disabled={loading || data.length === 0}>
        {loading ? 'Loading...' : 'Go to Chart'}
      </button>
      <p style={{ color: 'red' }}>{errorMsg}</p>
    </div>
  );
};

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<CsvUploader />} />
        <Route path="/symbol-chart/" element={<FinancialChartResponsive />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
