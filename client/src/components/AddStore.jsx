import { Fragment, useRef, useState, useContext } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { PlusIcon } from "@heroicons/react/24/outline";
import UploadImage from "./UploadImage";
import AuthContext from "../AuthContext";

export default function AddStore() {
  const authContext = useContext(AuthContext);
  const [form, setForm] = useState({
    userId: authContext.user,
    name: "",
    category: "",
    address: "",
    city: "",
    image: "",
  });

  const [open, setOpen] = useState(true);
  const cancelButtonRef = useRef(null);

  const closeModal = () => setOpen(false);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addStore = () => {
    fetch("http://localhost:4000/api/store/add", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(form),
    })
      .then(() => {
        alert("STORE ADDED");
        closeModal();
      })
      .catch((err) => console.log(err));
  };

  const uploadImage = async (image) => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "inventoryapp");

    await fetch("https://api.cloudinary.com/v1_1/ddhayhptm/image/upload", {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((uploadData) => {
        setForm({ ...form, image: uploadData.url });
        alert("Store Image Successfully Uploaded");
      })
      .catch((error) => console.log(error));
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
                        Store information
                      </Dialog.Title>
                      <p className="mt-0.5 text-sm text-base-content/60">
                        Add a new location with optional storefront image.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="px-5 py-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-base-content/50">
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={form.name}
                        onChange={handleInputChange}
                        className="input input-bordered input-sm w-full border-base-300"
                        placeholder="Store name"
                      />
                    </div>
                    <div>
                      <label htmlFor="city" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-base-content/50">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        id="city"
                        value={form.city}
                        onChange={handleInputChange}
                        className="input input-bordered input-sm w-full border-base-300"
                        placeholder="City"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor="category" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-base-content/50">
                        Store type
                      </label>
                      <select
                        id="category"
                        className="select select-bordered select-sm w-full border-base-300"
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                      >
                        <option value="">Select type</option>
                        <option value="Groceries">Groceries</option>
                        <option value="Wholesale">Electronics</option>
                        <option value="SuperMart">SuperMart</option>
                        <option value="Phones">Phones</option>
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor="address" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-base-content/50">
                        Address
                      </label>
                      <textarea
                        id="address"
                        rows={4}
                        name="address"
                        className="textarea textarea-bordered textarea-sm w-full border-base-300 text-sm"
                        placeholder="Street, number, district…"
                        value={form.address}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="mt-4 rounded-lg border border-base-200 bg-base-200/30 p-4">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-base-content/50">
                      Store image
                    </p>
                    <UploadImage uploadImage={uploadImage} />
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
                    className="btn btn-sm btn-primary transition-colors duration-200 hover:bg-opacity-90"
                    onClick={addStore}
                  >
                    Add store
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
