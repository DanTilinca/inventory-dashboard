import React, { useState, useContext } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import AuthContext from "../AuthContext";
import CSVReader from "react-csv-reader";

export default function ImportProducts({ importProductModalSetting, handlePageUpdate }) {
  const [open, setOpen] = useState(true);
  const [csvData, setCsvData] = useState([]);
  const authContext = useContext(AuthContext);

  const closeModal = () => {
    setOpen(false);
    importProductModalSetting();
  };

  const handleFileLoad = (data) => {
    const headers = data[0];
    const formattedData = data.slice(1).map((row) => {
      const product = {};
      headers.forEach((header, index) => {
        product[header] = row[index];
      });
      product.userID = authContext.user;
      product.stock = Number(product.stock);
      return product;
    });
    setCsvData(formattedData);
  };

  const importProducts = () => {
    fetch("http://localhost:4000/api/product/import", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(csvData),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.error) {
          alert("Failed to import products");
        } else {
          alert("Products Imported Successfully");
          handlePageUpdate();
          closeModal();
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <Transition.Root show={open} as={React.Fragment}>
      <Dialog as="div" className="relative z-[60]" onClose={closeModal}>
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-base-content/40 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-[60] overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative w-full max-w-lg transform overflow-hidden rounded-xl border border-base-300 bg-base-100 text-left shadow-lg transition-all sm:my-8 font-['Inter','Segoe_UI','Roboto',sans-serif]">
                <div className="border-b border-base-200 px-5 py-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <ArrowUpTrayIcon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <Dialog.Title as="h3" className="text-lg font-semibold text-base-content">
                        Import products
                      </Dialog.Title>
                      <p className="mt-0.5 text-sm text-base-content/60">
                        Upload a CSV whose header row matches your product fields. Rows will be validated on the server.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="px-5 py-4">
                  <div className="rounded-lg border border-base-200 bg-base-200/30 p-4">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-base-content/50">
                      CSV file
                    </p>
                    <CSVReader
                      cssClass="csv-reader-input text-sm text-base-content"
                      label=""
                      onFileLoaded={handleFileLoad}
                      inputId="csv-products"
                      inputStyle={{ width: "100%" }}
                    />
                  </div>
                  {csvData.length > 0 && (
                    <p className="mt-3 text-sm text-base-content/60">
                      <span className="font-medium text-base-content">{csvData.length}</span> row{csvData.length !== 1 ? "s" : ""} ready to import.
                    </p>
                  )}
                </div>

                <div className="flex flex-col-reverse gap-2 border-t border-base-200 bg-base-200/40 px-5 py-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    className="btn btn-sm btn-ghost transition-colors duration-200 hover:bg-base-300/50"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-primary transition-colors duration-200 hover:bg-opacity-90 disabled:btn-disabled"
                    onClick={importProducts}
                    disabled={csvData.length === 0}
                  >
                    Import
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
