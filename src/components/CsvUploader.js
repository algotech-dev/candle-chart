import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Papa from 'papaparse';

const CsvUploader = () => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [data, setData] = useState([]);
  const [symbols, setSymbols] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const navigate = useNavigate();

  const processFile = useCallback((file) => {
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
        error: () => {
          setErrorMsg('Failed to parse CSV file.');
          setLoading(false);
        },
      });
    } else {
      setErrorMsg('Please upload a CSV file less than 100MB.');
    }
  }, []);

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
          const timestamp = new Date(combinedDateTime).getTime() / 1000;
  
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

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file.type === 'text/csv') {
      processFile(file);
    } else {
      setErrorMsg('Please upload a CSV file only.');
    }
  }, [processFile]);

  const handleFileChange = useCallback((event) => {
    const file = event.target.files[0];
    processFile(file);
  }, [processFile]);

  const handleNavigate = useCallback(() => {
    if (data.length > 0) {
      const symbolFilteredData = data.filter(row => row.symbol === symbols[0]);
      navigate('/chart', { state: { symbolFilteredData, data, symbols } });
    } else {
      setErrorMsg('Please upload a file before proceeding.');
    }
  }, [data, symbols, navigate]);

  return (
    <div className="container-fluid py-5" style={{ backgroundColor: '#f8f9fa' }}>
      <div className="container">
        {/* Header Section */}
        <div className="text-center mb-5">
          <h1 className="display-4 mb-3" style={{ 
            color: '#2c3e50',
            borderBottom: '3px solid #3498db',
            display: 'inline-block',
            paddingBottom: '10px'
          }}>
            Trading Data Analyzer
          </h1>
          <p className="lead text-muted">Transform your trading data into actionable insights</p>
        </div>

        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="card" style={{
              borderRadius: '15px',
              border: 'none',
              boxShadow: '0 0 20px rgba(0,0,0,0.1)'
            }}>
              <div className="card-body p-0">
                <div className="row g-0">
                  {/* Left Column - Requirements */}
                  <div className="col-md-4 requirements-section" style={{
                    backgroundColor: '#2c3e50',
                    borderRadius: '15px 0 0 15px',
                    padding: '2rem'
                  }}>
                    <h3 className="text-white mb-4">
                      <i className="bi bi-file-text me-2"></i>
                      File Specifications
                    </h3>
                    <ul className="list-unstyled text-white-50">
                      <li className="mb-3 d-flex align-items-center">
                        <i className="bi bi-check-circle-fill me-2 text-success"></i>
                        CSV format only
                      </li>
                      <li className="mb-3 d-flex align-items-center">
                        <i className="bi bi-check-circle-fill me-2 text-success"></i>
                        Maximum size: 100MB
                      </li>
                      <li className="mb-3 d-flex align-items-center">
                        <i className="bi bi-check-circle-fill me-2 text-success"></i>
                        Required columns:
                        <small className="d-block ms-4 mt-2">
                          DATE, TIME, SYMBOL, OPEN,<br/>
                          HIGH, LOW, CLOSE, VOLUME
                        </small>
                      </li>
                      <li className="mb-3 d-flex align-items-center">
                      <i className="bi bi-check-circle-fill me-2 text-success"></i>
                        Date Format:
                        <small className="d-block ms-4 mt-2">
                          MM-DD-YYYY<br/>
                          OR<br/>
                          YYYY-MM-DD
                        </small>

                      </li>
                      <li className="mb-3 d-flex align-items-center">
                        <i className="bi bi-check-circle-fill me-2 text-success"></i>
                        Time: HH:MM:SS
                      </li>
                    </ul>
                  </div>

                  {/* Right Column - Upload Area */}
                  <div className="col-md-8">
                    <div className="p-4 p-lg-5">
                      <div
                        className={`upload-area ${isDragging ? 'dragging' : ''}`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        style={{
                          border: `2px dashed ${isDragging ? '#3498db' : '#dee2e6'}`,
                          borderRadius: '10px',
                          padding: '3rem',
                          textAlign: 'center',
                          backgroundColor: isDragging ? '#f8f9fa' : 'white',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <i className="bi bi-cloud-upload display-3 mb-3 d-block" style={{ color: '#3498db' }}></i>
                        <h4 className="mb-3">Upload Your Trading Data</h4>
                        <p className="text-muted mb-3">
                          Drag and drop your CSV file here, or
                          <label className="ms-1 text-primary" style={{ cursor: 'pointer' }}>
                            browse
                            <input
                              type="file"
                              className="d-none"
                              accept=".csv"
                              onChange={handleFileChange}
                            />
                          </label>
                        </p>
                        {loading && (
                          <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        )}
                      </div>

                      {errorMsg && (
                        <div className="alert alert-danger mt-4" role="alert" style={{
                          borderRadius: '10px',
                          border: 'none',
                          backgroundColor: '#fff1f0',
                          color: '#dc3545',
                          padding: '1rem'
                        }}>
                          <i className="bi bi-exclamation-circle me-2"></i>
                          {errorMsg}
                        </div>
                      )}

                      {data.length > 0 && (
                        <button 
                          className="btn btn-primary w-100 mt-4"
                          onClick={handleNavigate}
                          disabled={loading}
                          style={{
                            backgroundColor: '#3498db',
                            border: 'none',
                            padding: '12px',
                            borderRadius: '10px',
                            fontWeight: '500',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          <i className="bi bi-graph-up me-2"></i>
                          {loading ? 'Processing...' : 'Analyze Trading Data'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CsvUploader;