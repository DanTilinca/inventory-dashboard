import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { KeyIcon, TrashIcon } from "@heroicons/react/24/outline";

function InviteCodeMenu({ isOpen, onClose }) {
  const [codes, setCodes] = useState([]);
  const [newCode, setNewCode] = useState("");

  useEffect(() => {
    const fetchCodes = async () => {
      const response = await fetch("http://localhost:4000/api/inviteCode/getAllCodes");
      const data = await response.json();
      setCodes(data || []);
    };

    if (isOpen) {
      fetchCodes();
    }
  }, [isOpen]);

  const handleAddCode = async () => {
    const response = await fetch("http://localhost:4000/api/inviteCode/addCode", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: newCode }),
    });

    const data = await response.json();

    if (data.success) {
      setCodes([...codes, { code: newCode }]);
      setNewCode("");
    }
  };

  const handleRemoveCode = async (codeToRemove) => {
    const response = await fetch(`http://localhost:4000/api/inviteCode/removeCode/${codeToRemove}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (data.success) {
      setCodes(codes.filter((code) => code.code !== codeToRemove));
    }
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
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
                      <KeyIcon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div className="min-w-0 flex-1 text-left">
                      <Dialog.Title as="h3" className="text-lg font-semibold text-base-content">
                        Invite codes
                      </Dialog.Title>
                      <p className="mt-0.5 text-sm text-base-content/60">
                        Manage registration codes for new admin accounts.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="px-5 py-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-base-content/50">
                    Active codes
                  </p>
                  <ul className="max-h-48 space-y-1.5 overflow-y-auto rounded-lg border border-base-200 bg-base-200/20 p-2">
                    {codes.length === 0 && (
                      <li className="rounded-md px-3 py-6 text-center text-sm text-base-content/50">No codes yet.</li>
                    )}
                    {codes.map((code, index) => (
                      <li
                        key={code.code || index}
                        className="flex items-center justify-between gap-2 rounded-md border border-base-200 bg-base-100 px-3 py-2 transition-colors duration-200 hover:bg-base-200/60"
                      >
                        <span className="font-mono text-sm font-medium text-base-content">{code.code}</span>
                        <button
                          type="button"
                          className="btn btn-ghost btn-xs gap-1 text-error transition-colors duration-200 hover:bg-error/10"
                          onClick={() => handleRemoveCode(code.code)}
                        >
                          <TrashIcon className="h-4 w-4" aria-hidden />
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-4 rounded-lg border border-base-200 bg-base-200/30 p-4">
                    <label htmlFor="new-invite-code" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-base-content/50">
                      Add code
                    </label>
                    <input
                      id="new-invite-code"
                      type="text"
                      value={newCode}
                      onChange={(e) => setNewCode(e.target.value)}
                      className="input input-bordered input-sm mb-3 w-full border-base-300 font-mono"
                      placeholder="Code"
                    />
                    <button
                      type="button"
                      className="btn btn-sm btn-primary w-full transition-colors duration-200 hover:bg-opacity-90 disabled:btn-disabled"
                      onClick={handleAddCode}
                      disabled={!newCode.trim()}
                    >
                      Add code
                    </button>
                  </div>
                </div>

                <div className="border-t border-base-200 bg-base-200/40 px-5 py-3 sm:flex sm:justify-end">
                  <button type="button" className="btn btn-sm btn-ghost w-full sm:w-auto" onClick={onClose}>
                    Close
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

export default InviteCodeMenu;
