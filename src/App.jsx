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
      firmness: 'Variable'
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

  const [showAddForm, setShowAddForm] = useState(false);
  
  const [newMattress, setNewMattress] = useState({
    name: '',
    price: '',
    trial: '',
    warranty: '',
    coils: '',
    lumbar: false,
    returnCosts: '',
    shippingCosts: '',
    firmness: 'Medium'
  });

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
        score: totalScore
      };
    });
  };

  const handleAddMattress = (e) => {
    e.preventDefault();
    const mattressToAdd = {
      id: Math.max(...mattresses.map(m => m.id)) + 1,
      name: newMattress.name,
      price: parseFloat(newMattress.price) || 0,
      fullPrice: parseFloat(newMattress.price) || 0, // Assuming initial price is full price
      trial: parseInt(newMattress.trial) || 0,
      warranty: parseInt(newMattress.warranty) || 0,
      coils: parseInt(newMattress.coils) || 0,
      lumbar: newMattress.lumbar,
      returnCosts: parseFloat(newMattress.returnCosts) || 0,
      shippingCosts: parseFloat(newMattress.shippingCosts) || 0,
      firmness: newMattress.firmness
    };

    setMattresses([...mattresses, mattressToAdd]);
    setNewMattress({
      name: '',
      price: '',
      trial: '',
      warranty: '',
      coils: '',
      lumbar: false,
      returnCosts: '',
      shippingCosts: '',
      firmness: 'Medium'
    });
    setShowAddForm(false);
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border rounded shadow">
          <p className="font-bold mb-2">{data.name}</p>
          <p>Price: ${data.price.toLocaleString()}</p>
          <p>Score: {data.score.toFixed(1)}</p>
          <p>Firmness: {data.firmness}</p>
          <div className="mt-2 text-sm">
            <p>Trial: {data.trial} days</p>
            <p>Warranty: {data.warranty} years</p>
            <p>Coils: {data.coils}</p>
            <p>Lumbar Support: {data.lumbar ? 'Yes' : 'No'}</p>
            <p>Return Cost: ${data.returnCosts}</p>
            <p>Shipping Cost: ${data.shippingCosts}</p>
          </div>
        </div>
      );
    }
    return null;
  };

  const scoredData = calculateScores();
  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="mb-8 p-6 bg-gray-50 rounded-lg shadow">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Scoring Weights (Total: {totalWeight}%)</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(weights).map(([key, value]) => (
            <div key={key} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {key.charAt(0).toUpperCase() + key.slice(1)} Weight (%)
              </label>
              <input
                type="number"
                value={value}
                onChange={(e) => setWeights(prev => ({
                  ...prev,
                  [key]: Math.max(0, Math.min(100, parseInt(e.target.value) || 0))
                }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {showAddForm ? 'Cancel' : 'Add New Mattress'}
        </button>
      </div>

      {showAddForm && (
        <div className="mb-8 p-6 bg-gray-50 rounded-lg shadow">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Add New Mattress</h2>
          <form onSubmit={handleAddMattress} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={newMattress.name}
                onChange={(e) => setNewMattress(prev => ({ ...prev, name: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Price ($)</label>
              <input
                type="number"
                value={newMattress.price}
                onChange={(e) => setNewMattress(prev => ({ ...prev, price: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Trial Period (days)</label>
              <input
                type="number"
                value={newMattress.trial}
                onChange={(e) => setNewMattress(prev => ({ ...prev, trial: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Warranty (years)</label>
              <input
                type="number"
                value={newMattress.warranty}
                onChange={(e) => setNewMattress(prev => ({ ...prev, warranty: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Coil Count</label>
              <input
                type="number"
                value={newMattress.coils}
                onChange={(e) => setNewMattress(prev => ({ ...prev, coils: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Firmness</label>
              <select
                value={newMattress.firmness}
                onChange={(e) => setNewMattress(prev => ({ ...prev, firmness: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="Firm">Firm</option>
                <option value="Medium-Firm">Medium-Firm</option>
                <option value="Medium">Medium</option>
                <option value="Variable">Variable</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Return Costs ($)</label>
              <input
                type="number"
                value={newMattress.returnCosts}
                onChange={(e) => setNewMattress(prev => ({ ...prev, returnCosts: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Shipping Costs ($)</label>
              <input
                type="number"
                value={newMattress.shippingCosts}
                onChange={(e) => setNewMattress(prev => ({ ...prev, shippingCosts: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={newMattress.lumbar}
                onChange={(e) => setNewMattress(prev => ({ ...prev, lumbar: e.target.checked }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">Lumbar Support</label>
            </div>
            <div className="col-span-2">
              <button
                type="submit"
                className="w-full md:w-auto px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Add Mattress
              </button>
            </div>
          </form>
        </div>
      )}

<div className="mb-8 p-6 bg-gray-50 rounded-lg shadow overflow-x-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Mattress Comparison</h2>
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-left p-3 font-bold text-gray-900">Name</th>
              <th className="text-right p-3 font-bold text-gray-900">Price</th>
              <th className="text-right p-3 font-bold text-gray-900">Score</th>
              <th className="text-left p-3 font-bold text-gray-900">Firmness</th>
            </tr>
          </thead>
          <tbody>
            {scoredData.sort((a, b) => b.score - a.score).map((item) => (
              <tr key={item.id} className="border-b border-gray-200">
                <td className="p-3 text-gray-900">{item.name}</td>
                <td className="text-right p-3 text-gray-900">${item.price.toLocaleString()}</td>
                <td className="text-right p-3 text-gray-900">{item.score.toFixed(1)}</td>
                <td className="p-3 text-gray-900">{item.firmness}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mb-8 p-6 bg-gray-50 rounded-lg shadow">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Price vs Feature Score Comparison</h2>
        <div className="w-full bg-white" style={{ height: '600px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart
              margin={{ top: 20, right: 20, bottom: 60, left: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                type="number" 
                dataKey="score" 
                domain={[0, 100]}
                name="Score"
                tick={{ fill: '#374151' }}
              >
                <Label 
                  value="Feature Score" 
                  position="bottom" 
                  offset={0}
                  style={{ fill: '#374151' }}
                />
              </XAxis>
              <YAxis 
                type="number" 
                dataKey="price" 
                domain={['dataMin - 100', 'dataMax + 100']}
                name="Price"
                tick={{ fill: '#374151' }}
              >
                <Label 
                  value="Price ($)" 
                  angle={-90} 
                  position="left" 
                  offset={0}
                  style={{ fill: '#374151' }}
                />
              </YAxis>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {Object.entries(colors).map(([firmness, color]) => (
                <Scatter
                  key={firmness}
                  name={firmness}
                  data={scoredData.filter(d => d.firmness === firmness)}
                  fill={color}
                />
              ))}
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default MattressComparisonTool;