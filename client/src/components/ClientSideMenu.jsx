import React from "react";
import { NavLink } from "react-router-dom";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

import HomeIcon from "@mui/icons-material/Home";
import InventoryIcon from "@mui/icons-material/Inventory";
import StoreIcon from "@mui/icons-material/Store";
import MapIcon from "@mui/icons-material/Map";

const navItems = [
  { label: "Home", to: "/client", icon: HomeIcon, exact: true },
  { label: "Products", to: "/client/products", icon: InventoryIcon },
  { label: "Stores", to: "/client/stores", icon: StoreIcon },
  { label: "Stores Map", to: "/client/map", icon: MapIcon },
];

const getNavItemClass = ({ isActive }, collapsed) =>
  `group flex items-center text-sm font-semibold transition-colors duration-200 ${
    collapsed ? "justify-center rounded-lg px-0 py-2.5" : "gap-3 rounded-xl px-4 py-3"
  } ${
    isActive
      ? "bg-primary/10 text-primary border border-primary/20"
      : "text-base-content/70 hover:bg-base-200 hover:text-base-content border border-transparent"
  }`;

function ClientSideMenu({ collapsed = false, onToggleCollapse }) {
  return (
    <aside className="hidden h-full w-full min-w-0 flex-col border-r border-base-300 bg-base-100 transition-[width] duration-300 ease-out lg:flex">
      <div
        className={`flex shrink-0 items-center border-b border-base-300 ${
          collapsed ? "flex-col gap-1.5 px-1 py-2" : "justify-between gap-2 px-3 py-3"
        }`}
      >
        {!collapsed && (
          <p className="min-w-0 truncate px-1 text-xs font-semibold uppercase tracking-wide text-base-content/50">
            Client Navigation
          </p>
        )}
        <button
          type="button"
          onClick={onToggleCollapse}
          className={`shrink-0 rounded-xl border border-base-300 bg-base-100 text-base-content/70 shadow-sm transition-all duration-200 hover:border-primary/30 hover:bg-primary/10 hover:text-primary ${
            collapsed
              ? "mx-auto flex h-8 w-8 items-center justify-center"
              : "btn btn-square btn-sm"
          }`}
          aria-expanded={!collapsed}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRightIcon className="h-4 w-4" aria-hidden />
          ) : (
            <ChevronLeftIcon className="h-5 w-5" aria-hidden />
          )}
        </button>
      </div>

      <div className={`min-h-0 flex-1 overflow-y-auto ${collapsed ? "px-1 py-3" : "px-4 py-5"}`}>
        <nav aria-label="Main Nav" className={`flex flex-col ${collapsed ? "gap-1" : "gap-1.5"}`}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.exact}
                className={(state) => getNavItemClass(state, collapsed)}
                title={collapsed ? item.label : undefined}
              >
                <Icon fontSize="small" className="shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
                {collapsed && <span className="sr-only">{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}

export default ClientSideMenu;
