import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { createChart } from 'lightweight-charts';

const FinancialChartResponsive = () => {
  const chartContainerRef = useRef();
  const location = useLocation();
  const { data, symbols, symbolFilteredData } = location.state || {};
  const chartRef = useRef();
  const [focusedCandle, setFocusedCandle] = useState(null);
  const [filteredData, setFilteredData] = useState(symbolFilteredData);
  const [selectedSymbol, setSelectedSymbol] = useState(symbols[0] || '');

  const handleSymbolChange = (event) => {
    const symbol = event.target.value;
    setSelectedSymbol(symbol);
    const newFilteredData = data.filter(row => row.symbol === symbol);
    setFilteredData(newFilteredData);
  };

  useEffect(() => {
    if (!data || data.length === 0) {
      console.error("No data available for the chart.");
      return;
    }
    const chart = createChart(chartContainerRef.current, {
      width: 1850,
      height: 860,
      layout: {
        background: { color: 'white' },
        textColor: 'black',
      },
      grid: {
        vertLines: { color: '#f0eded' },
        horzLines: { color: '#f0eded' },
      },
      crosshair: {
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
    });

    chartRef.current = chart;

    const candlestickSeries = chart.addCandlestickSeries({
      wickUpColor: 'green',
      upColor: 'green',
      wickDownColor: 'red',
      downColor: 'red',
      borderVisible: false,
    });
    let chartData = filteredData.map(row => ({
      time: row.time,
      open: row.open,
      high: row.high,
      low: row.low,
      close: row.close,
      volume: row.volume,
    }));
    candlestickSeries.setData(chartData);

    chart.subscribeCrosshairMove((param) => {
      if (!param || !param.seriesData) {
        setFocusedCandle(null);
        return;
      }

      const candleData = param.seriesData.get(candlestickSeries);
      if (candleData) {
        const volume = chartData.find(row => row.time === candleData.time)?.volume || 0;
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
  }, [selectedSymbol, data]);
  
  return (
    <>
      <label htmlFor="symbol-select">Select Symbol:</label>
      <select id="symbol-select" onChange={handleSymbolChange} value={selectedSymbol} style={{ width: '30%', marginRight: 'auto' }}>
        {symbols.map((symbol) => (
          <option key={symbol} value={symbol}>{symbol}</option>
        ))}
      </select>
      {focusedCandle && (
        <div style={{
          background: 'rgba(255, 255, 255, 0.8)',
          padding: '5px',
          borderRadius: '5px',
          fontSize: '16px',
          color: focusedCandle.close >= focusedCandle.open ? 'green' : 'red'
        }}>
          <strong>OHLC Data:</strong>
          Open: {focusedCandle.open},  
          High: {focusedCandle.high},  
          Low: {focusedCandle.low},  
          Close: {focusedCandle.close},  
          Volume: {focusedCandle.volume} 
        </div>
      )}
      <div ref={chartContainerRef} style={{ position: 'relative', width: '100%', height: '640px' }}></div>
    </>
  );
};

export default FinancialChartResponsive;
