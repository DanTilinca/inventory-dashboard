import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { PlusIcon } from "@heroicons/react/24/outline";
import Select from "react-select";

export default function AddPurchaseDetails({
  addSaleModalSetting,
  products,
  handlePageUpdate,
  authContext,
}) {
  const [purchase, setPurchase] = useState({
    userID: authContext.user,
    productID: "",
    quantityPurchased: "",
    purchaseDate: "",
    totalPurchaseAmount: "",
    pricePerUnit: "",
  });
  const [open, setOpen] = useState(true);
  const cancelButtonRef = useRef(null);

  const closeModal = () => {
    setOpen(false);
    addSaleModalSetting();
  };

  const isFormComplete = Object.values(purchase).every((field) => field !== "");

  const handleInputChange = (key, value) => {
    setPurchase((prevPurchase) => {
      const updatedPurchase = { ...prevPurchase, [key]: value };

      if (key === "quantityPurchased" || key === "totalPurchaseAmount") {
        const quantity = parseFloat(updatedPurchase.quantityPurchased);
        const totalAmount = parseFloat(updatedPurchase.totalPurchaseAmount);
        if (quantity && totalAmount) {
          updatedPurchase.pricePerUnit = (totalAmount / quantity).toFixed(2);
        }
      } else if (key === "pricePerUnit") {
        const quantity = parseFloat(updatedPurchase.quantityPurchased);
        const pricePerUnit = parseFloat(updatedPurchase.pricePerUnit);
        if (quantity && pricePerUnit) {
          updatedPurchase.totalPurchaseAmount = (quantity * pricePerUnit).toFixed(2);
        }
      }

      return updatedPurchase;
    });
  };

  const addPurchase = () => {
    const purchaseData = {
      ...purchase,
      purchaseDate: new Date(purchase.purchaseDate),
    };

    fetch("http://localhost:4000/api/purchase/add", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(purchaseData),
    })
      .then((res) => res.json())
      .then(() => {
        alert("Purchase ADDED");
        handlePageUpdate();
        closeModal();
      })
      .catch((err) => {
        console.error("Error adding purchase:", err);
        alert("Error adding purchase. Please check console for details.");
      });
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
                        Add purchase
                      </Dialog.Title>
                      <p className="mt-0.5 text-sm text-base-content/60">
                        Record inbound stock and cost for a product.
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
                        onChange={(option) => handleInputChange("productID", option?.value ?? "")}
                        classNamePrefix="select"
                        isSearchable
                        placeholder="Select product"
                        styles={selectStyles}
                      />
                    </div>
                    <div>
                      <label htmlFor="quantityPurchased" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-base-content/50">
                        Quantity purchased
                      </label>
                      <input
                        type="number"
                        name="quantityPurchased"
                        id="quantityPurchased"
                        value={purchase.quantityPurchased}
                        onChange={(e) => handleInputChange(e.target.name, e.target.value)}
                        className="input input-bordered input-sm w-full border-base-300"
                        placeholder="Units"
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
                        value={purchase.pricePerUnit}
                        onChange={(e) => handleInputChange(e.target.name, e.target.value)}
                        className="input input-bordered input-sm w-full border-base-300"
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <label htmlFor="totalPurchaseAmount" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-base-content/50">
                        Total purchase amount
                      </label>
                      <input
                        type="number"
                        name="totalPurchaseAmount"
                        id="totalPurchaseAmount"
                        value={purchase.totalPurchaseAmount}
                        onChange={(e) => handleInputChange(e.target.name, e.target.value)}
                        className="input input-bordered input-sm w-full border-base-300"
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-base-content/50" htmlFor="purchaseDate">
                        Purchase date
                      </label>
                      <input
                        className="input input-bordered input-sm w-full border-base-300"
                        type="date"
                        id="purchaseDate"
                        name="purchaseDate"
                        value={purchase.purchaseDate}
                        onChange={(e) => handleInputChange(e.target.name, e.target.value)}
                      />
                    </div>
                  </div>
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
                    onClick={addPurchase}
                    disabled={!isFormComplete}
                  >
                    Add purchase
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
