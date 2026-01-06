import React from 'react';
import '../App.css';

const LegendOverlay = () => {
    return (
        <div className="hud-panel legend-overlay" style={{
            position: 'absolute',
            bottom: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 'auto',
            minWidth: 400,
            zIndex: 50,
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 30,
            backdropFilter: 'blur(15px)'
        }}>
            <div className="legend-item">
                <div className="legend-puck" style={{ background: '#22d3ee', boxShadow: '0 0 10px #22d3ee' }}></div>
                <span className="legend-label">
                    ESTIMATED STATE (<span style={{ fontFamily: 'serif', fontStyle: 'italic' }}>X<sub>est</sub></span>)
                </span>
            </div>

            <div className="legend-item">
                <div className="legend-puck" style={{ background: '#facc15', opacity: 0.8 }}></div>
                <span className="legend-label">
                    ACTUAL STATE (<span style={{ fontFamily: 'serif', fontStyle: 'italic' }}>X<sub>true</sub></span>)
                </span>
            </div>

            <div className="legend-item">
                <div className="legend-puck" style={{ background: '#ef4444' }}></div>
                <span className="legend-label">
                    SENSOR VARIANCE (<span style={{ fontFamily: 'serif', fontStyle: 'italic' }}>σ</span>)
                </span>
            </div>
        </div>
    );
};

export default LegendOverlay;
