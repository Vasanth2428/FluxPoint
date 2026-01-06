import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import '../App.css';

const LiveGraph = ({ data }) => {
    // We'll calculate a simple error metric for the graph
    const graphData = data.slice(-50).map((d, i) => ({
        name: i,
        error: Math.abs(d.truth_x - d.pred_x) + Math.abs(d.truth_y - d.pred_y) // Simple Manhatten distance for demo
    }));

    return (
        <div style={{ width: '100%', height: 120 }}>
            <ResponsiveContainer>
                <AreaChart data={graphData}>
                    <defs>
                        <linearGradient id="colorError" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <Tooltip
                        contentStyle={{ background: 'rgba(0,0,0,0.8)', border: '1px solid #333', color: '#fff' }}
                        itemStyle={{ color: '#8b5cf6' }}
                        labelStyle={{ display: 'none' }}
                    />
                    <Area
                        type="monotone"
                        dataKey="error"
                        stroke="#8b5cf6"
                        fillOpacity={1}
                        fill="url(#colorError)"
                        isAnimationActive={false} // Performance
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default LiveGraph;
