import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import TrajectoryMap from './TrajectoryMap';
import rawData from './fluxpoint_data.json'; 
import { Activity, ShieldCheck, Zap, MapPin, Play, RotateCcw, Radio, ChevronDown, Cpu, Terminal, Download } from 'lucide-react';

function App() {
  // 1. DATA SAFETY CHECK
  const fleetData = rawData.fleet || [ { name: "Error: Run Python Script", data: [] } ];

  // STATE
  const [selectedRobotId, setSelectedRobotId] = useState(0);
  const [displayedData, setDisplayedData] = useState([]);
  const [logs, setLogs] = useState(["System Initialized. Waiting for connection..."]);
  const [isLive, setIsLive] = useState(false);
  const [showNoise, setShowNoise] = useState(true);
  
  const streamInterval = useRef(null);

  // SWITCH ROBOT
  const handleRobotChange = (e) => {
    resetSimulation();
    setSelectedRobotId(Number(e.target.value));
    addLog(`Target switched to ${fleetData[Number(e.target.value)].name}`);
  };

  // ADD LOG HELPER
  const addLog = (msg) => {
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
    setLogs(prev => [`[${timestamp}] ${msg}`, ...prev].slice(0, 6)); // Keep last 6 logs
  };

  // DOWNLOAD REPORT FUNCTION
  const downloadReport = () => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `FLX_Mission_Report_${timestamp}.txt`;
    
    let content = `FLUXPOINT MISSION REPORT\n`;
    content += `========================\n`;
    content += `Unit: ${fleetData[selectedRobotId].name}\n`;
    content += `Date: ${new Date().toLocaleString()}\n`;
    content += `Status: ${isLive ? 'IN PROGRESS' : 'COMPLETED'}\n\n`;
    content += `TELEMETRY LOGS:\n`;
    logs.forEach(log => content += `${log}\n`);
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
  };

  // START SIMULATION
  const startSimulation = () => {
    if (isLive) return;
    
    setIsLive(true);
    setDisplayedData([]); 
    addLog(`Establishing uplink to ${fleetData[selectedRobotId].name}...`);

    setTimeout(() => {
      addLog("Connection Established. Receiving telemetry stream.");
      
      let currentIndex = 0;
      const currentRobotData = fleetData[selectedRobotId].data;

      streamInterval.current = setInterval(() => {
        if (currentIndex >= currentRobotData.length) {
          clearInterval(streamInterval.current);
          setIsLive(false);
          addLog("Mission Complete. Stream ended.");
          return;
        }

        const point = currentRobotData[currentIndex];
        const drift = Math.abs(point.truth_x - point.pred_x);

        // Drift Alert Logic
        if (drift > 2.0 && currentIndex % 20 === 0) {
           addLog(`[WARNING] High Drift Detected: ${drift.toFixed(2)}m`);
        }

        // Update Graph
        setDisplayedData(prev => [...prev, point]);

        // Simulate Network Log
        if (currentIndex % 10 === 0) {
           addLog(`Packet #${currentIndex} received | Signal: -42dBm`);
        }

        currentIndex++;
      }, 40); 
    }, 800);
  };

  const resetSimulation = () => {
    clearInterval(streamInterval.current);
    setIsLive(false);
    setDisplayedData([]);
    addLog("Simulation Reset.");
  };

  useEffect(() => {
    return () => clearInterval(streamInterval.current);
  }, []);

  // Stats
  const currentPoint = displayedData[displayedData.length - 1] || { truth_x: 0, truth_y: 0, pred_x: 0, pred_y: 0 };
  const currentError = Math.abs(currentPoint.truth_x - currentPoint.pred_x).toFixed(2);

  return (
    <div className="dashboard-container">
      
      {/* --- LEFT SIDEBAR --- */}
      <div className="glass-panel">
        <div className="brand-header">
          <MapPin size={28} className="brand-icon"/>
          <div>
            <div className="title">FluxPoint</div>
            <div className="subtitle">Fleet Command v2.1</div>
          </div>
        </div>
        
        {/* ROBOT SELECTOR */}
        <div style={{ marginBottom: '1.5rem' }}>
            <label className="section-header" style={{fontSize: '0.7rem'}}>Active Unit</label>
            <div style={{ position: 'relative' }}>
                <Cpu size={16} style={{ position: 'absolute', left: 12, top: 12, color: '#94a3b8' }}/>
                <select 
                    value={selectedRobotId} 
                    onChange={handleRobotChange}
                    className="robot-selector"
                    disabled={isLive}
                >
                    {fleetData.map((bot, index) => (
                        <option key={index} value={index}>{bot.name}</option>
                    ))}
                </select>
                <ChevronDown size={16} style={{ position: 'absolute', right: 12, top: 12, color: '#94a3b8', pointerEvents: 'none' }}/>
            </div>
        </div>

        {/* CONTROLS */}
        <button 
            className="toggle-btn" 
            onClick={startSimulation} 
            disabled={isLive} 
            style={{ marginBottom:'10px', backgroundColor: isLive ? '#334155' : '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
            <Play size={16} style={{marginRight:5}} /> {isLive ? "Receiving Data..." : "Initiate Uplink"}
        </button>
        
        <button className="toggle-btn" onClick={resetSimulation} style={{ backgroundColor: '#475569' }}>
            <RotateCcw size={16} style={{marginRight:5}}/> Reset Mission
        </button>

        <button className="toggle-btn" onClick={downloadReport} style={{ marginTop: '10px', background: '#3b82f6' }}>
            <Download size={16} style={{marginRight:5}}/> Download Report
        </button>

        <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '10px' }}>
          <div className="stat-label">Cloud Latency</div>
          <div style={{ color: '#10b981', fontSize: '0.9rem' }}>~24ms (Stable)</div>
        </div>
      </div>

      {/* --- CENTER MAP --- */}
      <div className="glass-panel map-container" style={{ padding: '0.5rem', position: 'relative' }}>
        <div style={{position:'absolute', top: 20, right: 20, zIndex: 10, textAlign:'right'}}>
           {isLive && <div className="blink-anim" style={{color: '#ef4444', fontWeight:'bold', fontSize:'0.8rem', marginBottom:5}}>● LIVE FEED</div>}
           <div style={{background: 'rgba(0,0,0,0.6)', padding: '5px 10px', borderRadius: '4px', fontSize: '0.8rem', color: '#94a3b8'}}>
              X: {currentPoint.truth_x.toFixed(2)} | Y: {currentPoint.truth_y.toFixed(2)}
           </div>
        </div>
        
        <TrajectoryMap data={displayedData} showNoise={showNoise} />
      </div>

      {/* --- RIGHT SIDEBAR --- */}
      <div className="glass-panel">
        <div className="section-header">Live Telemetry</div>
        
        <div className="stat-card">
          <div className="stat-label"><Activity size={16} /> Flux Error</div>
          <div className="stat-value">{currentError}m</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-label"><ShieldCheck size={16} /> Confidence</div>
          <div className="stat-value" style={{ color: '#10b981' }}>99.1%</div>
        </div>

        {/* NETWORK LOG */}
        <div style={{ marginTop: 'auto', background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '8px', border: '1px solid #334155' }}>
           <div style={{display:'flex', alignItems:'center', gap:5, marginBottom:5, color:'#64748b', fontSize:'0.75rem', fontWeight:'bold'}}>
             <Terminal size={12}/> SYSTEM LOG
           </div>
           <div style={{fontFamily: 'monospace', fontSize: '0.7rem', color: '#94a3b8', display:'flex', flexDirection:'column', gap:'4px'}}>
             {logs.map((log, i) => (
               <div key={i} style={{opacity: i === 0 ? 1 : 0.6}}>{log}</div>
             ))}
           </div>
        </div>

      </div>

    </div>
  );
}

export default App;