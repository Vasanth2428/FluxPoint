// src/LandingPage.jsx
import React, { useEffect, useState } from 'react';
import './LandingPage.css';
import { ChevronRight, Cpu, Activity } from 'lucide-react';

const LandingPage = ({ onEnter }) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => { setLoaded(true); }, []);

  return (
    <div className="landing-container">

      {/* 3D SCENE: The Mascot */}
      <div className="landing-3d-bg fade-in-slow" style={{ zIndex: 1 }}>
        <img
          src="/mascot_cyber.png"
          alt="FluxBot Cyber"
          style={{
            position: 'absolute',
            right: '5%',
            bottom: '5%',
            height: '85vh',
            objectFit: 'contain',
            filter: 'drop-shadow(0 0 30px rgba(139, 92, 246, 0.4))',
            animation: 'float 6s ease-in-out infinite'
          }}
        />

        {/* Ambient glow */}
        <div style={{
          position: 'absolute',
          top: '20%',
          right: '10%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(34, 211, 238, 0.15) 0%, transparent 70%)',
          filter: 'blur(40px)',
          zIndex: -1
        }}></div>
      </div>

      <div className={`landing-content ${loaded ? 'start-anim' : ''}`} style={{ zIndex: 10 }}>

        <div className="landing-header">
          <div className="title" style={{ fontSize: '1.2rem', color: '#fff', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 8, height: 8, background: '#d946ef', borderRadius: '50%', boxShadow: '0 0 10px #d946ef' }}></div>
            FLUXPOINT
          </div>
          <div className="pill-badge" style={{ borderColor: 'rgba(255,255,255,0.2)', color: '#94a3b8' }}>SYSTEM ONLINE</div>
        </div>

        <div className="hero-section" style={{ maxWidth: '650px' }}>
          <h1 className="hero-title animate-up delay-1" style={{ fontSize: '5rem', lineHeight: 1, marginBottom: '20px' }}>
            SENTIENT <br />
            <span style={{ color: '#d946ef' }}>PRECISION.</span>
          </h1>
          <p className="hero-subtitle animate-up delay-2" style={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: '500px' }}>
            Next-generation trajectory reconstruction using LSTM neural architecture.
            Reduce sensor noise by 90% with autonomous self-correcting agents.
          </p>

          <button className="cta-button animate-up delay-3" onClick={onEnter} style={{ marginTop: '2rem' }}>
            INITIALIZE INTERFACE <ChevronRight size={20} />
          </button>
        </div>

        <div className="features-footer animate-up delay-4">
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <Cpu size={18} color="#d946ef" />
            <span style={{ fontSize: '0.8rem', letterSpacing: '0.1em' }}>NEURAL ENGINE</span>
          </div>
          <div style={{ width: 1, height: 15, background: '#333' }}></div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <Activity size={18} color="#d946ef" />
            <span style={{ fontSize: '0.8rem', letterSpacing: '0.1em' }}>REAL-TIME 5HZ</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LandingPage;