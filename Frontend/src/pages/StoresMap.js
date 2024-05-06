import React, { useState, useEffect } from "react";

const StoresMap = () => {
  const [map, setMap] = useState(null);
  const [geocoder, setGeocoder] = useState(null);
  const [storeLocations, setStoreLocations] = useState([]);
  const [newAddress, setNewAddress] = useState("");

  useEffect(() => {
    const loadGoogleMapsAPI = () => {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyD2-WENmDCAWho2OqjKMJCHTIHvKUCl3G8&libraries=places`;
      script.defer = true;
      script.async = true;
      script.onload = initMap;
      document.head.appendChild(script);
    };

    const initMap = () => {
      const mapOptions = {
        center: { lat: 0, lng: 0 },
        zoom: 8,
      };

      const map = new window.google.maps.Map(document.getElementById("map"), mapOptions);
      setMap(map);
      setGeocoder(new window.google.maps.Geocoder());

      // Încărcăm locațiile salvate din storage
      const storedLocations = JSON.parse(localStorage.getItem("storeLocations"));
      if (storedLocations) {
        setStoreLocations(storedLocations);
        // Plasăm marker-ele pe hartă pentru locațiile salvate
        storedLocations.forEach((location) => {
          new window.google.maps.Marker({
            position: location,
            map: map,
          });
        });
      }
    };

    loadGoogleMapsAPI();

    return () => {
      const script = document.querySelector('script[src^="https://maps.googleapis.com"]');
      if (script) {
        script.remove();
      }
    };
  }, []);

  const addStoreLocation = () => {
    geocoder.geocode({ address: newAddress }, (results, status) => {
      if (status === "OK") {
        const location = results[0].geometry.location;
        setStoreLocations([...storeLocations, location]);
        setNewAddress("");
        // Plasăm marker-ul pe hartă pentru locația nou adăugată
        new window.google.maps.Marker({
          position: location,
          map: map,
        });
        // Salvăm locațiile în storage
        localStorage.setItem("storeLocations", JSON.stringify([...storeLocations, location]));
      } else {
        alert("Nu s-au putut găsi coordonate pentru adresa introdusă.");
      }
    });
  };

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "right" }}>
      <nav></nav>
      <div id="map" style={{ width: "500%", height: "70vh", marginTop: "20px" }}></div>
      <div style={{ marginTop: "70px" }}>
        <input
          type="text"
          placeholder="Introduceți adresa magazinului"
          value={newAddress}
          onChange={(e) => setNewAddress(e.target.value)}
        />
        <button onClick={addStoreLocation}>Adăugare magazin</button>
      </div>
    </div>
  );
};

export default StoresMap;