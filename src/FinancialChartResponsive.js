import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { createChart, LineStyle  } from 'lightweight-charts';
import './FinancialChartResponsive.css';

const FinancialChartResponsive = () => {
  const chartContainerRef = useRef();
  const location = useLocation();
  const { data = [], symbols = [] } = location.state || {};
  const chartRef = useRef();
  const [focusedCandle, setFocusedCandle] = useState(null);
  const [selectedSymbol, setSelectedSymbol] = useState(symbols[0] || '');

  // State for toggling series visibility
  const [showCandlestick, setShowCandlestick] = useState(true);
  const [showLineSeries, setShowLineSeries] = useState(false);

  const filteredData = useMemo(() => {
    return data.filter(row => row.symbol === selectedSymbol);
  }, [data, selectedSymbol]);

  const handleSymbolChange = (event) => {
    setSelectedSymbol(event.target.value);
  };

  useEffect(() => {
    if (!data.length) {
      console.error("No data available for the chart.");
      return;
    }
  
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth - 30,
      height: 715,
      layout: {
        background: { color: 'white' },
        textColor: 'black',
      },
      grid: {
        vertLines: { color: '#f0eded' },
        horzLines: { color: '#f0eded' },
      },
      crosshair: {
        mode: 0,
        vertLine: {
          color: 'black',
          labelBackgroundColor: 'black',
          style: 3,
        },
        horzLine: {
          color: 'black',
          labelBackgroundColor: '#9B7DFF',
        },
      },
      priceScale: {
        borderColor: '#f0eded',
      },
      timeScale: {
        borderColor: '#f0eded',
        timeVisible: true,
        secondsVisible: true,
      },
    });
  
    chartRef.current = chart;
  
    const candlestickSeries = chart.addCandlestickSeries({
      wickUpColor: 'green',
      upColor: 'green',
      wickDownColor: 'red',
      downColor: 'red',
      borderVisible: false,
    });
  
    const lineSeries = chart.addAreaSeries({
      lineColor: '#793FDF',
      topColor: '#793FDF', 
      lineWidth: 2,
    });
  
    const updateChartData = () => {
      const candleData = filteredData.map(row => ({
        time: row.time,
        open: row.open,
        high: row.high,
        low: row.low,
        close: row.close,
        volume: row.volume,
      }));
  
      if (showCandlestick) {
        candlestickSeries.setData(candleData);
      } else {
        candlestickSeries.setData([]); // Clear data if not showing
      }
  
      const lineData = filteredData.map(row => ({
        time: row.time,
        value: row.close,
      }));
  
      if (showLineSeries) {
        lineSeries.setData(lineData);
      } else {
        lineSeries.setData([]); // Clear data if not showing
      }
    };
  
    updateChartData();
  
    chart.subscribeCrosshairMove((param) => {
      if (!param || !param.seriesData) {
        setFocusedCandle(null);
        return;
      }
  
      const candleData = param.seriesData.get(candlestickSeries);
      if (candleData) {
        const volume = filteredData.find(row => row.time === candleData.time)?.volume || 0;
        setFocusedCandle({ ...candleData, volume });
      }
    });
  
    const handleResize = () => {
      chart.resize(chartContainerRef.current.clientWidth, 640);
    };
  
    window.addEventListener('resize', handleResize);
  
    return () => {
      chart.remove();
      window.removeEventListener('resize', handleResize);
    };
  }, [filteredData, showCandlestick, showLineSeries]);
  

  return (
    <>
      <div className='support'>
        <label htmlFor="symbol-select">Select Symbol:</label>
        <select
          id="symbol-select"
          onChange={handleSymbolChange}
          value={selectedSymbol}
        >
          {symbols.map((symbol) => (
            <option key={symbol} value={symbol}>{symbol}</option>
          ))}
        </select>
        <div className="toggle-container">
          <label>
            <input
              type="checkbox"
              checked={showCandlestick}
              onChange={() => setShowCandlestick(prev => !prev)}
            />
            Show Candlestick
          </label>
          <label>
            <input
              type="checkbox"
              checked={showLineSeries}
              onChange={() => setShowLineSeries(prev => !prev)}
            />
            Show Line Series
          </label>
        </div>
      </div>

      {focusedCandle && (
        <div
          className={`focused-candle-data ${focusedCandle.close >= focusedCandle.open ? 'positive' : 'negative'}`}
        >
          <strong>OHLC Data:</strong>
          Open: {focusedCandle.open},
          High: {focusedCandle.high},
          Low: {focusedCandle.low},
          Close: {focusedCandle.close},
          Volume: {focusedCandle.volume}
        </div>
      )}

      <div className="chart-container" ref={chartContainerRef}></div>
    </>
  );
};

export default FinancialChartResponsive;