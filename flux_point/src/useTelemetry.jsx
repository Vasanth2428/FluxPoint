import { useState, useEffect, useRef } from 'react';
import fleetData from './fluxpoint_data.json';

export const useTelemetry = (isActive, speed = 100) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentPoint, setCurrentPoint] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setCurrentIndex((prev) => {
          const next = prev + 1;
          // Loop data if it reaches the end
          if (next >= fleetData.fleet[0].data.length) return 0;
          
          const point = fleetData.fleet[0].data[next];
          // Adding Programmatic Jitter to make the noise look "real"
          const jitteredPoint = {
            ...point,
            noisy_x: point.noisy_x + (Math.random() - 0.5) * 0.2
          };
          setCurrentPoint(jitteredPoint);
          return next;
        });
      }, speed);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isActive, speed]);

  return currentPoint;
};