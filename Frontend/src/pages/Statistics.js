import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import 'tailwindcss/tailwind.css';

ChartJS.register(ArcElement, Tooltip, Legend);

function Statistics() {
  const [topProductsBySales, setTopProductsBySales] = useState({
    options: {
      chart: {
        id: "top-products-sales",
      },
      xaxis: {
        categories: [],
      },
    },
    series: [
      {
        name: "Sales",
        data: [],
      },
    ],
  });

  const [topProductsByStock, setTopProductsByStock] = useState({
    options: {
      chart: {
        id: "top-products-stock",
      },
      xaxis: {
        categories: [],
      },
    },
    series: [
      {
        name: "Stock",
        data: [],
      },
    ],
  });

  const [stockStatus, setStockStatus] = useState({
    labels: ["Out of Stock", "Low Stock", "In Stock"],
    datasets: [
      {
        data: [0, 0, 0],
        backgroundColor: ["#FF6384", "#FFCE56", "#36A2EB"],
        hoverBackgroundColor: ["#FF6384", "#FFCE56", "#36A2EB"],
      },
    ],
  });

  const [salesLast12Months, setSalesLast12Months] = useState({
    options: {
      chart: {
        id: "sales-last-12-months",
      },
      xaxis: {
        categories: getLast12Months(),
      },
    },
    series: [
      {
        name: "Sales",
        data: [],
      },
    ],
  });

  const [purchasesLast12Months, setPurchasesLast12Months] = useState({
    options: {
      chart: {
        id: "purchases-last-12-months",
      },
      xaxis: {
        categories: getLast12Months(),
      },
    },
    series: [
      {
        name: "Purchases",
        data: [],
      },
    ],
  });

  const [spentLast12Months, setSpentLast12Months] = useState(0);
  const [earnedLast12Months, setEarnedLast12Months] = useState(0);
  const [profitLast12Months, setProfitLast12Months] = useState(0);

  useEffect(() => {
    // Fetch and set data for the charts and information fields
    fetchTopProductsBySalesData();
    fetchTopProductsByStockData();
    fetchStockStatusData();
    fetchSalesLast12MonthsData();
    fetchPurchasesLast12MonthsData();
    fetchSpentLast12Months();
    fetchEarnedLast12Months();
    calculateProfitLast12Months();
  }, []);

  const fetchTopProductsBySalesData = () => {
    // Mock data for top products by sales
    setTopProductsBySales({
      options: {
        ...topProductsBySales.options,
        xaxis: {
          categories: ["Product 1", "Product 2", "Product 3", "Product 4", "Product 5"],
        },
      },
      series: [
        {
          name: "Sales",
          data: [1000, 900, 800, 700, 600],
        },
      ],
    });
  };

  const fetchTopProductsByStockData = () => {
    // Mock data for top products by stock
    setTopProductsByStock({
      options: {
        ...topProductsByStock.options,
        xaxis: {
          categories: ["Product A", "Product B", "Product C", "Product D", "Product E"],
        },
      },
      series: [
        {
          name: "Stock",
          data: [150, 120, 110, 100, 90],
        },
      ],
    });
  };

  const fetchStockStatusData = () => {
    // Mock data for stock status
    setStockStatus({
      labels: ["Out of Stock", "Low Stock", "In Stock"],
      datasets: [
        {
          data: [5, 10, 50],
          backgroundColor: ["#FF6384", "#FFCE56", "#36A2EB"],
          hoverBackgroundColor: ["#FF6384", "#FFCE56", "#36A2EB"],
        },
      ],
    });
  };

  const fetchSalesLast12MonthsData = () => {
    // Mock data for sales last 12 months
    setSalesLast12Months({
      options: {
        ...salesLast12Months.options,
        xaxis: {
          categories: getLast12Months(),
        },
      },
      series: [
        {
          name: "Sales",
          data: [5000, 4800, 4600, 4500, 4700, 4900, 5200, 5300, 5500, 5700, 5900, 6000],
        },
      ],
    });
  };

  const fetchPurchasesLast12MonthsData = () => {
    // Mock data for purchases last 12 months
    setPurchasesLast12Months({
      options: {
        ...purchasesLast12Months.options,
        xaxis: {
          categories: getLast12Months(),
        },
      },
      series: [
        {
          name: "Purchases",
          data: [4000, 4200, 4400, 4300, 4100, 4000, 3800, 3900, 4100, 4200, 4300, 4500],
        },
      ],
    });
  };

  const fetchSpentLast12Months = () => {
    // Mock data for spent last 12 months
    setSpentLast12Months(60000);
  };

  const fetchEarnedLast12Months = () => {
    // Mock data for earned last 12 months
    setEarnedLast12Months(120000);
  };

  const calculateProfitLast12Months = () => {
    // Calculate profit last 12 months
    setProfitLast12Months(earnedLast12Months - spentLast12Months);
  };

  function getLast12Months() {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentMonth = new Date().getMonth();
    const last12Months = [];

    for (let i = 0; i < 12; i++) {
      last12Months.unshift(months[(currentMonth - i + 12) % 12]);
    }

    return last12Months;
  }

  return (
    <div className="col-span-10 p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Statistics</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Spent Last 12 Months */}
        <div className="bg-white p-4 rounded-lg shadow-md col-span-1">
          <h2 className="text-lg font-semibold mb-2">Spent Last 12 Months</h2>
          <p className="text-2xl font-medium text-gray-900">${spentLast12Months}</p>
        </div>
        
        {/* Earned Last 12 Months */}
        <div className="bg-white p-4 rounded-lg shadow-md col-span-1">
          <h2 className="text-lg font-semibold mb-2">Earned Last 12 Months</h2>
          <p className="text-2xl font-medium text-gray-900">${earnedLast12Months}</p>
        </div>
        
        {/* Profit Last 12 Months */}
        <div className="bg-white p-4 rounded-lg shadow-md col-span-1">
          <h2 className="text-lg font-semibold mb-2">Profit Last 12 Months</h2>
          <p className="text-2xl font-medium text-gray-900">${profitLast12Months}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Top 5 Products by Stock */}
        <div className="bg-white p-6 rounded-lg shadow-md col-span-1">
          <h2 className="text-xl font-semibold mb-4">Top 5 Products by Stock</h2>
          <Chart options={topProductsByStock.options} series={topProductsByStock.series} type="bar" height={350} />
        </div>
        
        {/* Stock Status */}
        <div className="bg-white p-6 rounded-lg shadow-md col-span-1">
          <h2 className="text-xl font-semibold mb-4">Stock Status</h2>
          <Doughnut data={stockStatus} />
        </div>
        
        {/* Top 5 Products by Sales */}
        <div className="bg-white p-6 rounded-lg shadow-md col-span-1">
          <h2 className="text-xl font-semibold mb-4">Top 5 Products by Sales</h2>
          <Chart options={topProductsBySales.options} series={topProductsBySales.series} type="bar" height={350} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sales Last 12 Months */}
        <div className="bg-white p-6 rounded-lg shadow-md col-span-1 md:col-span-1">
          <h2 className="text-xl font-semibold mb-4">Sales Last 12 Months</h2>
          <Chart options={salesLast12Months.options} series={salesLast12Months.series} type="bar" height={350} />
        </div>
        
        {/* Purchases Last 12 Months */}
        <div className="bg-white p-6 rounded-lg shadow-md col-span-1 md:col-span-1">
          <h2 className="text-xl font-semibold mb-4">Purchases Last 12 Months</h2>
          <Chart options={purchasesLast12Months.options} series={purchasesLast12Months.series} type="bar" height={350} />
        </div>
      </div>
    </div>
  );
}

export default Statistics;
