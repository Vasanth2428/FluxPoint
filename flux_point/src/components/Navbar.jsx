import React from 'react';
import { Settings, Sliders, Monitor, Download, Zap, AlertTriangle } from 'lucide-react';
import '../App.css'; // Assuming we put basic nav styles here or inline

const Navbar = ({ noiseIntensity, setNoiseIntensity, viewMode, setViewMode, onExport, onStressTest, currentDrift, onToggleSettings }) => {

    // Status Logic
    const isCritical = currentDrift > 4.0;
    const isWarning = currentDrift > 2.0;
    const statusColor = isCritical ? '#ef4444' : isWarning ? '#facc15' : '#22d3ee';

    return (
        <nav className="navbar-glass">
            <div className="nav-brand">
                <div className="brand-dot" style={{ background: statusColor, boxShadow: `0 0 10px ${statusColor}` }}></div>
                FLUXPOINT <span style={{ fontWeight: 300, color: '#94a3b8' }}>OS</span>
                {isCritical && <span style={{ fontSize: '0.7rem', color: '#ef4444', marginLeft: 10, animation: 'blink 1s infinite' }}>CRITICAL DRIFT</span>}
            </div>

            <div className="nav-controls">
                <div className="control-group">
                    <label><Sliders size={14} /> NOISE VARIANCE</label>
                    <input
                        type="range"
                        min="0"
                        max="5"
                        step="0.1"
                        value={noiseIntensity}
                        onChange={(e) => setNoiseIntensity(parseFloat(e.target.value))}
                        className="cyber-range"
                    />
                    <span className="value-badge">{noiseIntensity.toFixed(1)}</span>
                </div>

                <div className="control-divider"></div>

                <div className="control-group">
                    <button
                        className={`nav-btn ${viewMode === 'follow' ? 'active' : ''}`}
                        onClick={() => setViewMode('follow')}
                    >
                        FOLLOW
                    </button>
                    <button
                        className={`nav-btn ${viewMode === 'top' ? 'active' : ''}`}
                        onClick={() => setViewMode('top')}
                    >
                        ORBIT
                    </button>
                </div>

                <div className="control-divider"></div>

                <button className="nav-btn alert-hover" onClick={onStressTest} title="Stress Test">
                    <Zap size={14} /> STRESS
                </button>
            </div>

            <div className="nav-actions">
                <button className="nav-btn" onClick={onExport} title="Export Telemetry CSV">
                    <Download size={18} />
                </button>
                <Settings size={20} className="nav-icon" style={{ cursor: 'pointer' }} onClick={onToggleSettings} />
            </div>
        </nav>
    );
};

export default Navbar;
