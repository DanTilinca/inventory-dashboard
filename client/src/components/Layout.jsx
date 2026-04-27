import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import SideMenu from "./SideMenu";

const ADMIN_SIDEBAR_KEY = "sidebar-admin-collapsed";

function Layout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    try {
      return localStorage.getItem(ADMIN_SIDEBAR_KEY) === "true";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(ADMIN_SIDEBAR_KEY, String(sidebarCollapsed));
    } catch {
      /* ignore */
    }
  }, [sidebarCollapsed]);

  return (
    <div className="min-h-screen bg-base-200/40">
      <Header />
      {/* Fixed under header so the rail meets the header edge (no full-width pt-16 gap) */}
      <div
        className={`fixed left-0 top-16 z-30 hidden h-[calc(100vh-4rem)] overflow-hidden transition-[width] duration-300 ease-out lg:block ${
          sidebarCollapsed ? "w-16" : "w-56"
        }`}
      >
        <SideMenu
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed((c) => !c)}
        />
      </div>
      <div
        className={`min-w-0 pt-16 transition-[padding] duration-300 ease-out ${
          sidebarCollapsed ? "lg:pl-16" : "lg:pl-56"
        }`}
      >
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
