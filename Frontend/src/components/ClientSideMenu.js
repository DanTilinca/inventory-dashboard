import React from "react";
import { Link } from "react-router-dom";

import SearchIcon from '@mui/icons-material/Search';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import MapIcon from '@mui/icons-material/Map';

function ClientSideMenu() {
  const localStorageData = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="fixed top-0 left-0 h-full bg-gray-50 text-gray-700 w-1/6 flex flex-col justify-between lg:block z-50">
      <div className="px-4 py-6">
        <nav aria-label="Main Nav" className="mt-4 flex flex-col space-y-2">
          <Link
            to="/"
            className="flex items-center gap-2 rounded-lg hover:bg-blue-100 px-3 py-2 text-gray-600 hover:text-blue-800 transition duration-150 ease-in-out"
          >
            <SearchIcon />
            <span className="text-lg font-semibold">Search Product</span>
          </Link>

          <Link
            to="/money-spent"
            className="flex items-center gap-2 rounded-lg hover:bg-blue-100 px-3 py-2 text-gray-600 hover:text-blue-800 transition duration-150 ease-in-out"
          >
            <AttachMoneyIcon />
            <span className="text-lg font-semibold">Money Spent</span>
          </Link>

          <Link
            to="/client/map"
            className="flex items-center gap-2 rounded-lg hover:bg-blue-100 px-3 py-2 text-gray-600 hover:text-blue-800 transition duration-150 ease-in-out"
          >
            <MapIcon />
            <span className="text-lg font-semibold">Map</span>
          </Link>
        </nav>
      </div>
    </div>
  );
}

export default ClientSideMenu;
