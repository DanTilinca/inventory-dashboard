import React from "react";
import { Outlet } from "react-router-dom";
import ClientHeader from "./ClientHeader";

function LayoutClient() {
  return (
    <>
      <div className="md:h-16">
        <ClientHeader />
      </div>
      <div className="p-4">
        <Outlet />
      </div>
    </>
  );
}

export default LayoutClient;