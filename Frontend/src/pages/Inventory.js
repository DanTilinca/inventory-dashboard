import React, { useState, useEffect, useContext } from "react";
import AddProduct from "../components/AddProduct";
import UpdateProduct from "../components/UpdateProduct";
import AuthContext from "../AuthContext";

const categories = ["All", "Electronics", "Groceries", "Healthcare", "Others"];

function Inventory() {
  const [showProductModal, setShowProductModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateProduct, setUpdateProduct] = useState([]);
  const [products, setAllProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [updatePage, setUpdatePage] = useState(true);
  const [stores, setAllStores] = useState([]);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [outOfStockCount, setOutOfStockCount] = useState(0);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "ascending" });

  const authContext = useContext(AuthContext);

  useEffect(() => {
    fetchProductsData();
    fetchSalesData();
  }, [updatePage, selectedCategory, searchTerm, sortConfig]);

  // Fetching Data of All Products
  const fetchProductsData = () => {
    fetch(`http://localhost:4000/api/product/get`)
      .then((response) => response.json())
      .then((data) => {
        // Apply category filter
        let filteredData = data;
        if (selectedCategory !== "All") {
          filteredData = data.filter(product => product.category === selectedCategory);
        }

        // Apply search filter
        if (searchTerm) {
          filteredData = filteredData.filter(product => product.name.toLowerCase().includes(searchTerm.toLowerCase()));
        }

        // Apply sorting
        if (sortConfig.key) {
          filteredData = filteredData.sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) {
              return sortConfig.direction === "ascending" ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
              return sortConfig.direction === "ascending" ? 1 : -1;
            }
            return 0;
          });
        }

        setAllProducts(filteredData);

        // Calculate low and out of stock counts
        let lowStock = 0;
        let outOfStock = 0;
        filteredData.forEach(product => {
          if (product.stock > 0 && product.stock <= 50) {
            lowStock++;
          } else if (product.stock === 0) {
            outOfStock++;
          }
        });
        setLowStockCount(lowStock);
        setOutOfStockCount(outOfStock);
      })
      .catch((err) => console.log(err));
  };

  // Fetching all stores data
  const fetchSalesData = () => {
    fetch(`http://localhost:4000/api/store/get`)
      .then((response) => response.json())
      .then((data) => {
        setAllStores(data);
      });
  };

  // Modal for Product ADD
  const addProductModalSetting = () => {
    setShowProductModal(!showProductModal);
  };

  // Modal for Product UPDATE
  const updateProductModalSetting = (selectedProductData) => {
    setUpdateProduct(selectedProductData);
    setShowUpdateModal(!showUpdateModal);
  };

  // Delete item
  const deleteItem = (id) => {
    fetch(`http://localhost:4000/api/product/delete/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setUpdatePage(!updatePage);
      });
  };

  // Handle Page Update
  const handlePageUpdate = () => {
    setUpdatePage(!updatePage);
  };

  // Handle Search Term
  const handleSearchTerm = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle Category Change
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
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
      <div className=" flex flex-col gap-5 w-11/12">
        <div className="bg-white rounded p-3">
          <span className="font-semibold px-4">Overall Inventory</span>
          <div className=" flex flex-col md:flex-row justify-center items-center  ">
            <div className="flex flex-col p-10  w-full  md:w-3/12  ">
              <span className="font-semibold text-blue-600 text-base">
                Total Products
              </span>
              <span className="font-semibold text-gray-600 text-lg">
                {products.length}
              </span>
            </div>
            <div className="flex flex-col p-10  w-full  md:w-3/12  ">
              <span className="font-semibold text-orange-400 text-base">
                Active Stores
              </span>
              <span className="font-semibold text-gray-600 text-lg">
                {stores.length}
              </span>
            </div>
            <div className="flex flex-col gap-3 p-10  w-full  md:w-3/12  sm:border-y-2 md:border-x-2 md:border-y-0">
              <span className="font-semibold text-purple-600 text-base">
                Total Categories
              </span>
              <div className="flex gap-8">
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-600 text-base">
                    4
                  </span>
                  <span className="font-thin text-gray-400 text-xs">
                    Last 7 days
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3 p-10  w-full  md:w-3/12  border-y-2  md:border-x-2 md:border-y-0">
              <span className="font-semibold text-red-600 text-base">
                Stocks Status
              </span>
              <div className="flex gap-8">
                <div className="flex flex-col">
                  <span class='font-semibold text-gray-600 text-base'>
                    {lowStockCount}
                  </span>
                  <span className='font-thin text-gray-400 text-xs'>
                    Low Stock
                  </span>
                </div>
                <div className='flex flex-col'>
                  <span className='font-semibold text-gray-600 text-base'>
                    {outOfStockCount}
                  </span>
                  <span className='font-thin text-gray-400 text-xs'>
                    Out of Stock
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {showProductModal && (
          <AddProduct
            addProductModalSetting={addProductModalSetting}
            handlePageUpdate={handlePageUpdate}
          />
        )}
        {showUpdateModal && (
          <UpdateProduct
            updateProductData={updateProduct}
            updateModalSetting={updateProductModalSetting}
          />
        )}

        {/* Table  */}
        <div className="overflow-x-auto rounded-lg border bg-white border-gray-200 ">
          <div className="flex justify-between pt-5 pb-3 px-3">
            <div className="flex gap-4 justify-center items-center">
              <span className="font-bold">Products</span>
              <div className="flex justify-center items-center px-2 border-2 rounded-md ">
                <img
                  alt="search-icon"
                  className="w-5 h-5"
                  src={require("../assets/search-icon.png")}
                />
                <input
                  className="border-none outline-none focus:border-none text-xs"
                  type="text"
                  placeholder="Search here"
                  value={searchTerm}
                  onChange={handleSearchTerm}
                />
              </div>
              <select
                className="border-2 rounded-md text-xs px-2 w-auto"
                value={selectedCategory}
                onChange={handleCategoryChange}
              >
                {categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-4">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 text-xs  rounded"
                onClick={addProductModalSetting}
              >
                Add Product
              </button>
            </div>
          </div>
          <table className="min-w-full divide-y-2 divide-gray-200 text-sm">
            <thead>
              <tr>
                <th
                  className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900 cursor-pointer"
                  onClick={() => handleSort("category")}
                >
                  Category
                  {sortConfig.key === "category" && (sortConfig.direction === "ascending" ? " ▲" : " ▼")}
                </th>
                <th
                  className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900 cursor-pointer"
                  onClick={() => handleSort("name")}
                >
                  Product Name
                  {sortConfig.key === "name" && (sortConfig.direction === "ascending" ? " ▲" : " ▼")}
                </th>
                <th
                  className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900 cursor-pointer"
                  onClick={() => handleSort("stock")}
                >
                  Stock
                  {sortConfig.key === "stock" && (sortConfig.direction === "ascending" ? " ▲" : " ▼")}
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Description
                </th>
                <th
                  className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900 cursor-pointer"
                  onClick={() => handleSort("availability")}
                >
                  Availability
                  {sortConfig.key === "availability" && (sortConfig.direction === "ascending" ? " ▲" : " ▼")}
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Options
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {products.map((element) => {
                let stockStatus = "";
                let stockClass = "";

                if (element.stock === 0) {
                  stockStatus = "Out of Stock";
                  stockClass = "text-red-500";
                } else if (element.stock <= 50) {
                  stockStatus = "Low Stock";
                  stockClass = "text-yellow-500";
                } else {
                  stockStatus = "In Stock";
                  stockClass = "text-green-500";
                }

                return (
                  <tr key={element._id}>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-900">
                      {element.category}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2  text-gray-900">
                      {element.name}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {element.stock}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {element.description}
                    </td>
                    <td className={`whitespace-nowrap px-4 py-2 font-semibold ${stockClass}`}>
                      {stockStatus}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      <button
                        className="bg-green-700 text-white px-2 py-1 cursor-pointer rounded-lg font-semibold"
                        onClick={() => updateProductModalSetting(element)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-600 text-white px-2 py-1 ml-2 cursor-pointer rounded-lg font-semibold"
                        onClick={() => deleteItem(element._id)}
                      >
                        Delete
                      </button>
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

export default Inventory;
