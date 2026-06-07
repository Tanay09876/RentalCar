import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const CITY_COORDINATES = {
  mumbai: [19.0760, 72.8777],
  delhi: [28.6139, 77.2090],
  bangalore: [12.9716, 77.5946],
  bengaluru: [12.9716, 77.5946],
  hyderabad: [17.3850, 78.4867],
  ahmedabad: [23.0225, 72.5714],
  chennai: [13.0827, 80.2707],
  kolkata: [22.5726, 88.3639],
  pune: [18.5204, 73.8567],
  jaipur: [26.9124, 75.7873],
  surat: [21.1702, 72.8311],
  lucknow: [26.8467, 80.9462],
  kanpur: [26.4499, 80.3319],
  nagpur: [21.1458, 79.0882],
  indore: [22.7196, 75.8577],
  thane: [19.2183, 72.9781],
  bhopal: [23.2599, 77.4126],
  visakhapatnam: [17.6868, 83.2185],
  patna: [25.5941, 85.1376],
  vadodara: [22.3072, 73.1812],
  ghaziabad: [28.6692, 77.4538],
  ludhiana: [30.9010, 75.8573],
  agra: [27.1767, 78.0081],
  nashik: [19.9975, 73.7898],
  faridabad: [28.4089, 77.3178],
  meerut: [28.9845, 77.7064],
  rajkot: [22.3039, 70.8022],
  kalyan: [19.2403, 73.1305],
  vasai: [19.3919, 72.8397],
  varanasi: [25.3176, 82.9739],
  srinagar: [34.0837, 74.7973],
  aurangabad: [19.8762, 75.3433],
  dhanbad: [23.7957, 86.4304],
  amritsar: [31.6340, 74.8723],
  "navi mumbai": [19.0330, 73.0297],
  allahabad: [25.4358, 81.8463],
  prayagraj: [25.4358, 81.8463],
  ranchi: [23.3441, 85.3096],
  howrah: [22.5958, 88.2636],
  coimbatore: [11.0168, 76.9558],
  jabalpur: [22.1563, 79.9325],
  gwalior: [26.2183, 78.1828],
  vijayawada: [16.5062, 80.6480],
  jodhpur: [26.2389, 73.0243],
  madurai: [9.9252, 78.1198],
  raipur: [21.2514, 81.6296],
  kota: [25.2138, 75.8648],
  guwahati: [26.1445, 91.7362],
  chandigarh: [30.7333, 76.7794],
  solapur: [17.6599, 75.9064],
  hubli: [15.3647, 75.1240],
  dharwad: [15.4589, 75.0078],
  bareilly: [28.3670, 79.4304],
  moradabad: [28.8345, 78.7844],
  mysore: [12.2958, 76.6394],
  gurgaon: [28.4595, 77.0266],
  aligarh: [27.8974, 78.0880],
  jalandhar: [31.3260, 75.5762],
  tiruchirappalli: [10.7905, 78.7047],
  bhubaneswar: [20.2961, 85.8245],
  salem: [11.6643, 78.1460],
  warangal: [17.9689, 79.5941],
  guntur: [16.3067, 80.4365],
  gorakhpur: [26.7606, 83.3731],
  jhansi: [25.4484, 78.5685],
  noida: [28.5355, 77.3910],
};

const DEFAULT_CENTER = [20.5937, 78.9629]; // Center of India
const DEFAULT_ZOOM = 5;

