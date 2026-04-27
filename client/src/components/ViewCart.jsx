import React, { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ShoppingCartIcon, TrashIcon } from "@heroicons/react/24/outline";

const ViewCart = ({ isOpen, cartModalSetting, handlePageUpdate, onCartUpdated }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(cart);
  }, [isOpen]);

  const handleRemoveItem = (id) => {
    const updatedCart = cartItems.filter((item) => item._id !== id);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    if (onCartUpdated) onCartUpdated();
  };

  const handleBuyProducts = () => {
    cartItems.forEach((item) => {
      fetch(`http://localhost:4000/api/product/update/${item._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ stock: item.stock - item.quantity }),
      })
        .then((response) => response.json())
        .then(() => {
          // Keep this for future per-item status handling.
        });
    });

    localStorage.removeItem("cart");
    setCartItems([]);
    if (onCartUpdated) onCartUpdated();
    alert("Products ordered successfully!");
    cartModalSetting();
    handlePageUpdate();
  };

  const totalItems = cartItems.reduce((sum, item) => sum + Number(item.quantity || 0), 0);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[60]" onClose={cartModalSetting}>
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
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-xl border border-base-300 bg-base-100 text-left align-middle shadow-lg transition-all font-['Inter','Segoe_UI','Roboto',sans-serif]">
                <div className="border-b border-base-200 px-5 py-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <ShoppingCartIcon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <Dialog.Title as="h3" className="text-lg font-semibold text-base-content">
                        Your cart
                      </Dialog.Title>
                      <p className="mt-0.5 text-sm text-base-content/60">
                        {totalItems} item{totalItems !== 1 ? "s" : ""} selected for ordering.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="px-5 py-4">
                {cartItems.length === 0 ? (
                  <div className="rounded-lg border border-base-200 bg-base-200/30 p-6 text-center text-sm text-base-content/60">
                    Your cart is empty.
                  </div>
                ) : (
                  <div className="max-h-80 overflow-y-auto rounded-lg border border-base-200">
                    <ul className="divide-y divide-base-200">
                      {cartItems.map((item) => (
                        <li key={item._id} className="flex items-center justify-between gap-3 p-3">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-base-content">{item.name}</p>
                            <p className="text-xs text-base-content/60">Quantity: {item.quantity}</p>
                          </div>
                          <button
                            className="btn btn-ghost btn-xs text-error transition-colors duration-200 hover:bg-error/10"
                            onClick={() => handleRemoveItem(item._id)}
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                </div>

                <div className="flex flex-col-reverse gap-2 border-t border-base-200 bg-base-200/40 px-5 py-3 sm:flex-row sm:justify-end">
                  <button
                    className="btn btn-sm btn-ghost transition-colors duration-200 hover:bg-base-300/50"
                    onClick={cartModalSetting}
                  >
                    Close
                  </button>
                  <button
                    className="btn btn-sm btn-primary transition-colors duration-200 hover:bg-opacity-90 disabled:btn-disabled"
                    onClick={handleBuyProducts}
                    disabled={cartItems.length === 0}
                  >
                    Order Products
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ViewCart;
