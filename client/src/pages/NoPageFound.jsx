import React from "react";

function NoPageFound() {
  return (
    <div className="grid min-h-screen place-content-center bg-base-100 px-4">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-base-content/60">Error 404</p>
        <h1 className="mt-2 text-5xl font-bold text-base-content">Page not found</h1>
        <p className="mt-3 text-base text-base-content/70">
          The page you are looking for does not exist or may have been moved.
        </p>
      </div>
    </div>
  );
}

export default NoPageFound;
