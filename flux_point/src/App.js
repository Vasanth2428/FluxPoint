
import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Flux3D from './flux.3d';
import LandingPage from './LandingPage';
import BootSequence from './BootSequence';
import Navbar from './components/Navbar';
import LiveGraph from './components/LiveGraph';
import LegendOverlay from './components/LegendOverlay'; // NEW IMPORT
import rawData from './fluxpoint_data.json';
import { Activity, Cpu, Play, RotateCcw, Terminal, Layers } from 'lucide-react';

const HoloIcon = ({ icon: Icon }) => (
  <div className="holo-icon-box"><Icon size={20} /></div>
);

function App() {
  const [currentView, setCurrentView] = useState('boot');
  const fleetData = rawData.fleet || [];
  const [selectedRobotId, setSelectedRobotId] = useState(0);
  const [displayedData, setDisplayedData] = useState([]);
  const [logs, setLogs] = useState([{ time: "00:00:00", msg: "System Ready.", type: "info" }]);
  const [isLive, setIsLive] = useState(false);
  const [showNoise, setShowNoise] = useState(true);

  // PHASE 2: GLOBAL CONTROLS
  const [noiseIntensity, setNoiseIntensity] = useState(1.5);
  const [viewMode, setViewMode] = useState('follow');

  const streamInterval = useRef(null);
  const noiseRef = useRef(noiseIntensity);

  useEffect(() => { noiseRef.current = noiseIntensity; }, [noiseIntensity]);

  const addLog = (msg, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false, minute: '2-digit', second: '2-digit' });
    setLogs(prev => [{ time: timestamp, msg, type }, ...prev].slice(0, 10));
  };

  const startSimulation = () => {
    if (isLive) return;
    const currentRobot = fleetData[selectedRobotId];
    if (!currentRobot) return;

    setIsLive(true);
    setDisplayedData([]);
    addLog(`UPLINK ESTABLISHED: ${currentRobot.name} `, 'new');

    let currentIndex = 0;
    streamInterval.current = setInterval(() => {
      if (currentIndex >= currentRobot.data.length - 1) { // Safety check
        clearInterval(streamInterval.current);
        setIsLive(false);
        addLog("TRAJECTORY COMPLETE.", 'new');
        return;
      }

      const point = currentRobot.data[currentIndex];

      const currentNoise = noiseRef.current;
      const livePoint = {
        ...point,
        noisy_x: (point.noisy_x || point.truth_x) + (Math.random() - 0.5) * currentNoise,
        noisy_y: (point.noisy_y || point.truth_y || 0) + (Math.random() - 0.5) * currentNoise
      };

      setDisplayedData(prev => [...prev, livePoint].slice(-200));

      const drift = Math.abs(point.truth_x - point.pred_x);
      if (drift > 2.5 && Math.random() > 0.85) {
        addLog(`LSTM CORRECTION: Drift at ${drift.toFixed(2)} m`, 'warn');
      }

      currentIndex++;
    }, 100);
  };

  const resetSimulation = () => {
    if (streamInterval.current) clearInterval(streamInterval.current);
    setIsLive(false);
    setDisplayedData([]);
    addLog("System Reset.");
  };

  // PHASE 3: METRICS & EXPORT
  const calculateRMSE = (dataPoints) => {
    if (dataPoints.length === 0) return 0;
    const sumSquares = dataPoints.reduce((acc, p) => {
      const dx = p.truth_x - p.pred_x;
      const dy = p.truth_y - p.pred_y;
      return acc + (dx * dx + dy * dy);
    }, 0);
    return Math.sqrt(sumSquares / dataPoints.length).toFixed(3);
  };

  const exportData = () => {
    const headers = "time,truth_x,truth_y,pred_x,pred_y,noisy_x,noisy_y\n";
    const csv = displayedData.map(d =>
      `${d.time},${d.truth_x},${d.truth_y},${d.pred_x},${d.pred_y},${d.noisy_x},${d.noisy_y} `
    ).join("\n");

    const blob = new Blob([headers + csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fluxpoint_telemetry.csv';
    a.click();
    addLog("Telemetry Exported CSV", 'new');
  };

  // PHASE 5: SENTIENT INTERACTION
  const stressTest = () => {
    const prevNoise = noiseIntensity;
    setNoiseIntensity(5.0);
    addLog("WARNING: STRESS TEST INITIATED", 'warn');
    setTimeout(() => {
      setNoiseIntensity(prevNoise);
      addLog("STRESS TEST COMPLETE. Stabilizing...", 'info');
    }, 3000);
  };

  // PHASE 5: REPLAY & MODAL
  const [showModal, setShowModal] = useState(false);
  const [scrubIndex, setScrubIndex] = useState(null);

  const renderData = scrubIndex !== null ? displayedData.slice(0, scrubIndex) : displayedData;

  const currentPoint = renderData[renderData.length - 1] || { truth_x: 0, truth_y: 0, pred_x: 0, pred_y: 0 };
  const currentDrift = Math.abs(currentPoint.truth_x - currentPoint.pred_x).toFixed(3);
  const confidence = Math.max(0, 100 - (currentDrift * 15)).toFixed(1);

  if (currentView === 'boot') return <BootSequence onComplete={() => setCurrentView('landing')} />;
  if (currentView === 'landing') return <LandingPage onEnter={() => setCurrentView('dashboard')} />;

  return (
    <div className="sentient-container">
      <Navbar
        noiseIntensity={noiseIntensity}
        setNoiseIntensity={setNoiseIntensity}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onExport={exportData}
        onStressTest={stressTest}
        currentDrift={parseFloat(currentDrift)}
        onToggleSettings={() => setShowModal(!showModal)}
      />

      <div className="background-canvas">
        <Flux3D data={renderData} showNoise={showNoise} viewMode={viewMode} />
        <LegendOverlay />
      </div>

      {/* MODAL OVERLAY */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
        }} onClick={() => setShowModal(false)}>
          <div className="hud-panel" style={{ maxWidth: 500, border: '1px solid #d946ef' }} onClick={e => e.stopPropagation()}>
            <div className="hud-title" style={{ fontSize: '1.2rem', color: '#d946ef' }}>LSTM ARCHITECTURE v2.1</div>
            <p style={{ lineHeight: 1.6, color: '#ccc', fontSize: '0.9rem' }}>
              This system utilizes a **Long Short-Term Memory (LSTM)** recurrent neural network to reconstruct robot trajectories from noisy sensor data.
            </p>
            <ul style={{ color: '#94a3b8', fontSize: '0.9rem', paddingLeft: 20 }}>
              <li>Input Layer: [x, y] noisy coordinates (t-10 to t)</li>
              <li>Hidden Layers: 2x 128 units (tanh activation)</li>
              <li>Dropout: 0.2 (Stochastic Regularization)</li>
              <li>Output: [x, y] predicted position (t+1)</li>
            </ul>
            <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: 10, fontStyle: 'italic' }}>
              Click anywhere to close terminal.
            </div>
          </div>
        </div>
      )}

      <div className="hud-layout">
        <aside className="hud-column left">
          <div className="hud-panel">
            <div className="hud-title"><HoloIcon icon={Cpu} /> <span>SYSTEM STATUS</span></div>
            <div className="data-row"><span>UPLINK</span> <span className={isLive ? "text-cyan" : ""}>{isLive ? "LIVE" : "STANDBY"}</span></div>
            <div className="data-row"><span>BUFFER</span> <span>{renderData.length} pts</span></div>
            <div className="data-row"><span>RMSE</span> <span>{calculateRMSE(renderData)}</span></div>
            <div className="data-row" style={{ marginTop: 10 }}>
              <span>CONFIDENCE</span>
              <span className={`data - val ${confidence > 80 ? 'text-cyan' : 'text-red'} `}>{confidence}%</span>
            </div>
            <div className="confidence-bar-bg" style={{ width: '100%', height: 4, background: '#333', marginTop: 5 }}>
              <div style={{ width: `${confidence}% `, height: '100%', background: confidence > 80 ? '#22d3ee' : '#ef4444', transition: 'width 0.3s' }}></div>
            </div>
          </div>

          <div className="hud-panel">
            <div className="hud-title">MISSION CONTROL</div>
            <button className={`cyber - button ${isLive ? 'alert' : ''} `} onClick={isLive ? resetSimulation : startSimulation}>
              {isLive ? <RotateCcw size={16} /> : <Play size={16} />} {isLive ? "ABORT" : "INITIATE"}
            </button>
            <button className="cyber-button secondary" onClick={() => setShowNoise(!showNoise)}>
              <Layers size={16} /> {showNoise ? "HIDE NOISE" : "SHOW NOISE"}
            </button>

            {/* REPLAY SCRUBBER */}
            <div style={{ marginTop: 15 }}>
              <div className="hud-title" style={{ marginBottom: 5 }}>REPLAY BUFFER</div>
              <input
                type="range"
                min="1"
                max={Math.max(displayedData.length, 1)}
                value={scrubIndex !== null ? scrubIndex : displayedData.length}
                onChange={(e) => {
                  setIsLive(false);
                  const val = Number(e.target.value);
                  setScrubIndex(val === displayedData.length ? null : val);
                }}
                style={{ width: '100%' }}
              />
            </div>
          </div>
        </aside>

        <aside className="hud-column right">
          <div className="hud-panel">
            <div className="hud-title"><HoloIcon icon={Activity} /> <span>REAL-TIME DRIFT</span></div>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
              <div className="drift-value">{currentDrift}<span className="unit">m</span></div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: 10 }}>AVG: {calculateRMSE(renderData)}m</div>
            </div>
            <LiveGraph data={renderData} />
          </div>

          <div className="hud-panel log-panel">
            <div className="hud-title"><HoloIcon icon={Terminal} /> <span>EVENT_LOG</span></div>
            <div className="log-container">
              {logs.map((l, i) => (
                <div key={i} className={`log - entry ${l.type} `}>
                  <span className="log-time">{l.time}</span> {l.msg}
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default App;