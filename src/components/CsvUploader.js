// src/components/CsvUploader.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Papa from 'papaparse';
import Footer from './Footer';

const CsvUploader = () => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [data, setData] = useState([]);
  const [symbols, setSymbols] = useState([]);
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.size <= 100 * 1024 * 1024) {
      setLoading(true);
      setErrorMsg('');
      Papa.parse(file, {
        dynamicTyping: true,
        header: true,
        complete: (results) => {
          const rows = results.data;
          const dataWithTimestamp = addTimestampColumn(rows);
          setData(dataWithTimestamp);
          const uniqueSymbols = [...new Set(dataWithTimestamp.map(row => row.symbol))];
          setSymbols(uniqueSymbols);
          setLoading(false);
        },
        error: (error) => {
          setErrorMsg('Failed to parse CSV file.');
          setLoading(false);
        },
      });
    } else {
      setErrorMsg('Please upload a CSV file less than 100MB.');
    }
  };

  const addTimestampColumn = (data) => {
    return data.map(row => {
      if (row.DATE && row.TIME) {
        let formattedDate;
        const parts = row.DATE.split('-');
        if (parts.length === 3) {
          if (parts[0].length === 2) {
            const [month, day, year] = parts;
            formattedDate = `${year}-${month}-${day}`;
          } else {
            formattedDate = row.DATE;
          }
        } else {
          return null;
        }
  
        const timeParts = row.TIME.split(':');
        if (timeParts.length === 3) {
          const [hours, minutes, seconds] = timeParts;
          const formattedTime = `${String(hours).padStart(2, '0')}:${minutes}:${seconds}`;
          const combinedDateTime = `${formattedDate}T${formattedTime}Z`;
          const timestamp = new Date(combinedDateTime).getTime() / 1000;  // Divide by 1000 to convert to seconds
  
          if (isNaN(timestamp)) {
            return null;
          }
  
          return {
            symbol: row.SYMBOL,
            time: timestamp,
            open: row.OPEN,
            high: row.HIGH,
            low: row.LOW,
            close: row.CLOSE,
            volume: row.VOLUME
          };
        }
      }
      return null;
    }).filter(row => row);
  };

  const handleNavigate = () => {
    if (data.length > 0) {
      const symbolFilteredData = data.filter(row => row.symbol === symbols[0]);
      navigate('/chart', { state: { symbolFilteredData, data, symbols } });
    } else {
      setErrorMsg('Please upload a file before proceeding.');
    }
  };

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-lg-8 mx-auto">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="text-center mb-4">Upload Trading Data</h2>
              <div className="mb-4">
                <input
                  type="file"
                  className="form-control"
                  accept=".csv"
                  onChange={handleFileChange}
                />
              </div>
              {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}
              <button 
                className="btn btn-primary w-100" 
                onClick={handleNavigate}
                disabled={loading || data.length === 0}
              >
                {loading ? 'Processing...' : 'View Chart'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CsvUploader;