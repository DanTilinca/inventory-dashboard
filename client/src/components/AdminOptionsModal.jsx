import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ShieldExclamationIcon } from "@heroicons/react/24/outline";

const AdminOptionsModal = ({
  isOpen,
  onClose,
  handleDeleteInventory,
  handleDeleteSales,
  handleDeletePurchases,
}) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[60]" onClose={onClose}>
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-xl border border-base-300 bg-base-100 text-left align-middle shadow-lg transition-all font-['Inter','Segoe_UI','Roboto',sans-serif]">
                <div className="border-b border-base-200 px-5 py-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-error/10 text-error">
                      <ShieldExclamationIcon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div className="min-w-0 flex-1 text-left">
                      <Dialog.Title as="h3" className="text-lg font-semibold text-base-content">
                        Admin options
                      </Dialog.Title>
                      <p className="mt-0.5 text-sm text-base-content/60">
                        Destructive actions below permanently remove data from the database. Use only when you intend to reset environments.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 px-5 py-4">
                  <button
                    type="button"
                    className="btn btn-sm btn-error w-full text-white transition-colors duration-200 hover:bg-opacity-90"
                    onClick={handleDeleteInventory}
                  >
                    Delete all inventory
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-error w-full text-white transition-colors duration-200 hover:bg-opacity-90"
                    onClick={handleDeleteSales}
                  >
                    Delete all sales
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-error w-full text-white transition-colors duration-200 hover:bg-opacity-90"
                    onClick={handleDeletePurchases}
                  >
                    Delete all purchases
                  </button>
                </div>

                <div className="border-t border-base-200 bg-base-200/40 px-5 py-3 sm:flex sm:justify-end">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline border-base-300 transition-colors duration-200 hover:bg-base-200 w-full sm:w-auto"
                    onClick={onClose}
                  >
                    Close
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

export default AdminOptionsModal;
