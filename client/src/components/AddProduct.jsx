import { Fragment, useContext, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { PlusIcon } from "@heroicons/react/24/outline";
import AuthContext from "../AuthContext";

const categories = ["Electronics", "Groceries", "Healthcare", "Others"];

export default function AddProduct({ addProductModalSetting, handlePageUpdate }) {
  const authContext = useContext(AuthContext);
  const [product, setProduct] = useState({
    userId: authContext.user,
    name: "",
    category: categories[0],
    description: "",
  });

  const [open, setOpen] = useState(true);
  const cancelButtonRef = useRef(null);

  const handleInputChange = (key, value) => {
    setProduct({ ...product, [key]: value });
  };

  const closeModal = () => {
    setOpen(false);
    addProductModalSetting();
  };

  const addProduct = () => {
    fetch("http://localhost:4000/api/product/add", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(product),
    })
      .then(() => {
        alert("Product ADDED");
        handlePageUpdate();
        closeModal();
      })
      .catch((err) => console.log(err));
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
                    <div className="min-w-0 flex-1 text-left">
                      <Dialog.Title as="h3" className="text-lg font-semibold text-base-content">
                        Add product
                      </Dialog.Title>
                      <p className="mt-0.5 text-sm text-base-content/60">
                        Create a new SKU with category and description.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="px-5 py-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-1">
                      <label htmlFor="name" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-base-content/50">
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={product.name}
                        onChange={(e) => handleInputChange(e.target.name, e.target.value)}
                        className="input input-bordered input-sm w-full border-base-300"
                        placeholder="Product name"
                      />
                    </div>
                    <div className="sm:col-span-1">
                      <label htmlFor="category" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-base-content/50">
                        Category
                      </label>
                      <select
                        id="category"
                        name="category"
                        value={product.category}
                        onChange={(e) => handleInputChange(e.target.name, e.target.value)}
                        className="select select-bordered select-sm w-full border-base-300"
                      >
                        {categories.map((category, index) => (
                          <option key={index} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor="description" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-base-content/50">
                        Description
                      </label>
                      <textarea
                        id="description"
                        rows={4}
                        name="description"
                        className="textarea textarea-bordered textarea-sm w-full border-base-300 text-sm"
                        placeholder="Product description"
                        value={product.description}
                        onChange={(e) => handleInputChange(e.target.name, e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col-reverse gap-2 border-t border-base-200 bg-base-200/40 px-5 py-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    className="btn btn-sm btn-ghost border border-transparent transition-colors duration-200 hover:bg-base-300/50"
                    onClick={closeModal}
                    ref={cancelButtonRef}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-primary transition-colors duration-200 hover:bg-opacity-90"
                    onClick={addProduct}
                  >
                    Add product
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
