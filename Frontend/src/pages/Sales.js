import React, { useState, useEffect, useContext } from "react";
import AddSale from "../components/AddSale";
import AuthContext from "../AuthContext";

function Sales() {
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [sales, setAllSalesData] = useState([]);
  const [products, setAllProducts] = useState([]);
  const [stores, setAllStores] = useState([]);
  const [updatePage, setUpdatePage] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "ascending" });

  const authContext = useContext(AuthContext);

  useEffect(() => {
    fetchSalesData();
    fetchProductsData();
    fetchStoresData();
  }, [updatePage, sortConfig]);

  // Fetching Data of All Sales
  const fetchSalesData = () => {
    fetch(`http://localhost:4000/api/sales/get`)
      .then((response) => response.json())
      .then((data) => {
        // Apply sorting
        if (sortConfig.key) {
          data = data.sort((a, b) => {
            const aValue = getElementValue(a, sortConfig.key);
            const bValue = getElementValue(b, sortConfig.key);
            if (aValue < bValue) {
              return sortConfig.direction === "ascending" ? -1 : 1;
            }
            if (aValue > bValue) {
              return sortConfig.direction === "ascending" ? 1 : -1;
            }
            return 0;
          });
        }
        setAllSalesData(data);
      })
      .catch((err) => console.log(err));
  };

  // Helper function to retrieve the nested value
  const getElementValue = (element, key) => {
    return key.split('.').reduce((obj, keyPart) => obj && obj[keyPart], element);
  };

  // Fetching Data of All Products
  const fetchProductsData = () => {
    fetch(`http://localhost:4000/api/product/get`)
      .then((response) => response.json())
      .then((data) => {
        setAllProducts(data);
      })
      .catch((err) => console.log(err));
  };

  // Fetching Data of All Stores
  const fetchStoresData = () => {
    fetch(`http://localhost:4000/api/store/get`)
      .then((response) => response.json())
      .then((data) => {
        setAllStores(data);
      });
  };

  // Modal for Sale Add
  const addSaleModalSetting = () => {
    setShowSaleModal(!showSaleModal);
  };

  // Handle Page Update
  const handlePageUpdate = () => {
    setUpdatePage(!updatePage);
  };

  // Handle Sort
  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="col-span-12 lg:col-span-10  flex justify-center">
      <div className="flex flex-col gap-5 w-11/12">
        {showSaleModal && (
          <AddSale
            addSaleModalSetting={addSaleModalSetting}
            products={products}
            stores={stores}
            handlePageUpdate={handlePageUpdate}
            authContext={authContext}
          />
        )}
        {/* Table */}
        <div className="overflow-x-auto rounded-lg border bg-white border-gray-200">
          <div className="flex justify-between pt-5 pb-3 px-3">
            <div className="flex gap-4 justify-center items-center">
              <span className="font-bold">Sales</span>
            </div>
            <div className="flex gap-4">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 text-xs rounded"
                onClick={addSaleModalSetting}
              >
                Add Sales
              </button>
            </div>
          </div>
          <table className="min-w-full divide-y-2 divide-gray-200 text-sm">
            <thead>
              <tr>
                <th
                  className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900 cursor-pointer"
                  onClick={() => handleSort("ProductID.name")}
                >
                  Product Name
                  {sortConfig.key === "ProductID.name" &&
                    (sortConfig.direction === "ascending" ? " ▲" : " ▼")}
                </th>
                <th
                  className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900 cursor-pointer"
                  onClick={() => handleSort("StoreID.name")}
                >
                  Store Name
                  {sortConfig.key === "StoreID.name" &&
                    (sortConfig.direction === "ascending" ? " ▲" : " ▼")}
                </th>
                <th
                  className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900 cursor-pointer"
                  onClick={() => handleSort("StockSold")}
                >
                  Stock Sold
                  {sortConfig.key === "StockSold" &&
                    (sortConfig.direction === "ascending" ? " ▲" : " ▼")}
                </th>
                <th
                  className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900 cursor-pointer"
                  onClick={() => handleSort("SaleDate")}
                >
                  Sales Date
                  {sortConfig.key === "SaleDate" &&
                    (sortConfig.direction === "ascending" ? " ▲" : " ▼")}
                </th>
                <th
                  className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900 cursor-pointer"
                  onClick={() => handleSort("TotalSaleAmount")}
                >
                  Total Sale Amount
                  {sortConfig.key === "TotalSaleAmount" &&
                    (sortConfig.direction === "ascending" ? " ▲" : " ▼")}
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {sales.map((element) => {
                return (
                  <tr key={element._id}>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-900">
                      {element.ProductID?.name}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {element.StoreID?.name}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {element.StockSold}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {element.SaleDate}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      ${element.TotalSaleAmount}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Sales;