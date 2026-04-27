import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { MapPinIcon, BuildingStorefrontIcon } from "@heroicons/react/24/outline";

const StoreDetails = ({ isOpen, onClose, store }) => {
  const hardcodedOpenHours = [
    { day: "Monday", open: "9:00 AM", close: "6:00 PM" },
    { day: "Tuesday", open: "9:00 AM", close: "6:00 PM" },
    { day: "Wednesday", open: "9:00 AM", close: "6:00 PM" },
    { day: "Thursday", open: "9:00 AM", close: "6:00 PM" },
    { day: "Friday", open: "9:00 AM", close: "6:00 PM" },
    { day: "Saturday", open: "10:00 AM", close: "4:00 PM" },
    { day: "Sunday", open: "Closed", close: "" },
  ];

  const hardcodedHolidays = ["New Year's Day", "Independence Day", "Thanksgiving Day", "Christmas Day"];

  const additionalInfo =
    "This store offers a wide range of products including groceries, electronics, and clothing. We aim to provide the best service to our customers.";

  if (!store) return null;

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
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-xl border border-base-300 bg-base-100 text-left align-middle shadow-lg transition-all font-['Inter','Segoe_UI','Roboto',sans-serif]">
                <div className="border-b border-base-200 px-5 py-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <BuildingStorefrontIcon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <Dialog.Title as="h3" className="text-lg font-semibold text-base-content">
                        {store.name || "Store details"}
                      </Dialog.Title>
                      <p className="mt-0.5 flex items-center gap-1 text-sm text-base-content/60">
                        <MapPinIcon className="h-4 w-4 flex-shrink-0" />
                        {[store.address, store.city].filter(Boolean).join(" · ") || "Location"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="max-h-[min(70vh,32rem)] overflow-y-auto px-5 py-4">
                  {store.image && (
                    <img alt={store.name || "Store"} className="mb-4 h-48 w-full rounded-lg border border-base-200 object-cover" src={store.image} />
                  )}

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-lg border border-base-200 bg-base-200/20 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-base-content/50">Hours</p>
                      <ul className="mt-2 space-y-1.5 text-sm text-base-content/80">
                        {hardcodedOpenHours.map((hour, index) => (
                          <li key={index} className="flex justify-between gap-2 border-b border-base-200/80 py-1 last:border-0">
                            <span className="font-medium text-base-content">{hour.day}</span>
                            <span>
                              {hour.open}
                              {hour.close ? ` – ${hour.close}` : ""}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-lg border border-base-200 bg-base-200/20 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-base-content/50">Holidays</p>
                      <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-base-content/80">
                        {hardcodedHolidays.map((holiday, index) => (
                          <li key={index}>{holiday}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-4 rounded-lg border border-base-200 bg-base-100 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-base-content/50">About</p>
                    <p className="mt-2 text-sm leading-relaxed text-base-content/80">{additionalInfo}</p>
                  </div>
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

export default StoreDetails;
