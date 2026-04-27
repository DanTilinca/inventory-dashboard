import React, { useEffect, useMemo, useState } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function getLast12Months() {
  const currentMonth = new Date().getMonth();
  const last12Months = [];

  for (let i = 0; i < 12; i++) {
    last12Months.unshift(monthLabels[(currentMonth - i + 12) % 12]);
  }

  return last12Months;
}

const verticalBarDataset = (label, color) => ({
  label,
  data: new Array(12).fill(0),
  backgroundColor: color,
  borderRadius: 6,
  maxBarThickness: 40,
});

const emptyHorizontalBar = (label, color) => ({
  labels: [],
  datasets: [
    {
      label,
      data: [],
      backgroundColor: color,
      borderRadius: 6,
      maxBarThickness: 36,
    },
  ],
});

const verticalBarOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: { mode: "index", intersect: false },
  },
  scales: {
    x: {
      grid: { color: "#e5e7eb", drawBorder: false },
      ticks: { color: "#6b7280", maxRotation: 45 },
    },
    y: {
      beginAtZero: true,
      grid: { color: "#e5e7eb", borderDash: [4, 4], drawBorder: false },
      ticks: { color: "#6b7280", callback: (v) => Math.round(Number(v)) },
    },
  },
};

const horizontalBarOptions = {
  indexAxis: "y",
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: { mode: "index", intersect: false },
  },
  scales: {
    x: {
      beginAtZero: true,
      grid: { color: "#e5e7eb", drawBorder: false },
      ticks: { color: "#6b7280" },
    },
    y: {
      grid: { display: false },
      ticks: { color: "#6b7280", font: { size: 11 } },
    },
  },
};

