import { Fragment, useContext, useState } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import AuthContext from "../AuthContext";
import { Link, NavLink } from "react-router-dom";
import GridViewTwoToneIcon from "@mui/icons-material/GridViewTwoTone";
import InviteCodesModal from "./InviteCodeMenu";
import AdminOptionsModal from "./AdminOptionsModal";

const navigation = [
  { name: "Dashboard", href: "/", exact: true },
  { name: "Inventory", href: "/inventory" },
  { name: "Purchase Details", href: "/purchase-details" },
  { name: "Sales", href: "/sales" },
  { name: "Manage Store", href: "/manage-store" },
];

const userNavigation = [
  { name: "Invite Codes", href: "#" },
  { name: "Admin Options", href: "#" },
  { name: "Sign Out", href: "./login" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const ProfilePicture = ({ imageUrl, firstName, lastName }) => {
  if (imageUrl) {
    return <img className="h-8 w-8 rounded-full" src={imageUrl} alt="profile" />;
  }
  const initial = firstName ? firstName.charAt(0) : "";
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/80">
      <span className="text-white font-medium">{initial.toUpperCase()}</span>
    </div>
  );
};

export default function Header() {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const authContext = useContext(AuthContext);
  const localStorageData = JSON.parse(localStorage.getItem("user")) || {};

  const handleDeleteInventory = () => {
    fetch("http://localhost:4000/api/product/deleteAll", { method: "DELETE" })
      .then((response) => response.json())
      .then(() => {
        setIsAdminModalOpen(false);
      })
      .catch((err) => console.log(err));
  };

  const handleDeleteSales = () => {
    fetch("http://localhost:4000/api/sales/deleteAll", { method: "DELETE" })
      .then((response) => response.json())
      .then(() => {
        setIsAdminModalOpen(false);
      })
      .catch((err) => console.log(err));
  };

  const handleDeletePurchases = () => {
    fetch("http://localhost:4000/api/purchase/deleteAll", { method: "DELETE" })
      .then((response) => response.json())
      .then(() => {
        setIsAdminModalOpen(false);
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-40 border-b border-base-300 bg-base-100 shadow-sm">
        <InviteCodesModal isOpen={isInviteModalOpen} onClose={() => setIsInviteModalOpen(false)} />
        <AdminOptionsModal
          isOpen={isAdminModalOpen}
          onClose={() => setIsAdminModalOpen(false)}
          handleDeleteInventory={handleDeleteInventory}
          handleDeleteSales={handleDeleteSales}
          handleDeletePurchases={handleDeletePurchases}
        />
        <Disclosure as="nav" className="relative">
          {({ open }) => (
            <>
              <div className="w-full px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex items-center gap-2">
                        <div className="rounded-lg bg-primary/10 p-1.5 text-primary">
                          <GridViewTwoToneIcon className="h-6 w-6" />
                        </div>
                        <div className="leading-tight">
                          <span className="block text-sm font-semibold text-base-content">Stock Master</span>
                          <span className="block text-xs text-base-content/50">Retail Command Center</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="hidden md:block">
                    <div className="ml-4 flex items-center md:ml-6">
                      <button
                        type="button"
                        className="rounded-full p-2 text-base-content/60 transition-colors duration-200 hover:bg-base-200 hover:text-base-content"
                      >
                        <span className="sr-only">View notifications</span>
                        <BellIcon className="h-6 w-6" aria-hidden="true" />
                      </button>

                      <Menu as="div" className="relative ml-3">
                        <div>
                          <Menu.Button className="flex max-w-xs items-center rounded-full border border-base-300 bg-base-100 py-1 pl-1.5 pr-2 text-sm transition-colors duration-200 hover:bg-base-200 focus:outline-none focus:ring-2 focus:ring-primary/40">
                            <span className="sr-only">Open user menu</span>
                            <ProfilePicture imageUrl={localStorageData.imageUrl} firstName={localStorageData.firstName} lastName={localStorageData.lastName} />
                            <span className="ml-3 mr-2 text-base-content">ADMIN</span>
                          </Menu.Button>
                        </div>
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >          
                          <Menu.Items className="absolute right-0 z-10 mt-2 w-52 origin-top-right rounded-xl border border-base-300 bg-base-100 py-1 shadow-sm focus:outline-none">
                            {userNavigation.map((item) => (
                              <Menu.Item key={item.name}>
                                {({ active }) => (
                                  <Link
                                    to={item.href}
                                    className={classNames(
                                      active ? "bg-base-200 text-base-content" : "text-base-content/80",
                                      "block px-4 py-2 text-sm transition-colors duration-150"
                                    )}
                                    onClick={() => {
                                      if (item.name === "Invite Codes") {
                                        setIsInviteModalOpen(true);
                                      } else if (item.name === "Admin Options") {
                                        setIsAdminModalOpen(true);
                                      } else if (item.name === "Sign Out") {
                                        authContext.signout();
                                      }
                                    }}
                                  >
                                    {item.name}
                                  </Link>
                                )}
                              </Menu.Item>
                            ))}
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    </div>
                  </div>
                  <div className="-mr-2 flex md:hidden">
                    <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-base-content/70 transition-colors duration-200 hover:bg-base-200 hover:text-base-content focus:outline-none">
                      <span className="sr-only">Open main menu</span>
                      {open ? <XMarkIcon className="block h-6 w-6" aria-hidden="true" /> : <Bars3Icon className="block h-6 w-6" aria-hidden="true" />}
                    </Disclosure.Button>
                  </div>
                </div>
              </div>
              <Disclosure.Panel className="absolute left-0 right-0 top-full z-50 max-h-[min(70vh,calc(100vh-4rem))] overflow-y-auto border-t border-base-300 bg-base-100 shadow-lg md:hidden">
                <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
                  {navigation.map((item) => (
                    <NavLink to={item.href} end={item.exact} key={item.name}>
                      {({ isActive }) => (
                        <Disclosure.Button
                          as="div"
                          className={classNames(
                            isActive
                              ? "bg-primary/10 text-primary"
                              : "text-base-content/70 hover:bg-base-200 hover:text-base-content",
                            "block rounded-md px-3 py-2 text-base font-medium transition-colors duration-200"
                          )}
                        >
                          {item.name}
                        </Disclosure.Button>
                      )}
                    </NavLink>
                  ))}
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </div>
    </>
  );
}
