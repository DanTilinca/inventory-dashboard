import { Fragment, useContext } from "react";
import { Menu, Transition } from "@headlessui/react";
import AuthContext from "../AuthContext";
import { Link } from "react-router-dom";
import GridViewTwoToneIcon from "@mui/icons-material/GridViewTwoTone";
import ThemeToggle from "./ThemeToggle";

const userNavigation = [
  { name: "Sign Out", href: "/login" },
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

export default function ClientHeader() {
  const authContext = useContext(AuthContext);
  const localStorageData = JSON.parse(localStorage.getItem("user")) || {};

  return (
    <div className="fixed top-0 left-0 right-0 z-40 border-b border-base-300 bg-base-100 shadow-sm">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-primary/10 p-1.5 text-primary">
              <GridViewTwoToneIcon className="h-6 w-6" />
            </div>
            <div className="leading-tight">
              <span className="block text-sm font-semibold text-base-content">Stock Master</span>
              <span className="block text-xs text-base-content/50">Client Portal</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <Menu as="div" className="relative ml-1">
            <div>
              <Menu.Button className="flex items-center rounded-full border border-base-300 bg-base-100 py-1 pl-1.5 pr-2 text-sm transition-colors duration-200 hover:bg-base-200 focus:outline-none focus:ring-2 focus:ring-primary/40">
                <span className="sr-only">Open user menu</span>
                <ProfilePicture imageUrl={localStorageData.imageUrl} firstName={localStorageData.firstName} lastName={localStorageData.lastName} />
                <span className="ml-3 mr-2 text-base-content">USER</span>
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
              <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-xl border border-base-300 bg-base-100 py-1 shadow-sm focus:outline-none">
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
                          if (item.name === "Sign Out") {
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
      </div>
    </div>
  );
}
