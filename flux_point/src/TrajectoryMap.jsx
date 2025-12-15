// src/TrajectoryMap.jsx
import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, ComposedChart } from 'recharts';

const TrajectoryMap = ({ data, showNoise }) => {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: '400px' }}>
      <ResponsiveContainer>
        <ComposedChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis type="number" dataKey="truth_x" name="X Pos" stroke="#94a3b8" />
          <YAxis type="number" dataKey="truth_y" name="Y Pos" stroke="#94a3b8" />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#fff' }}
            itemStyle={{ color: '#fff' }}
            cursor={{ strokeDasharray: '3 3' }}
          />

          {/* 1. The Ground Truth (Green Line) - The "Ideal" */}
          <Line 
            type="monotone" 
            dataKey="truth_y" 
            data={data} // We map truth_x to x-axis automatically
            stroke="#10b981" 
            strokeWidth={2} 
            dot={false} 
            name="Ground Truth"
            isAnimationActive={false}
          />

          {/* 2. The Noisy Input (Red Dots) - Only show if toggle is ON */}
          {showNoise && (
            <Scatter 
              name="Noisy Sensor" 
              data={data} 
              fill="#ef4444" 
              shape="circle"
              line={false}
              dataKey="noisy_y" // scatter uses the Y axis key explicitly here
            />
          )}

          {/* 3. The GhostTrace Prediction (Blue Line) - The "Product" */}
          <Line 
            type="monotone" 
            dataKey="pred_y" 
            stroke="#3b82f6" 
            strokeWidth={3} 
            dot={false} 
            name="Reconstruction"
            animationDuration={2000} // This makes it draw slowly like it's thinking
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrajectoryMap;