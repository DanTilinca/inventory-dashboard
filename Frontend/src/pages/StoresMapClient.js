import React, { useEffect, useState } from 'react';

const StoresMapClient = () => {
  const [map, setMap] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [stores, setStores] = useState([]);
  const [locationPermission, setLocationPermission] = useState(true); // Default permission
  const [closestStore, setClosestStore] = useState(null);

  useEffect(() => {
    const loadGoogleMapsAPI = async () => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyD2-WENmDCAWho2OqjKMJCHTIHvKUCl3G8&libraries=places,directions`;
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        // Initialize Map
        const map = new window.google.maps.Map(document.getElementById('map'), {
          center: { lat: -34.397, lng: 150.644 }, // Default center
          zoom: 8,
        });
        setMap(map);

        // Get User Location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const userLatLng = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              };
              setUserLocation(userLatLng);
              map.setCenter(userLatLng);
              map.setZoom(15); // Set a higher zoom level for better visibility
              findClosestStore(userLatLng);
            },
            (error) => {
              console.error('Error getting user location:', error);
              setLocationPermission(false); // Set permission to false if user denies access
            }
          );
        } else {
          console.error('Geolocation is not supported by this browser.');
          setLocationPermission(false); // Set permission to false if geolocation is not supported
        }

        // Add Store Markers
        addStoreMarkers(map);
      };
    };

    loadGoogleMapsAPI();
  }, []);

  const addStoreMarkers = (map) => {
    try {
      // Fetch Store Data
      fetch("http://localhost:4000/api/store/get")
        .then((response) => response.json())
        .then((locations) => {
          setStores(locations);

          // Place Markers
          locations.forEach((location) => {
            const { name, address, category, city, image } = location;
            const fullAddress = `${address}, ${city}`;
            const geocoder = new window.google.maps.Geocoder();

            geocoder.geocode({ address: fullAddress }, (results, status) => {
              if (status === "OK" && results[0]) {
                const marker = new window.google.maps.Marker({
                  position: results[0].geometry.location,
                  map: map,
                  title: name,
                });

                const infoWindow = new window.google.maps.InfoWindow({
                  content: `<div>
                              <h3>${name}</h3>
                              <p>${fullAddress}</p>
                              <p>Category: ${category}</p>
                              <img src="${image}" alt="${name}" style="max-width: 100px; max-height: 100px; object-fit: cover;"/>
                              <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-xs">
                                More details
                              </button>
                            </div>`,
                });

                marker.addListener("click", () => {
                  infoWindow.open(map, marker);
                });
              } else {
                console.error(
                  "Geocode was not successful for the following reason:",
                  status
                );
              }
            });
          });
        })
        .catch((error) => {
          console.error("Error fetching store locations:", error);
        });
    } catch (error) {
      console.error("Error fetching store locations:", error);
    }
  };

  const findClosestStore = (userLatLng) => {
    if (stores.length === 0) return;
    
    let closestDistance = Infinity;
    let closestStore = null;

    stores.forEach((store) => {
      const storeLatLng = new window.google.maps.LatLng(store.latitude, store.longitude);
      const distance = window.google.maps.geometry.spherical.computeDistanceBetween(userLatLng, storeLatLng);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestStore = store;
      }
    });

    setClosestStore(closestStore);
    displayRoute(userLatLng, closestStore);
  };

  const displayRoute = (origin, destination) => {
    const directionsService = new window.google.maps.DirectionsService();
    const directionsRenderer = new window.google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);

    const request = {
      origin: origin,
      destination: new window.google.maps.LatLng(destination.latitude, destination.longitude),
      travelMode: 'DRIVING',
    };

    directionsService.route(request, (result, status) => {
      if (status === 'OK') {
        directionsRenderer.setDirections(result);
      } else {
        console.error('Directions request failed due to ' + status);
      }
    });
  };

  return (
    <div>
      {locationPermission ? (
        <div id="map" style={{ height: '100vh', width: '100%' }} />
      ) : (
        <p>Please allow access to your location to use this feature.</p>
      )}
    </div>
  );
};

export default StoresMapClient