function Statistics() {
  const [topProductsBySalesBar, setTopProductsBySalesBar] = useState(() => emptyHorizontalBar("Sales", "#3b82f6"));

  const [topProductsByStockBar, setTopProductsByStockBar] = useState(() => emptyHorizontalBar("Stock", "#10b981"));

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

  const [salesLast12Bar, setSalesLast12Bar] = useState({
    labels: getLast12Months(),
    datasets: [verticalBarDataset("Sales", "#6366f1")],
  });

  const [purchasesLast12Bar, setPurchasesLast12Bar] = useState({
    labels: getLast12Months(),
    datasets: [verticalBarDataset("Purchases", "#f59e0b")],
  });

  const [spentLast12Months, setSpentLast12Months] = useState(0);
  const [earnedLast12Months, setEarnedLast12Months] = useState(0);
  const [profitLast12Months, setProfitLast12Months] = useState(0);

  useEffect(() => {
    fetchTopProductsByStockData();
    fetchStockStatusData();
    fetchSpentLast12Months();
    fetchPurchasesLast12Months();
    fetchEarnedLast12Months();
    fetchSalesLast12Months();
    fetchTopProductsBySalesData();
  }, []);

  const fetchTopProductsByStockData = () => {
    fetch(`http://localhost:4000/api/product/topProductsByStock`)
      .then((response) => response.json())
      .then((data) => {
        setTopProductsByStockBar({
          labels: data.map((item) => item.name),
          datasets: [
            {
              label: "Stock",
              data: data.map((item) => item.stock),
              backgroundColor: "#10b981",
              borderRadius: 6,
              maxBarThickness: 36,
            },
          ],
        });
      })
      .catch((err) => console.error("Failed to fetch top products by stock:", err));
  };

  const fetchStockStatusData = () => {
    fetch(`http://localhost:4000/api/product/stockStatus`)
      .then((response) => response.json())
      .then((data) => {
        setStockStatus({
          labels: ["Out of Stock", "Low Stock", "In Stock"],
          datasets: [
            {
              data: [data.outOfStock, data.lowStock, data.inStock],
              backgroundColor: ["#FF6384", "#FFCE56", "#36A2EB"],
              hoverBackgroundColor: ["#FF6384", "#FFCE56", "#36A2EB"],
            },
          ],
        });
      })
      .catch((err) => console.error("Failed to fetch stock status:", err));
  };

  const fetchSpentLast12Months = () => {
    fetch(`http://localhost:4000/api/purchase/spentLast12Months`)
      .then((response) => response.json())
      .then((data) => setSpentLast12Months(Math.round(data.totalSpent)))
      .catch((err) => console.error("Failed to fetch spent last 12 months:", err));
  };

  const fetchPurchasesLast12Months = () => {
    fetch(`http://localhost:4000/api/purchase/purchasesLast12Months`)
      .then((response) => response.json())
      .then((data) => {
        const purchasesData = mapDataToLast12Months(data.purchasesByMonth);
        setPurchasesLast12Bar({
          labels: getLast12Months(),
          datasets: [
            {
              label: "Purchases",
              data: purchasesData,
              backgroundColor: "#f59e0b",
              borderRadius: 6,
              maxBarThickness: 40,
            },
          ],
        });
      })
      .catch((err) => console.error("Failed to fetch purchases last 12 months:", err));
  };

  const fetchEarnedLast12Months = () => {
    fetch(`http://localhost:4000/api/sales/get/earnedlast12months`)
      .then((response) => response.json())
      .then((data) => setEarnedLast12Months(Math.round(data.totalEarned)))
      .catch((err) => console.error("Failed to fetch earned last 12 months:", err));
  };

  const fetchSalesLast12Months = () => {
    fetch(`http://localhost:4000/api/sales/get/saleslast12months`)
      .then((response) => response.json())
      .then((data) => {
        const salesData = mapDataToLast12Months(data.salesByMonth);
        setSalesLast12Bar({
          labels: getLast12Months(),
          datasets: [
            {
              label: "Sales",
              data: salesData.map((val) => Math.round(val)),
              backgroundColor: "#6366f1",
              borderRadius: 6,
              maxBarThickness: 40,
            },
          ],
        });
      })
      .catch((err) => console.error("Failed to fetch sales last 12 months:", err));
  };

  const fetchTopProductsBySalesData = () => {
    fetch(`http://localhost:4000/api/sales/get/topproductsbysales`)
      .then((response) => response.json())
      .then((data) => {
        setTopProductsBySalesBar({
          labels: data.map((item) => item.name),
          datasets: [
            {
              label: "Sales",
              data: data.map((item) => item.totalSold),
              backgroundColor: "#3b82f6",
              borderRadius: 6,
              maxBarThickness: 36,
            },
          ],
        });
      })
      .catch((err) => console.error("Failed to fetch top products by sales:", err));
  };

  function mapDataToLast12Months(data) {
    const mappedData = new Array(12).fill(0);
    data.forEach((item, index) => {
      mappedData[11 - index] = item;
    });
    return mappedData;
  }

  useEffect(() => {
    setProfitLast12Months(Math.round(earnedLast12Months - spentLast12Months));
  }, [earnedLast12Months, spentLast12Months]);

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value || 0);

  const summaryCards = [
    { title: "Spent Last 12 Months", value: formatCurrency(spentLast12Months), tone: "text-warning" },
    { title: "Earned Last 12 Months", value: formatCurrency(earnedLast12Months), tone: "text-success" },
    {
      title: "Profit Last 12 Months",
      value: formatCurrency(profitLast12Months),
      tone: profitLast12Months >= 0 ? "text-primary" : "text-error",
    },
  ];

  const chartHeightClass = "h-[320px] w-full min-h-[260px]";

  const topStockHorizontalOptions = useMemo(
    () => ({
      ...horizontalBarOptions,
      plugins: {
        ...horizontalBarOptions.plugins,
        tooltip: {
          ...horizontalBarOptions.plugins.tooltip,
          callbacks: {
            label: (ctx) => ` ${ctx.dataset.label}: ${Number(ctx.raw).toLocaleString()}`,
          },
        },
      },
    }),
    []
  );

  const topSalesHorizontalOptions = useMemo(
    () => ({
      ...horizontalBarOptions,
      plugins: {
        ...horizontalBarOptions.plugins,
        tooltip: {
          ...horizontalBarOptions.plugins.tooltip,
          callbacks: {
            label: (ctx) => ` ${ctx.dataset.label}: ${Number(ctx.raw).toLocaleString()} units`,
          },
        },
      },
    }),
    []
  );

  return (
    <div className="col-span-10 min-h-screen bg-base-200/40 p-4 md:p-6 font-['Inter','Segoe_UI','Roboto',sans-serif]">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-base-content">Statistics</h1>
          <p className="mt-1 text-sm text-base-content/60">
            Analytics overview for inventory, sales, purchases, and stock health.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-sm btn-outline border-base-300 transition-colors duration-200 hover:bg-base-200"
          onClick={() => {
            fetchTopProductsByStockData();
            fetchStockStatusData();
            fetchSpentLast12Months();
            fetchPurchasesLast12Months();
            fetchEarnedLast12Months();
            fetchSalesLast12Months();
            fetchTopProductsBySalesData();
          }}
        >
          Refresh Analytics
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {summaryCards.map((card) => (
          <div key={card.title} className="rounded-xl border border-base-300 bg-base-100 p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-base-content/50">{card.title}</p>
            <p className={`mt-3 text-3xl font-bold ${card.tone}`}>{card.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="rounded-xl border border-base-300 bg-base-100 p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-base-content">Top 5 Products by Stock</h2>
          <p className="mb-4 text-sm text-base-content/60">Highest available quantities by product</p>
          <div className={chartHeightClass}>
            <Bar data={topProductsByStockBar} options={topStockHorizontalOptions} />
          </div>
        </div>

        <div className="rounded-xl border border-base-300 bg-base-100 p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-base-content">Stock Status</h2>
          <p className="mb-4 text-sm text-base-content/60">Distribution of product stock levels</p>
          <div className="mx-auto flex w-[85%] min-w-[13.5rem] max-w-[20.5rem] justify-center">
            <div className="aspect-square w-full">
              <Doughnut
                data={stockStatus}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "bottom",
                      labels: { boxWidth: 10, usePointStyle: true },
                    },
                  },
                  cutout: "62%",
                }}
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-base-300 bg-base-100 p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-base-content">Top 5 Products by Sales</h2>
          <p className="mb-4 text-sm text-base-content/60">Best-selling items by units sold</p>
          <div className={chartHeightClass}>
            <Bar data={topProductsBySalesBar} options={topSalesHorizontalOptions} />
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-base-300 bg-base-100 p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-base-content">Sales Last 12 Months</h2>
          <p className="mb-4 text-sm text-base-content/60">Monthly sales trend for the last year</p>
          <div className={chartHeightClass}>
            <Bar data={salesLast12Bar} options={verticalBarOptions} />
          </div>
        </div>

        <div className="rounded-xl border border-base-300 bg-base-100 p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-base-content">Purchases Last 12 Months</h2>
          <p className="mb-4 text-sm text-base-content/60">Monthly purchasing spend and volume trend</p>
          <div className={chartHeightClass}>
            <Bar data={purchasesLast12Bar} options={verticalBarOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Statistics;
