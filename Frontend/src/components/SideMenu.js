import React from "react";
import { Link } from "react-router-dom";

function SideMenu() {
  const localStorageData = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="h-full flex flex-col justify-between bg-gray-50 text-gray-700 hidden lg:flex">
      <div className="px-6 py-8">
        <nav aria-label="Main Nav" className="mt-6 flex flex-col space-y-2">
          <Link
            to="/"
            className="flex items-center gap-3 rounded-lg hover:bg-blue-100 px-4 py-3 text-blue-700 hover:text-blue-800 transition duration-150 ease-in-out"
          >
            <img
              alt="dashboard-icon"
              className="h-6 w-6"
              src={require("../assets/dashboard-icon.png")}
            />
            <span className="text-base font-semibold">Dashboard</span>
          </Link>

          <details className="group [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer items-center justify-between rounded-lg px-4 py-3 text-gray-600 hover:bg-blue-100 hover:text-blue-800 transition duration-150 ease-in-out">
              <Link to="/inventory" className="flex items-center gap-3">
                <img
                  alt="inventory-icon"
                  className="h-6 w-6"
                  src={require("../assets/inventory-icon.png")}
                />
                <span className="text-base font-semibold">Inventory</span>
              </Link>
            </summary>
          </details>

          <Link
            to="/purchase-details"
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-gray-600 hover:bg-blue-100 hover:text-blue-800 transition duration-150 ease-in-out"
          >
            <img
              alt="purchase-icon"
              className="h-6 w-6"
              src={require("../assets/supplier-icon.png")}
            />
            <span className="text-base font-semibold">Purchase Details</span>
          </Link>

          <Link
            to="/sales"
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-gray-600 hover:bg-blue-100 hover:text-blue-800 transition duration-150 ease-in-out"
          >
            <img
              alt="sale-icon"
              className="h-6 w-6"
              src={require("../assets/supplier-icon.png")}
            />
            <span className="text-base font-semibold">Sales</span>
          </Link>

          <details className="group [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer items-center justify-between rounded-lg px-4 py-3 text-gray-600 hover:bg-blue-100 hover:text-blue-800 transition duration-150 ease-in-out">
              <Link to="/manage-store" className="flex items-center gap-3">
                <img
                  alt="store-icon"
                  className="h-6 w-6"
                  src={require("../assets/order-icon.png")} // Assume you've a specific icon for manage store
                />
                <span className="text-base font-semibold">Manage Store</span>
              </Link>
            </summary>
          </details>
        </nav>
      </div>
    </div>
  );
}

export default SideMenu;
