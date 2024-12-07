import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const TestChart = () => {
  const data = [
    { x: 10, y: 1000 },
    { x: 20, y: 2000 },
    { x: 30, y: 1500 },
    { x: 40, y: 2500 },
  ];

  return (
    <div style={{ width: '100%', height: 400, border: '1px solid red' }}>
      <ResponsiveContainer>
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid />
          <XAxis type="number" dataKey="x" name="score" />
          <YAxis type="number" dataKey="y" name="price" />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
          <Scatter name="Test" data={data} fill="#8884d8" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TestChart;