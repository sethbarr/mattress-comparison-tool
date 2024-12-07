import React, { useState } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Label, ResponsiveContainer, Legend } from 'recharts';

const MattressComparisonTool = () => {
  const [mattresses, setMattresses] = useState([
    { 
      id: 1,
      name: 'Happsy', 
      price: 1359.2,
      fullPrice: 1699,
      trial: 120,
      warranty: 20,
      coils: 800,
      lumbar: false,
      returnCosts: 0,
      shippingCosts: 0,
      firmness: 'Variable'  // "Medium firm or Plush" 
    },
    { 
      id: 2,
      name: 'My Green Mattress: Kiwi', 
      price: 1449,
      fullPrice: 1599,
      trial: 365,
      warranty: 20,
      coils: 1140,
      lumbar: true,
      returnCosts: 0,
      shippingCosts: 0,
      firmness: 'Medium'
    },
    { 
      id: 3,
      name: 'My Green Mattress Natural Escape', 
      price: 1999,
      fullPrice: 2199,
      trial: 365,
      warranty: 20,
      coils: 1462,
      lumbar: true,
      returnCosts: 0,
      shippingCosts: 0,
      firmness: 'Medium-Firm'
    },
    { 
      id: 4,
      name: 'Birch Natural', 
      price: 1686,
      fullPrice: 2248,
      trial: 100,
      warranty: 25,
      coils: 1000,
      lumbar: false,
      returnCosts: 0,
      shippingCosts: 0,
      firmness: 'Medium-Firm'
    },
    { 
      id: 5,
      name: 'Birch Luxe', 
      price: 2343,
      fullPrice: 3124,
      trial: 100,
      warranty: 25,
      coils: 1000,
      lumbar: true,
      returnCosts: 0,
      shippingCosts: 0,
      firmness: 'Medium-Firm'
    },
    { 
      id: 6,
      name: 'ECO TERRA', 
      price: 1299,
      fullPrice: 1699,
      trial: 90,
      warranty: 15,
      coils: 1280,
      lumbar: false,
      returnCosts: 0,
      shippingCosts: 99,
      firmness: 'Variable'
    },
    { 
      id: 7,
      name: 'Avocado Green', 
      price: 2294,
      fullPrice: 2699,
      trial: 365,
      warranty: 25,
      coils: 1000,
      lumbar: true,
      returnCosts: 99,
      shippingCosts: 0,
      firmness: 'Firm'
    },
    { 
      id: 8,
      name: 'Plushbed Signature', 
      price: 2249,
      fullPrice: 3599,
      trial: 100,
      warranty: 50,
      coils: 0,
      lumbar: false,
      returnCosts: 0,
      shippingCosts: 149,
      firmness: 'Variable'
    }
  ]);

  const [weights, setWeights] = useState({
    trial: 25,
    warranty: 25,
    coils: 25,
    lumbar: 15,
    returnShipping: 10
  });

  const colors = {
    'Firm': '#2563eb',
    'Medium-Firm': '#4f46e5',
    'Medium': '#7c3aed',
    'Variable': '#6b7280'
  };

  const calculateScores = () => {
    const maxTrial = Math.max(...mattresses.map(d => d.trial));
    const maxWarranty = Math.max(...mattresses.map(d => d.warranty));
    const maxCoils = Math.max(...mattresses.map(d => d.coils || 0));
    const maxCosts = Math.max(...mattresses.map(d => (d.returnCosts + d.shippingCosts)));

    return mattresses.map(item => {
      const trialScore = (item.trial / maxTrial) * (weights.trial / 100);
      const warrantyScore = (item.warranty / maxWarranty) * (weights.warranty / 100);
      const coilsScore = item.coils ? (item.coils / maxCoils) * (weights.coils / 100) : 0;
      const lumbarScore = item.lumbar ? (weights.lumbar / 100) : 0;
      const costScore = (1 - ((item.returnCosts + item.shippingCosts) / (maxCosts || 1))) * (weights.returnShipping / 100);

      const totalScore = (trialScore + warrantyScore + coilsScore + lumbarScore + costScore) * 100;

      return {
        ...item,
        score: totalScore,
        components: {
          trial: trialScore * 100,
          warranty: warrantyScore * 100,
          coils: coilsScore * 100,
          lumbar: lumbarScore * 100,
          costs: costScore * 100
        }
      };
    });
  };

  const handleWeightChange = (key, value) => {
    const newValue = Math.max(0, Math.min(100, parseInt(value) || 0));
    setWeights(prev => ({ ...prev, [key]: newValue }));
  };

  const scoredData = calculateScores();
  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border rounded shadow">
          <p className="font-bold">{data.name}</p>
          <p>Price: ${data.price.toLocaleString()}</p>
          <p>Feature Score: {data.score.toFixed(1)}</p>
          <p>Firmness: {data.firmness}</p>
          <div className="mt-2">
            <p className="font-bold">Component Scores:</p>
            {Object.entries(data.components).map(([key, value]) => (
              <p key={key}>{key}: {value.toFixed(1)}</p>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-8">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Scoring Weights (Total: {totalWeight}%)</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(weights).map(([key, value]) => (
            <div key={key} className="space-y-2">
              <label className="text-sm font-medium">
                {key.charAt(0).toUpperCase() + key.slice(1)} Weight (%)
              </label>
              <input
                type="number"
                value={value}
                onChange={(e) => handleWeightChange(key, e.target.value)}
                min="0"
                max="100"
                className="w-full p-2 border rounded"
              />
            </div>
          ))}
        </div>
        {totalWeight !== 100 && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
            Warning: Weights should sum to 100%. Current total: {totalWeight}%
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Mattress Comparison</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Name</th>
                <th className="text-right p-2">Price</th>
                <th className="text-right p-2">Score</th>
                <th className="text-left p-2">Firmness</th>
              </tr>
            </thead>
            <tbody>
              {scoredData.sort((a, b) => b.score - a.score).map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="p-2">{item.name}</td>
                  <td className="text-right p-2">${item.price.toLocaleString()}</td>
                  <td className="text-right p-2">{item.score.toFixed(1)}</td>
                  <td className="p-2">{item.firmness}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Price vs Feature Score Comparison</h2>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart
              margin={{ top: 20, right: 120, bottom: 60, left: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                type="number" 
                dataKey="score" 
                domain={[0, 100]}
                name="Score"
              >
                <Label 
                  value="Feature Score" 
                  position="bottom" 
                  offset={0}
                />
              </XAxis>
              <YAxis 
                type="number" 
                dataKey="price" 
                domain={['dataMin - 100', 'dataMax + 100']}
                name="Price"
              >
                <Label 
                  value="Price ($)" 
                  angle={-90} 
                  position="left" 
                  offset={0}
                />
              </YAxis>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {Object.keys(colors).map(firmness => (
                <Scatter
                  key={firmness}
                  name={firmness}
                  data={scoredData.filter(d => d.firmness === firmness)}
                  fill={colors[firmness]}
                />
              ))}
              {scoredData.map((item) => (
                <text
                  key={item.id}
                  x={item.score + 1}
                  y={item.price}
                  dx={5}
                  dy={4}
                  fontSize={12}
                  fill="#666"
                >
                  {item.name}
                </text>
              ))}
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default MattressComparisonTool;