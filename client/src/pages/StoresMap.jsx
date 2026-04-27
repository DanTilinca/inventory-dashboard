import React, { useState } from "react";
import StoreDetails from "../components/StoreDetails";
import StoresMapLeaflet from "../components/StoresMapLeaflet";

const StoresMap = () => {
  const [selectedStore, setSelectedStore] = useState(null);

  return (
    <div className="col-span-12 lg:col-span-10 min-h-screen bg-base-200/40 p-4 md:p-6 font-['Inter','Segoe_UI','Roboto',sans-serif]">
      <div className="w-full">
        <div className="rounded-xl border border-base-300 bg-base-100 p-5 shadow-sm">
          <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-3xl font-bold text-base-content">Stores map</h1>
            </div>
          </div>

          <StoresMapLeaflet
            onSelectStore={setSelectedStore}
            subheading="Click a marker to open details, directions, or the full store profile."
          />
        </div>
      </div>

      {selectedStore && (
        <StoreDetails isOpen={true} store={selectedStore} onClose={() => setSelectedStore(null)} />
      )}
    </div>
  );
};

export default StoresMap;