const InteractiveMap = ({ cars }) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersGroupRef = useRef(null);
  const navigate = useNavigate();
  const currency = import.meta.env.VITE_CURRENCY || "₹";

  const [geocodedCars, setGeocodedCars] = useState([]);
  const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER);
  const [mapZoom, setMapZoom] = useState(DEFAULT_ZOOM);

  // 1. Process and geocode car locations
  useEffect(() => {
    let active = true;

    const geocodeAll = async () => {
      const results = [];
      const cityUsageCount = {};

      for (const car of cars) {
        if (!car.location) continue;
        const normalizedCity = car.location.trim().toLowerCase();
        
        let coords = null;
        if (CITY_COORDINATES[normalizedCity]) {
          coords = [...CITY_COORDINATES[normalizedCity]];
        } else {
          // Dynamic Geocoding fallback with Nominatim
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(car.location)}&limit=1`
            );
            const data = await res.json();
            if (data && data.length > 0) {
              coords = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
            }
          } catch (e) {
            // Geocoding fallback failed silently
          }
        }

        if (coords) {
          // Add random jitter to scatter pins slightly if multiple cars are in the same city
          if (!cityUsageCount[normalizedCity]) {
            cityUsageCount[normalizedCity] = 0;
          }
          const index = cityUsageCount[normalizedCity]++;
          if (index > 0) {
            // Apply slight offset
            const angle = index * 1.2;
            const radius = 0.008 * index;
            coords[0] += Math.sin(angle) * radius;
            coords[1] += Math.cos(angle) * radius;
          }

          results.push({
            ...car,
            coordinates: coords
          });
        }
      }

      if (active) {
        setGeocodedCars(results);

        // Adjust map center based on filtered cars location
        if (results.length > 0) {
          // Average latitude & longitude for center
          const totalCoords = results.reduce(
            (acc, curr) => [acc[0] + curr.coordinates[0], acc[1] + curr.coordinates[1]],
            [0, 0]
          );
          const avgCenter = [totalCoords[0] / results.length, totalCoords[1] / results.length];
          setMapCenter(avgCenter);
          setMapZoom(results.length === 1 ? 12 : 7);
        } else {
          setMapCenter(DEFAULT_CENTER);
          setMapZoom(DEFAULT_ZOOM);
        }
      }
    };

    geocodeAll();

    return () => {
      active = false;
    };
  }, [cars]);

  // 2. Initialize map instance
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (typeof window === "undefined" || !window.L) return;

    const L = window.L;

    // Create map instance
    const map = L.map(mapContainerRef.current, {
      center: mapCenter,
      zoom: mapZoom,
      zoomControl: false, // Custom position below
    });

    L.control.zoom({ position: "bottomright" }).addTo(map);

    // Premium light map tiles
    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 20,
    }).addTo(map);

    // Group for markers
    const markersGroup = L.layerGroup().addTo(map);

    mapInstanceRef.current = map;
    markersGroupRef.current = markersGroup;

    // Fix map render sizing issue
    setTimeout(() => {
      map.invalidateSize();
    }, 100);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markersGroupRef.current = null;
    };
  }, []);

  // 3. Update map center/zoom when state coordinates changes
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(mapCenter, mapZoom);
    }
  }, [mapCenter, mapZoom]);

  // 4. Update markers on the map when geocodedCars changes
  useEffect(() => {
    if (!mapInstanceRef.current || !markersGroupRef.current) return;
    if (typeof window === "undefined" || !window.L) return;

    const L = window.L;
    const markersGroup = markersGroupRef.current;
    
    // Clear old markers
    markersGroup.clearLayers();

    // Create markers for each geocoded car
    geocodedCars.forEach((car) => {
      const priceText = `${currency}${car.pricePerDay}`;
      
      const customIcon = L.divIcon({
        html: `
          <div class="flex items-center justify-center px-3 py-1.5 rounded-full bg-primary text-white font-semibold text-xs shadow-md border-2 border-white hover:scale-115 transition-transform duration-200 cursor-pointer">
            ${priceText}
          </div>
        `,
        className: "custom-price-marker",
        iconSize: [60, 30],
        iconAnchor: [30, 15]
      });

      const marker = L.marker(car.coordinates, { icon: customIcon }).addTo(markersGroup);

      const popupHtml = `
        <div class="w-60 p-0 overflow-hidden rounded-xl font-sans bg-white">
          <img src="${car.image}" alt="${car.brand} ${car.model}" class="w-full h-32 object-cover" />
          <div class="p-3">
            <div class="flex items-center justify-between mb-1">
              <span class="text-xs uppercase font-semibold text-primary px-2 py-0.5 rounded bg-primary/10">
                ${car.category}
              </span>
              <div class="flex items-center text-yellow-500 text-xs font-semibold gap-0.5">
                ★ ${car.rating ? car.rating.toFixed(1) : "N/A"}
              </div>
            </div>
            <h3 class="text-sm font-bold text-gray-800">${car.brand} ${car.model}</h3>
            <p class="text-xs text-gray-500 mb-2">📍 ${car.location}</p>
            <div class="flex items-center justify-between pt-2 border-t border-gray-100">
              <div>
                <span class="text-xs text-gray-400">per day</span>
                <p class="text-sm font-bold text-gray-900">${currency}${car.pricePerDay}</p>
              </div>
              <button 
                id="popup-btn-${car._id}" 
                class="px-3 py-1.5 bg-primary text-white rounded-md text-xs font-medium hover:bg-primary/95 transition-colors cursor-pointer"
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, {
        maxWidth: 270,
        className: "custom-leaflet-popup"
      });

      marker.on("popupopen", () => {
        const btn = document.getElementById(`popup-btn-${car._id}`);
        if (btn) {
          btn.addEventListener("click", () => {
            navigate(`/car/${car._id}`);
          });
        }
      });
    });

  }, [geocodedCars, currency, navigate]);

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-md border border-borderColor bg-gray-100">
      {cars.length > 0 && geocodedCars.length === 0 && (
        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-[1000] flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-gray-600">Geocoding vehicle locations...</p>
        </div>
      )}

      <div ref={mapContainerRef} className="w-full h-full z-10" />

      <style>{`
        .custom-price-marker {
          background: transparent !important;
          border: none !important;
        }
        .leaflet-popup-content-wrapper {
          border-radius: 12px !important;
          padding: 0 !important;
          overflow: hidden;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
        }
        .leaflet-popup-content {
          margin: 0 !important;
        }
        .leaflet-popup-close-button {
          color: white !important;
          font-size: 16px !important;
          top: 8px !important;
          right: 8px !important;
          z-index: 100;
          background-color: rgba(0,0,0,0.4) !important;
          border-radius: 50% !important;
          width: 22px !important;
          height: 22px !important;
          line-height: 20px !important;
          text-align: center !important;
        }
        .leaflet-popup-close-button:hover {
          background-color: rgba(0,0,0,0.6) !important;
        }
      `}</style>
    </div>
  );
};

export default InteractiveMap;
