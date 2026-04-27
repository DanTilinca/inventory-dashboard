import React, { useEffect, useMemo, useState } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const DEFAULT_CENTER = [45.9432, 24.9668];
const DEFAULT_ZOOM = 7;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function geocodeAddress(fullAddress) {
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q", fullAddress);
  url.searchParams.set("format", "json");
  url.searchParams.set("limit", "1");

  const response = await fetch(url.toString(), {
    headers: {
      Accept: "application/json",
      "Accept-Language": "en",
      "User-Agent": "InventoryDashboard/1.0 (retail inventory app; local development)",
    },
  });

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  if (!data || !data.length) {
    return null;
  }

  const lat = parseFloat(data[0].lat);
  const lng = parseFloat(data[0].lon);
  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    return null;
  }

  return { lat, lng };
}

function FitBounds({ positions }) {
  const map = useMap();

  useEffect(() => {
    if (!positions || positions.length === 0) {
      return;
    }
    if (positions.length === 1) {
      map.setView(positions[0], 12);
      return;
    }
    const bounds = L.latLngBounds(positions);
    map.fitBounds(bounds, { padding: [48, 48], maxZoom: 14 });
  }, [map, positions]);

  return null;
}

/**
 * OpenStreetMap + Leaflet map with Nominatim geocoding
 */
export default function StoresMapLeaflet({ onSelectStore, heading, subheading }) {
  const [markers, setMarkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const loadMarkers = async () => {
      setLoading(true);
      setError(null);
      setMarkers([]);

      try {
        const response = await fetch("http://localhost:4000/api/store/get");
        if (!response.ok) {
          throw new Error("Failed to load stores");
        }
        const stores = await response.json();
        if (!Array.isArray(stores)) {
          throw new Error("Invalid store data");
        }

        const resolved = [];
        for (const store of stores) {
          if (cancelled) {
            return;
          }
          const fullAddress = `${store.address || ""}, ${store.city || ""}, Romania`.trim();
          const coords = await geocodeAddress(fullAddress);
          if (coords) {
            resolved.push({ store, lat: coords.lat, lng: coords.lng });
          }
          await sleep(1100);
        }

        if (!cancelled) {
          setMarkers(resolved);
          if (resolved.length === 0 && stores.length > 0) {
            setError("Could not place stores on the map. Try again later or check addresses.");
          }
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          setError("Unable to load store locations.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadMarkers();

    return () => {
      cancelled = true;
    };
  }, []);

  const boundsPositions = useMemo(() => markers.map((m) => [m.lat, m.lng]), [markers]);

  const openDirections = (lat, lng) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex flex-col gap-3">
      {(heading || subheading) && (
        <div>
          {heading && <h2 className="text-xl font-semibold text-base-content">{heading}</h2>}
          {subheading && <p className="mt-1 text-sm text-base-content/60">{subheading}</p>}
        </div>
      )}

      {loading && (
        <div className="rounded-lg border border-base-200 bg-base-200/40 px-4 py-3 text-sm text-base-content/70">
          Loading map and geocoding store addresses…
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-warning/40 bg-warning/10 px-4 py-3 text-sm text-warning-content">
          {error}
        </div>
      )}

      <div className="relative h-[min(70vh,640px)] w-full overflow-hidden rounded-xl border border-base-300 shadow-sm">
        <MapContainer
          center={DEFAULT_CENTER}
          zoom={DEFAULT_ZOOM}
          className="h-full w-full z-0"
          scrollWheelZoom
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {markers.map(({ store, lat, lng }) => (
            <Marker key={store._id} position={[lat, lng]} title={store.name}>
              <Popup>
                <div className="min-w-[200px] max-w-[260px] space-y-2 text-sm">
                  <div>
                    <p className="font-semibold text-base-content">{store.name}</p>
                    <p className="text-xs text-base-content/70">
                      {[store.address, store.city].filter(Boolean).join(", ")}
                    </p>
                    {store.category && (
                      <p className="mt-1 text-xs text-base-content/60">Category: {store.category}</p>
                    )}
                  </div>
                  {store.image && (
                    <img
                      src={store.image}
                      alt={store.name}
                      className="h-20 w-full rounded-md border border-base-200 object-cover"
                    />
                  )}
                  <div className="flex flex-wrap gap-2 pt-1">
                    <button
                      type="button"
                      className="btn btn-xs btn-primary text-white"
                      onClick={() => onSelectStore?.(store)}
                    >
                      More details
                    </button>
                    <button
                      type="button"
                      className="btn btn-xs btn-outline border-base-300"
                      onClick={() => openDirections(lat, lng)}
                    >
                      Directions
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
          {boundsPositions.length > 0 && <FitBounds positions={boundsPositions} />}
        </MapContainer>
      </div>

      <p className="text-xs text-base-content/50">
        Map data © OpenStreetMap contributors. Geocoding by{" "}
        <a
          href="https://nominatim.openstreetmap.org/"
          className="link link-primary"
          target="_blank"
          rel="noreferrer"
        >
          Nominatim
        </a>
        .
      </p>
    </div>
  );
}
