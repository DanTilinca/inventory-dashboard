import React, { useState, useEffect } from "react";
import AddStore from "../components/AddStore";
import StoreDetails from "../components/StoreDetails";
import locationIcon from "../assets/location-icon.png";

function Store() {
  const [showModal, setShowModal] = useState(false);
  const [stores, setAllStores] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  // Fetching all stores data
  const fetchData = () => {
    fetch(`http://localhost:4000/api/store/get`)
      .then((response) => response.json())
      .then((data) => {
        setAllStores(data);
        setFilteredStores(data);
      });
  };

  const modalSetting = () => {
    setShowModal(!showModal);
  };

  const showDetailsModal = (store) => {
    setSelectedStore(store);
  };

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = stores.filter(
      (store) =>
        store.name.toLowerCase().includes(value) ||
        store.city.toLowerCase().includes(value)
    );
    setFilteredStores(filtered);
  };

  return (
    <div className="col-span-12 lg:col-span-10 min-h-screen bg-base-200/40 p-4 md:p-6 font-['Inter','Segoe_UI','Roboto',sans-serif]">
      <div className="rounded-xl border border-base-300 bg-base-100 p-5 shadow-sm">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-base-content">Manage Stores</h1>
            <p className="mt-1 text-sm text-base-content/60">
              View, search, and manage all retail locations.
            </p>
          </div>
          <button
            className="btn btn-sm btn-primary transition-colors duration-200 hover:bg-opacity-90"
            onClick={modalSetting}
          >
            Add Store
          </button>
        </div>

        <div className="mb-6">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search by store name or city"
            className="input input-bordered input-sm w-full max-w-md border-base-300"
          />
        </div>

        {showModal && <AddStore />}
        {selectedStore && (
          <StoreDetails
            isOpen={true}
            store={selectedStore}
            onClose={() => setSelectedStore(null)}
          />
        )}

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {filteredStores.map((element) => (
            <div
              className="flex h-full flex-col gap-4 rounded-xl border border-base-300 bg-base-100 p-4 shadow-sm"
              key={element._id}
            >
              <div>
                <img
                  alt="store"
                  className="h-52 w-full rounded-lg border border-base-200 object-cover"
                  src={element.image}
                />
              </div>
              <div className="flex flex-col gap-3 justify-between items-start">
                <span className="text-lg font-bold text-base-content">{element.name}</span>
                <div className="flex w-full flex-wrap items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center">
                    <img
                      alt="location-icon"
                      className="h-5 w-5 flex-shrink-0"
                      src={locationIcon}
                    />
                    <span className="ml-2 truncate text-sm text-base-content/70">
                      {element.address + ", " + element.city}
                    </span>
                  </div>
                  <button
                    className="btn btn-sm btn-success text-white transition-colors duration-200 hover:bg-opacity-90"
                    onClick={() => showDetailsModal(element)}
                  >
                    More Details
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filteredStores.length === 0 && (
            <div className="col-span-full rounded-xl border border-base-300 bg-base-100 p-8 text-center text-base-content/60 shadow-sm">
              No stores match your search.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Store;
