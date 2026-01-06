// src/BootSequence.jsx
import React, { useEffect, useState } from 'react';
import './App.css'; // We will add styles there
import { Cpu, Zap, ShieldCheck } from 'lucide-react';

const BootSequence = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // 1. Progress Bar Logic
    const interval = setInterval(() => {
      setProgress((old) => {
        if (old >= 100) {
          clearInterval(interval);
          return 100;
        }
        // Random chunks of progress to look like "loading files"
        return old + Math.floor(Math.random() * 10);
      });
    }, 100);

    // 2. Step Sequence Logic
    const timeouts = [];
    timeouts.push(setTimeout(() => setStep(1), 500));  // Logo Fade In
    timeouts.push(setTimeout(() => setStep(2), 2500)); // Loading Complete
    timeouts.push(setTimeout(() => {
        setStep(3); // Exit animation
        setTimeout(onComplete, 800); // Actually unmount
    }, 3500));

    return () => {
        clearInterval(interval);
        timeouts.forEach(clearTimeout);
    };
  }, [onComplete]);

  return (
    <div className={`boot-container ${step === 3 ? 'fade-out' : ''}`}>
      
      {/* CENTRAL LOGO ANIMATION */}
      <div className={`boot-logo ${step >= 1 ? 'visible' : ''}`}>
        <div className="logo-icon-wrapper">
            <Cpu size={64} color="#f59e0b" />
        </div>
        <h1 className="boot-title">FLUXPOINT <span style={{color:'#f59e0b'}}>OS</span></h1>
        <div className="boot-subtitle">NEURAL TRAJECTORY SYSTEM</div>
      </div>

      {/* LOADER BAR */}
      <div className="boot-loader-wrapper">
        <div className="boot-bar-bg">
            <div className="boot-bar-fill" style={{width: `${Math.min(progress, 100)}%`}}></div>
        </div>
        <div className="boot-status-text">
            {progress < 100 ? `INITIALIZING KERNEL... ${progress}%` : "SYSTEM READY"}
        </div>
      </div>

      {/* DECORATIVE CORNER TEXT */}
      <div className="boot-corner top-left">v2.1 RC</div>
      <div className="boot-corner bottom-right">SECURE CONNECTION</div>

    </div>
  );
};

export default BootSequence;