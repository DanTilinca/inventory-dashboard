import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const dataTopStores = [
  { name: 'Store 1', value: 400 },
  { name: 'Store 2', value: 300 },
  { name: 'Store 3', value: 300 },
  { name: 'Store 4', value: 200 },
  { name: 'Store 5', value: 278 },
];

const dataTopProductsBySales = [
  { name: 'Product 1', value: 2400 },
  { name: 'Product 2', value: 4567 },
  { name: 'Product 3', value: 1398 },
  { name: 'Product 4', value: 9800 },
  { name: 'Product 5', value: 3908 },
];

const dataTopProductsByStock = [
  { name: 'Product A', value: 3000 },
  { name: 'Product B', value: 2000 },
  { name: 'Product C', value: 2780 },
  { name: 'Product D', value: 1890 },
  { name: 'Product E', value: 2390 },
];

const stockStatusData = [
  { name: 'Product 1', inStock: 400, lowStock: 300, outOfStock: 200 },
  { name: 'Product 2', inStock: 300, lowStock: 200, outOfStock: 100 },
  { name: 'Product 3', inStock: 200, lowStock: 300, outOfStock: 400 },
  { name: 'Product 4', inStock: 278, lowStock: 189, outOfStock: 123 },
  { name: 'Product 5', inStock: 189, lowStock: 200, outOfStock: 300 },
];

const dataTopStoresByProfit = [
  { name: 'Store 1', profit: 1500 },
  { name: 'Store 2', profit: 1200 },
  { name: 'Store 3', profit: 1000 },
  { name: 'Store 4', profit: 800 },
  { name: 'Store 5', profit: 600 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6384'];
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
  const RADIAN = Math.PI / 180;
  const radius = 50 + innerRadius + (outerRadius - innerRadius);
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="black"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const Statistics = () => {
  return (
    <div className="flex flex-col min-h-screen p-8">
      {/* Bara de sus fixată */}
      <div className="bg-gray-800 text-white p-2 fixed top-0 left-0 w-full z-50">
        <p>Most sold item is: <strong>Product XYZ</strong></p>
        <p>Most sold category is: <strong>Category A</strong></p>
      </div>
      
      <div className="flex justify-between mb-8">
        <div>
          <h2 className="text-xl font-bold mb-2 chart-title">Top 5 Stores by Sales</h2>
          <PieChart width={400} height={400}>
            <Pie
              data={dataTopStores}
              cx={150}
              cy={150}
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {dataTopStores.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
        <div>
          <h2 className="text-xl font-bold mb-2 chart-title">Top 5 Products by Sales</h2>
          <PieChart width={400} height={400}>
            <Pie
              data={dataTopProductsBySales}
              cx={150}
              cy={150}
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={100}
              fill="#82ca9d"
              dataKey="value"
            >
              {dataTopProductsBySales.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
        <div>
          <h2 className="text-xl
font-bold mb-2 chart-title">Top 5 Products by Stock</h2>
<PieChart width={400} height={400}>
  <Pie
    data={dataTopProductsByStock}
    cx={150}
    cy={150}
    labelLine={false}
    label={renderCustomizedLabel}
    outerRadius={100}
    fill="#ffc658"
    dataKey="value"
  >
    {dataTopProductsByStock.map((entry, index) => (
      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
    ))}
  </Pie>
  <Tooltip />
  <Legend />
</PieChart>
</div>
{/* Adăugarea graficului pie pentru topul magazinelor după profit */}
<div>
<h2 className="text-xl font-bold mb-2 chart-title">Top 5 Stores by Profit</h2>
<PieChart width={400} height={400}>
  <Pie
    data={dataTopStoresByProfit}
    cx={150}
    cy={150}
    labelLine={false}
    label={renderCustomizedLabel}
    outerRadius={100}
    fill="#FF6384"
    dataKey="profit"
  >
    {dataTopStoresByProfit.map((entry, index) => (
      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
    ))}
  </Pie>
  <Tooltip />
  <Legend />
</PieChart>
</div>
</div>

{/* Plasarea graficului "Stock Status" în partea de mijloc jos */}
<div className="flex justify-center">
<div className="w-2/3">
<h2 className="text-xl font-bold mb-2 chart-title">Stock Status</h2>
<BarChart
  width={800}
  height={600}
  data={stockStatusData}
  margin={{ top: 5, right: 30, bottom: 5 }}
>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="name" />
  <YAxis />
  <Tooltip />
  <Legend />
  <Bar dataKey="inStock" fill="#82ca9d" />
  <Bar dataKey="lowStock" fill="#ffc658" />
  <Bar dataKey="outOfStock" fill="#ff4d4d" />
</BarChart>
</div>
</div>
</div>
);
};

export default Statistics;