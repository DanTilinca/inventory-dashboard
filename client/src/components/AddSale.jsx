import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import ExclamationIcon from "@mui/icons-material/PriorityHighOutlined";
import PlusIcon from "@mui/icons-material/AddOutlined";
import Select from "react-select";

export default function AddSale({
  addSaleModalSetting,
  products,
  stores,
  handlePageUpdate,
  authContext,
}) {
  const [sale, setSale] = useState({
    userID: authContext.user,
    productID: "",
    storeID: "",
    stockSold: "",
    saleDate: "",
    totalSaleAmount: "",
    pricePerUnit: "",
  });
  const [open, setOpen] = useState(true);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [maxStock, setMaxStock] = useState(0);
  const [stockText, setStockText] = useState("");
  const cancelButtonRef = useRef(null);

  const closeModal = () => {
    setOpen(false);
    addSaleModalSetting();
  };

  const handleInputChange = (key, value) => {
    setSale((prevSale) => {
      const updatedSale = { ...prevSale, [key]: value };

      if (key === "productID") {
        const selectedProduct = products.find((product) => product._id === value);
        setMaxStock(selectedProduct ? selectedProduct.stock : 0);
        setStockText(
          selectedProduct ? (
            <span className="text-sm font-semibold text-base-content">
              Available stock: {selectedProduct.stock}
            </span>
          ) : (
            ""
          )
        );
      }

      if (key === "stockSold" && Number(value) > maxStock) {
        setError(true);
        setErrorMessage(`Cannot sell more than ${maxStock} units.`);
      } else {
        setError(false);
        setErrorMessage("");
      }

      if (key === "stockSold" || key === "totalSaleAmount") {
        const stockSold = parseFloat(updatedSale.stockSold);
        const totalAmount = parseFloat(updatedSale.totalSaleAmount);
        if (stockSold && totalAmount) {
          updatedSale.pricePerUnit = (totalAmount / stockSold).toFixed(2);
        }
      } else if (key === "pricePerUnit") {
        const stockSold = parseFloat(updatedSale.stockSold);
        const pricePerUnit = parseFloat(updatedSale.pricePerUnit);
        if (stockSold && pricePerUnit) {
          updatedSale.totalSaleAmount = (stockSold * pricePerUnit).toFixed(2);
        }
      }

      return updatedSale;
    });
  };

  const isFormValid = () =>
    Boolean(
      sale.productID &&
        sale.storeID &&
        sale.stockSold &&
        sale.saleDate &&
        sale.totalSaleAmount &&
        !error
    );

  const addSale = () => {
    if (!isFormValid()) {
      setError(true);
      setErrorMessage("All fields are required.");
      return;
    }

    const saleData = {
      ...sale,
      saleDate: new Date(sale.saleDate),
    };

    fetch("http://localhost:4000/api/sales/add", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(saleData),
    })
      .then(() => {
        alert("Sale ADDED");
        handlePageUpdate();
        closeModal();
      })
      .catch((err) => console.log(err));
  };

  const selectStyles = {
    control: (base) => ({
      ...base,
      minHeight: "32px",
      fontSize: "0.875rem",
      borderColor: "hsl(var(--b3) / 1)",
      borderRadius: "var(--rounded-btn, 0.5rem)",
      backgroundColor: "hsl(var(--b1) / 1)",
    }),
    menu: (base) => ({ ...base, zIndex: 70 }),
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-[60]"
        initialFocus={cancelButtonRef}
        onClose={closeModal}
      >
        <Transition.Child
          as={Fragment}
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
              as={Fragment}
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
                      <PlusIcon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <Dialog.Title as="h3" className="text-lg font-semibold text-base-content">
                        Add sale
                      </Dialog.Title>
                      <p className="mt-0.5 text-sm text-base-content/60">
                        Record sell-through for a product and store.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="px-5 py-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label htmlFor="productID" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-base-content/50">
                        Product
                      </label>
                      <Select
                        id="productID"
                        name="productID"
                        options={products.map((product) => ({
                          value: product._id,
                          label: product.name,
                        }))}
                        onChange={(option) => handleInputChange("productID", option?.value)}
                        classNamePrefix="select"
                        isSearchable
                        placeholder="Select product"
                        styles={selectStyles}
                      />
                      {stockText && <div className="mt-2">{stockText}</div>}
                    </div>
                    <div>
                      <label htmlFor="stockSold" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-base-content/50">
                        Stock sold
                      </label>
                      <input
                        type="number"
                        name="stockSold"
                        id="stockSold"
                        value={sale.stockSold}
                        onChange={(e) => handleInputChange(e.target.name, e.target.value)}
                        className={`input input-bordered input-sm w-full ${
                          error ? "input-error border-error" : "border-base-300"
                        }`}
                        placeholder="Quantity"
                      />
                    </div>
                    <div>
                      <label htmlFor="pricePerUnit" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-base-content/50">
                        Price per unit
                      </label>
                      <input
                        type="number"
                        name="pricePerUnit"
                        id="pricePerUnit"
                        value={sale.pricePerUnit}
                        onChange={(e) => handleInputChange(e.target.name, e.target.value)}
                        className="input input-bordered input-sm w-full border-base-300"
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <label htmlFor="totalSaleAmount" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-base-content/50">
                        Total sale amount
                      </label>
                      <input
                        type="number"
                        name="totalSaleAmount"
                        id="totalSaleAmount"
                        value={sale.totalSaleAmount}
                        onChange={(e) => handleInputChange(e.target.name, e.target.value)}
                        className="input input-bordered input-sm w-full border-base-300"
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <label htmlFor="storeID" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-base-content/50">
                        Store
                      </label>
                      <select
                        id="storeID"
                        className="select select-bordered select-sm w-full border-base-300"
                        name="storeID"
                        value={sale.storeID}
                        onChange={(e) => handleInputChange(e.target.name, e.target.value)}
                      >
                        <option value="">Select store</option>
                        {stores.map((element) => (
                          <option key={element._id} value={element._id}>
                            {element.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-base-content/50" htmlFor="saleDate">
                        Sale date
                      </label>
                      <input
                        className="input input-bordered input-sm w-full border-base-300"
                        type="date"
                        id="saleDate"
                        name="saleDate"
                        value={sale.saleDate}
                        onChange={(e) => handleInputChange(e.target.name, e.target.value)}
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="mt-4 rounded-lg border border-error/30 bg-error/10 p-3">
                      <div className="flex gap-2">
                        <ExclamationIcon className="h-5 w-5 flex-shrink-0 text-error" aria-hidden="true" />
                        <p className="text-sm font-medium text-error">{errorMessage}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col-reverse gap-2 border-t border-base-200 bg-base-200/40 px-5 py-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    className="btn btn-sm btn-ghost transition-colors duration-200 hover:bg-base-300/50"
                    onClick={closeModal}
                    ref={cancelButtonRef}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-primary transition-colors duration-200 hover:bg-opacity-90 disabled:btn-disabled"
                    onClick={addSale}
                    disabled={!isFormValid()}
                  >
                    Add sale
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
