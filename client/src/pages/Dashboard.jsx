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

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const CATEGORY_COLORS = ["#60a5fa", "#34d399", "#fbbf24", "#f87171", "#a78bfa", "#22d3ee", "#fb7185", "#4ade80"];
const LOW_STOCK_MAX = 50;

function Dashboard() {
  const [saleAmount, setSaleAmount] = useState(0);
  const [purchaseAmount, setPurchaseAmount] = useState(0);
  const [salesCount, setSalesCount] = useState(0);
  const [purchaseCount, setPurchaseCount] = useState(0);
  const [stores, setStores] = useState([]);
  const [products, setProducts] = useState([]);
  const [categoriesData, setCategoriesData] = useState({ labels: [], data: [] });

  const getLast12Months = () => {
    const currentMonth = new Date().getMonth();
    const last12Months = [];

    for (let i = 0; i < 12; i += 1) {
      last12Months.unshift(MONTH_LABELS[(currentMonth - i + 12) % 12]);
    }

    return last12Months;
  };

  const [revenueBarData, setRevenueBarData] = useState(() => ({
    labels: getLast12Months(),
    datasets: [
      {
        label: "Monthly Sales Amount",
        data: new Array(12).fill(0),
        backgroundColor: "#3b82f6",
        borderRadius: 6,
        maxBarThickness: 48,
      },
    ],
  }));

  const revenueBarOptions = useMemo(
    () => ({
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
          ticks: { color: "#6b7280", callback: (value) => Math.round(Number(value)) },
        },
      },
    }),
    []
  );

  const updateChartData = (salesData) => {
    setRevenueBarData((prev) => ({
      ...prev,
      labels: getLast12Months(),
      datasets: [
        {
          ...prev.datasets[0],
          data: (salesData || []).map((value) => Math.round(value)),
        },
      ],
    }));
  };

  const updateDoughnutData = (items) => {
    const categoryCount = {};
    items.forEach((product) => {
      const category = product.category || "Uncategorized";
      categoryCount[category] = (categoryCount[category] || 0) + 1;
    });

    setCategoriesData({
      labels: Object.keys(categoryCount),
      data: Object.values(categoryCount),
    });
  };

  useEffect(() => {
    fetchTotalSaleAmountLast30Days();
    fetchTotalPurchaseAmountLast30Days();
    fetchSalesCountLast30Days();
    fetchPurchaseCountLast30Days();
    fetchStoresData();
    fetchProductsData();
    fetchMonthlySalesData();
  }, []);

  const fetchTotalSaleAmountLast30Days = () => {
    fetch(`http://localhost:4000/api/sales/get/totalsaleamountlast30days`)
      .then((response) => response.json())
      .then((data) => setSaleAmount(Math.round(data.totalSaleAmount || 0)));
  };

  const fetchTotalPurchaseAmountLast30Days = () => {
    fetch(`http://localhost:4000/api/purchase/get/totalpurchaseamountlast30days`)
      .then((response) => response.json())
      .then((data) => setPurchaseAmount(Math.round(data.totalPurchaseAmount || 0)));
  };

  const fetchSalesCountLast30Days = () => {
    fetch(`http://localhost:4000/api/sales/get/salescountlast30days`)
      .then((response) => response.json())
      .then((data) => setSalesCount(Math.round(data.salesCount || 0)));
  };

  const fetchPurchaseCountLast30Days = () => {
    fetch(`http://localhost:4000/api/purchase/get/purchasecountlast30days`)
      .then((response) => response.json())
      .then((data) => setPurchaseCount(Math.round(data.purchaseCount || 0)));
  };

  const fetchStoresData = () => {
    fetch(`http://localhost:4000/api/store/get`)
      .then((response) => response.json())
      .then((data) => setStores(data || []));
  };

  const fetchProductsData = () => {
    fetch(`http://localhost:4000/api/product/get`)
      .then((response) => response.json())
      .then((data) => {
        setProducts(data || []);
        updateDoughnutData(data || []);
      })
      .catch((error) => console.log(error));
  };

  const fetchMonthlySalesData = () => {
    fetch(`http://localhost:4000/api/sales/getmonthly`)
      .then((response) => response.json())
      .then((data) => updateChartData(data.salesAmount))
      .catch((error) => console.log(error));
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount || 0);

  const stockSummary = useMemo(() => {
    return products.reduce(
      (summary, product) => {
        const stock = Number(product.stock || 0);
        if (stock <= 0) summary.outOfStock += 1;
        else if (stock <= LOW_STOCK_MAX) summary.low += 1;
        else summary.optimal += 1;
        return summary;
      },
      { optimal: 0, low: 0, outOfStock: 0 }
    );
  }, [products]);

  const topStockProducts = useMemo(() => {
    return [...products].sort((a, b) => (b.stock || 0) - (a.stock || 0)).slice(0, 6);
  }, [products]);

  const kpiCards = [
    {
      title: "Sales Revenue",
      value: formatCurrency(saleAmount),
      meta: `${salesCount} transactions in the last 30 days`,
    },
    {
      title: "Purchase Spend",
      value: formatCurrency(purchaseAmount),
      meta: `${purchaseCount} purchases in the last 30 days`,
    },
    {
      title: "Inventory SKUs",
      value: products.length.toLocaleString(),
      meta: "Products actively tracked",
    },
    {
      title: "Store Locations",
      value: stores.length.toLocaleString(),
      meta: "Total operational branches",
    },
  ];

  return (
    <div className="col-span-10 min-h-screen bg-base-200/40 p-4 md:p-6 font-['Inter','Segoe_UI','Roboto',sans-serif]">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-base-content">Retail Operations Dashboard</h1>
          <p className="mt-1 text-sm text-base-content/60">
            Real-time inventory, purchasing, and sales performance at a glance.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-sm btn-outline border-base-300 transition-colors duration-200 hover:bg-base-200"
          onClick={fetchMonthlySalesData}
        >
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpiCards.map((card) => (
          <div key={card.title} className="rounded-xl border border-base-300 bg-base-100 p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-base-content/50">{card.title}</p>
            <p className="mt-3 text-3xl font-bold text-base-content">{card.value}</p>
            <p className="mt-2 text-sm text-base-content/60">{card.meta}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="rounded-xl border border-base-300 bg-base-100 p-5 shadow-sm xl:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-base-content">Revenue Trend</h2>
              <p className="text-sm text-base-content/60">Monthly sales amount across the last 12 months</p>
            </div>
            <span className="badge badge-outline border-base-300 text-base-content/70">Last 12 months</span>
          </div>
          <div className="h-[360px] w-full min-h-[280px]">
            <Bar data={revenueBarData} options={revenueBarOptions} />
          </div>
        </div>

        <div className="rounded-xl border border-base-300 bg-base-100 p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-base-content">Products by Category</h2>
          <p className="mb-4 text-sm text-base-content/60">Distribution of active products</p>
          <div className="mx-auto flex w-[85%] min-w-[13.5rem] max-w-[22rem] justify-center">
            <div className="aspect-square w-full">
              <Doughnut
                data={{
                  labels: categoriesData.labels,
                  datasets: [
                    {
                      label: "Number of Products",
                      data: categoriesData.data,
                      backgroundColor: CATEGORY_COLORS,
                      borderColor: "#ffffff",
                      borderWidth: 2,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "bottom",
                      labels: { boxWidth: 10, usePointStyle: true },
                    },
                  },
                  cutout: "64%",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="rounded-xl border border-base-300 bg-base-100 p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-base-content">Stock Health</h2>
          <p className="mt-1 text-sm text-base-content/60">Out, low, and healthy inventory split</p>
          <div className="mt-5 flex flex-col gap-3">
            <div className="grid grid-cols-1 items-center gap-3 rounded-lg border border-base-200 bg-base-100 p-4 sm:grid-cols-[minmax(0,1fr)_6.75rem_4rem] sm:gap-x-4">
              <div className="min-w-0 sm:col-start-1">
                <p className="text-sm font-semibold text-base-content">Optimal</p>
                <p className="mt-0.5 text-xs text-base-content/55">{LOW_STOCK_MAX + 1}+ units</p>
              </div>
              <div className="flex justify-start sm:col-start-2 sm:justify-center">
                <span className="badge badge-success badge-outline inline-flex min-w-[6.75rem] items-center justify-center whitespace-nowrap">
                  Healthy
                </span>
              </div>
              <div className="flex justify-start sm:col-start-3 sm:justify-end">
                <span className="w-full text-right text-2xl font-bold tabular-nums text-success sm:w-auto">
                  {stockSummary.optimal}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 items-center gap-3 rounded-lg border border-base-200 bg-base-100 p-4 sm:grid-cols-[minmax(0,1fr)_6.75rem_4rem] sm:gap-x-4">
              <div className="min-w-0 sm:col-start-1">
                <p className="text-sm font-semibold text-base-content">Low stock</p>
                <p className="mt-0.5 text-xs text-base-content/55">
                  {1}–{LOW_STOCK_MAX} units
                </p>
              </div>
              <div className="flex justify-start sm:col-start-2 sm:justify-center">
                <span className="badge badge-warning badge-outline inline-flex min-w-[6.75rem] items-center justify-center whitespace-nowrap">
                  Attention
                </span>
              </div>
              <div className="flex justify-start sm:col-start-3 sm:justify-end">
                <span className="w-full text-right text-2xl font-bold tabular-nums text-warning sm:w-auto">
                  {stockSummary.low}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 items-center gap-3 rounded-lg border border-base-200 bg-base-100 p-4 sm:grid-cols-[minmax(0,1fr)_6.75rem_4rem] sm:gap-x-4">
              <div className="min-w-0 sm:col-start-1">
                <p className="text-sm font-semibold text-base-content">Out of stock</p>
                <p className="mt-0.5 text-xs text-base-content/55">0 units</p>
              </div>
              <div className="flex justify-start sm:col-start-2 sm:justify-center">
                <span className="badge badge-error badge-outline inline-flex min-w-[6.75rem] items-center justify-center whitespace-nowrap">
                  Urgent
                </span>
              </div>
              <div className="flex justify-start sm:col-start-3 sm:justify-end">
                <span className="w-full text-right text-2xl font-bold tabular-nums text-error sm:w-auto">
                  {stockSummary.outOfStock}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-base-300 bg-base-100 p-5 shadow-sm xl:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-base-content">Top Products by Stock</h2>
              <p className="text-sm text-base-content/60">Quick scan of highest available inventory</p>
            </div>
            <span className="badge badge-neutral badge-outline">Live Inventory</span>
          </div>
          <div className="overflow-x-auto rounded-lg border border-base-200">
            <table className="table">
              <thead className="bg-base-200/70 text-base-content/70">
                <tr>
                  <th className="font-semibold">Product</th>
                  <th className="font-semibold">Category</th>
                  <th className="text-right font-semibold">Stock</th>
                  <th className="text-right font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {topStockProducts.map((product) => {
                  const stock = Number(product.stock || 0);
                  const statusClass =
                    stock <= 0 ? "badge-error" : stock <= LOW_STOCK_MAX ? "badge-warning" : "badge-success";
                  const statusLabel =
                    stock <= 0 ? "Out of stock" : stock <= LOW_STOCK_MAX ? "Low stock" : "Optimal";

                  return (
                    <tr key={product._id || `${product.name}-${stock}`} className="transition-colors duration-200 hover:bg-base-200">
                      <td className="font-medium text-base-content">{product.name || "Unnamed Product"}</td>
                      <td className="text-base-content/70">{product.category || "Uncategorized"}</td>
                      <td className="text-right font-semibold tabular-nums">{stock.toLocaleString()}</td>
                      <td className="text-right">
                        <span className={`badge ${statusClass} badge-outline`}>{statusLabel}</span>
                      </td>
                    </tr>
                  );
                })}
                {topStockProducts.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-base-content/50">
                      No inventory data available yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
