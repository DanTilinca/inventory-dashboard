import React from "react";
import { Link } from "react-router-dom";
import {
  CubeIcon,
  MapIcon,
  BuildingStorefrontIcon,
} from "@heroicons/react/24/outline";

function HomePageClient() {
  const localStorageData = JSON.parse(localStorage.getItem("user")) || {};
  const { firstName, lastName } = localStorageData;

  const navigationCards = [
    {
      title: "Products",
      description:
        "Browse the product catalog, filter by category, and add items to cart with real-time stock visibility.",
      to: "/client/products",
      action: "Go to Products",
      accent: "text-primary",
      icon: CubeIcon,
    },
    {
      title: "Stores",
      description:
        "Explore all available store locations, search by city or name, and open detailed store profiles.",
      to: "/client/stores",
      action: "Go to Stores",
      accent: "text-success",
      icon: BuildingStorefrontIcon,
    },
    {
      title: "Map",
      description:
        "Locate stores on the map view, compare nearby locations, and navigate to the best option quickly.",
      to: "/client/map",
      action: "Go to Map",
      accent: "text-warning",
      icon: MapIcon,
    },
  ];

  return (
    <div className="col-span-12 lg:col-span-10 min-h-screen bg-base-200/40 p-4 md:p-6 font-['Inter','Segoe_UI','Roboto',sans-serif]">
      <div className="flex w-full flex-col gap-4">
        <div className="rounded-xl border border-base-300 bg-base-100 p-5 shadow-sm">
          <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-3xl font-bold text-base-content">
                Hello {firstName || "User"} {lastName || ""}!
              </h1>
              <p className="mt-1 text-sm text-base-content/60">
                Welcome to Stock Master Client Portal.
              </p>
            </div>
          </div>

          <p className="mb-6 max-w-3xl text-sm leading-relaxed text-base-content/70">
            Stock Master is your one-stop solution for viewing inventory, discovering stores, and planning the best
            routes. Use the quick access modules below to navigate the client experience.
          </p>

          <div className="relative mb-6 overflow-hidden rounded-xl border border-base-300 bg-gradient-to-br from-primary/12 via-base-100 to-base-200/50 p-8 shadow-sm">
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.35]"
              style={{
                backgroundImage:
                  "linear-gradient(to right, hsl(var(--bc) / 0.06) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--bc) / 0.06) 1px, transparent 1px)",
                backgroundSize: "28px 28px",
              }}
            />
            <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-success/15 blur-3xl" />

            <div className="relative max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-wider text-base-content/50">Retail overview</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-base-content md:text-3xl">
                Inventory, stores, and routes in one calm workspace.
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-base-content/70">
                No external assets required—this hero uses layered gradients and a subtle grid texture for a clean,
                enterprise-grade first impression.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                <span className="badge badge-outline border-base-300 text-base-content/70">Live catalog</span>
                <span className="badge badge-outline border-base-300 text-base-content/70">Store directory</span>
                <span className="badge badge-outline border-base-300 text-base-content/70">Map navigation</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {navigationCards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.title}
                  className="flex flex-col rounded-xl border border-base-300 bg-base-100 p-5 shadow-sm transition-shadow duration-200 hover:shadow-md"
                >
                  <div className="mb-3 flex items-center gap-2">
                    <div className="rounded-lg bg-primary/10 p-2 text-primary">
                      <Icon className="h-5 w-5" aria-hidden />
                    </div>
                    <h2 className="text-lg font-semibold text-base-content">{card.title}</h2>
                  </div>
                  <p className="flex-1 text-sm leading-relaxed text-base-content/70">{card.description}</p>
                  <div className="mt-5">
                    <Link
                      to={card.to}
                      className={`btn btn-sm btn-ghost border border-base-200 font-semibold normal-case transition-colors duration-200 hover:bg-base-200 ${card.accent}`}
                    >
                      {card.action}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePageClient;
