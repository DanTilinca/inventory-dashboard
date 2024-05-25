import React, { useContext, useEffect, useState } from "react";
import Chart from "react-apexcharts";
import AuthContext from "../AuthContext";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

function Dashboard() {
  const [saleAmount, setSaleAmount] = useState("");
  const [purchaseAmount, setPurchaseAmount] = useState("");
  const [salesCount, setSalesCount] = useState(0);
  const [purchaseCount, setPurchaseCount] = useState(0);
  const [stores, setStores] = useState([]);
  const [products, setProducts] = useState([]);
  const [categoriesData, setCategoriesData] = useState({ labels: [], data: [] });

  const [chart, setChart] = useState({
    options: {
      chart: {
        id: "basic-bar",
      },
      xaxis: {
        categories: getLast12Months(), // Dynamic categories based on the current month
      },
    },
    series: [
      {
        name: "Monthly Sales Amount",
        data: [],
      },
    ],
  });

  // Function to get the last 12 months as an array of month names
  function getLast12Months() {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentMonth = new Date().getMonth();
    const last12Months = [];

    for (let i = 0; i < 12; i++) {
      last12Months.unshift(months[(currentMonth - i + 12) % 12]);
    }

    return last12Months;
  }

  // Update Chart Data
  const updateChartData = (salesData) => {
    setChart({
      ...chart,
      series: [
        {
          name: "Monthly Sales Amount",
          data: [...salesData],
        },
      ],
    });
  };

  // Update Doughnut Data
  const updateDoughnutData = (products) => {
    const categoryCount = {};

    products.forEach((product) => {
      categoryCount[product.category] = (categoryCount[product.category] || 0) + 1;
    });

    setCategoriesData({
      labels: Object.keys(categoryCount),
      data: Object.values(categoryCount),
    });
  };

  const authContext = useContext(AuthContext);

  useEffect(() => {
    fetchTotalSaleAmountLast30Days();
    fetchTotalPurchaseAmountLast30Days();
    fetchSalesCountLast30Days();
    fetchPurchaseCountLast30Days();
    fetchStoresData();
    fetchProductsData();
    fetchMonthlySalesData();
  }, []);

  // Fetching total sales amount in the last 30 days
  const fetchTotalSaleAmountLast30Days = () => {
    fetch(`http://localhost:4000/api/sales/get/totalsaleamountlast30days`)
      .then((response) => response.json())
      .then((datas) => setSaleAmount(datas.totalSaleAmount));
  };

  // Fetching total purchase amount in the last 30 days
  const fetchTotalPurchaseAmountLast30Days = () => {
    fetch(`http://localhost:4000/api/purchase/get/totalpurchaseamountlast30days`)
      .then((response) => response.json())
      .then((datas) => setPurchaseAmount(datas.totalPurchaseAmount));
  };

  // Fetching number of sales in the last 30 days
  const fetchSalesCountLast30Days = () => {
    fetch(`http://localhost:4000/api/sales/get/salescountlast30days`)
      .then((response) => response.json())
      .then((datas) => setSalesCount(datas.salesCount));
  };

  // Fetching number of purchases in the last 30 days
  const fetchPurchaseCountLast30Days = () => {
    fetch(`http://localhost:4000/api/purchase/get/purchasecountlast30days`)
      .then((response) => response.json())
      .then((datas) => setPurchaseCount(datas.purchaseCount));
  };

  // Fetching all stores data
  const fetchStoresData = () => {
    fetch(`http://localhost:4000/api/store/get`)
      .then((response) => response.json())
      .then((datas) => setStores(datas));
  };

  // Fetching Data of All Products
  const fetchProductsData = () => {
    fetch(`http://localhost:4000/api/product/get`)
      .then((response) => response.json())
      .then((datas) => {
        setProducts(datas);
        updateDoughnutData(datas);
      })
      .catch((err) => console.log(err));
  };

  // Fetching Monthly Sales
  const fetchMonthlySalesData = () => {
    fetch(`http://localhost:4000/api/sales/getmonthly`)
      .then((response) => response.json())
      .then((datas) => updateChartData(datas.salesAmount))
      .catch((err) => console.log(err));
  };

  return (
    <>
      <div className="grid grid-cols-1 col-span-12 lg:col-span-10 gap-6 md:grid-cols-3 lg:grid-cols-4 p-4">
        {/* Sales Section */}
        <article className="flex flex-col gap-4 rounded-lg border border-gray-100 bg-white p-6">
          <div>
            <strong className="block text-sm font-medium text-gray-500">
              Sales (Last 30 Days)
            </strong>
            <p>
              <span className="text-xl font-medium text-gray-900">
                Revenue: ${saleAmount}
              </span>
            </p>
            <p>
              <span className="text-xl font-medium text-gray-900">
                Count: {salesCount}
              </span>
            </p>
          </div>
        </article>

        {/* Purchases Section */}
        <article className="flex flex-col gap-4 rounded-lg border border-gray-100 bg-white p-6">
          <div>
            <strong className="block text-sm font-medium text-gray-500">
              Purchases (Last 30 Days)
            </strong>
            <p>
              <span className="text-xl font-medium text-gray-900">
                Amount: ${purchaseAmount}
              </span>
            </p>
            <p>
              <span className="text-xl font-medium text-gray-900">
                Count: {purchaseCount}
              </span>
            </p>
          </div>
        </article>

        <article className="flex flex-col gap-4 rounded-lg border border-gray-100 bg-white p-6">
          <div>
            <strong className="block text-sm font-medium text-gray-500">
              Products in Inventory
            </strong>
            <p>
              <span className="text-2xl font-medium text-gray-900">
                {products.length}
              </span>
            </p>
          </div>
        </article>

        <article className="flex flex-col gap-4 rounded-lg border border-gray-100 bg-white p-6">
          <div>
            <strong className="block text-sm font-medium text-gray-500">
              Total Stores
            </strong>
            <p>
              <span className="text-2xl font-medium text-gray-900">
                {stores.length}
              </span>
            </p>
          </div>
        </article>

        <div className="flex justify-around bg-white rounded-lg py-8 col-span-full justify-center">
          <div>
            <strong className="block text-sm font-medium text-gray-500 mb-2">
              Revenue per Month (Last 12 Months)
            </strong>
            <Chart
              options={chart.options}
              series={chart.series}
              type="bar"
              width="500"
            />
          </div>
          <div>
            <strong className="block text-sm font-medium text-gray-500 mb-2">
              Products by Category
            </strong>
            <Doughnut
              data={{
                labels: categoriesData.labels,
                datasets: [
                  {
                    label: "Number of Products",
                    data: categoriesData.data,
                    backgroundColor: [
                      "rgba(255, 99, 132, 0.2)",
                      "rgba(54, 162, 235, 0.2)",
                      "rgba(255, 206, 86, 0.2)",
                      "rgba(75, 192, 192, 0.2)",
                      "rgba(153, 102, 255, 0.2)",
                      "rgba(255, 159, 64, 0.2)",
                    ],
                    borderColor: [
                      "rgba(255, 99, 132, 1)",
                      "rgba(54, 162, 235, 1)",
                      "rgba(255, 206, 86, 1)",
                      "rgba(75, 192, 192, 1)",
                      "rgba(153, 102, 255, 1)",
                      "rgba(255, 159, 64, 1)",
                    ],
                    borderWidth: 1,
                  },
                ],
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
