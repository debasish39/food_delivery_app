import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaTimes } from "react-icons/fa";
import LocationMap from "../components/LocationMap";

export default function Location({ onClose }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [detecting, setDetecting] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const [position, setPosition] = useState({
    lat: 20.2961,
    lng: 85.8245,
  });

  const [selectedLocation, setSelectedLocation] = useState(null);
  const [recentLocations, setRecentLocations] = useState([]);

  /* LOAD RECENT LOCATIONS */
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("recentLocations") || "[]");
    setRecentLocations(saved);
  }, []);

  const saveToRecent = (location) => {
    const prev = JSON.parse(localStorage.getItem("recentLocations") || "[]");

    const filtered = prev.filter(
      (item) => item.address !== location.address
    );

    const updated = [location, ...filtered].slice(0, 5);

    localStorage.setItem("recentLocations", JSON.stringify(updated));
    setRecentLocations(updated);
  };
const removeRecentLocation = (index) => {
  const prev = JSON.parse(localStorage.getItem("recentLocations") || "[]");

  const updated = prev.filter((_, i) => i !== index);

  localStorage.setItem("recentLocations", JSON.stringify(updated));
  setRecentLocations(updated);
};
  /* SEARCH */
  const handleSearch = async (value) => {
    setQuery(value);

    if (value.trim().length < 2) {
      setResults([]);
      return;
    }

    try {
      const res = await axios.get(
        "https://nominatim.openstreetmap.org/search",
        {
          params: {
            q: value,
            format: "json",
            addressdetails: 1,
            countrycodes: "in",
            "accept-language": "en",
            limit: 8,
          },
        }
      );

      setResults(res.data);
    } catch {
      toast.error("Search failed");
    }
  };

  /* SELECT FROM SEARCH */
  const selectLocation = (place) => {
    const loc = {
      address: place.display_name,
      lat: parseFloat(place.lat),
      lng: parseFloat(place.lon),
    };

    setPosition(loc);
    setQuery(place.display_name);
    setSelectedLocation(loc);
    setResults([]);
  };

  /* GPS */
  const getCurrentLocation = () => {
    setDetecting(true);

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const pos = {
          lat: coords.latitude,
          lng: coords.longitude,
        };

        const loc = {
          address: "Current Location (GPS)",
          lat: pos.lat,
          lng: pos.lng,
        };

        setPosition(pos);
        setQuery("Current Location");
        setSelectedLocation(loc);

        toast.success("Location detected");
        setDetecting(false);
      },
      () => {
        toast.error("Location permission denied");
        setDetecting(false);
      }
    );
  };

  /* CONFIRM LOCATION */
  const confirmLocation = async () => {
    if (!position) return toast.error("Select a location first");

    setConfirming(true);

    try {
      const res = await axios.get(
        "https://nominatim.openstreetmap.org/reverse",
        {
          params: {
            lat: position.lat,
            lon: position.lng,
            format: "json",
            addressdetails: 1,
          },
        }
      );

      const address = res.data;

      const location = {
        address: address.display_name,
        city:
          address.address?.city ||
          address.address?.town ||
          address.address?.village ||
          "",
        area:
          address.address?.suburb ||
          address.address?.neighbourhood ||
          "",
        pincode: address.address?.postcode || "",
        lat: position.lat,
        lng: position.lng,
      };

      setSelectedLocation(location);

      localStorage.setItem("deliveryLocation", JSON.stringify(location));
      window.dispatchEvent(new Event("locationChanged"));

      /* SAVE TO RECENT */
      saveToRecent(location);

      toast.success("Location saved!");
      onClose?.();
    } catch {
      toast.error("Failed to save location");
    } finally {
      setConfirming(false);
    }
  };

  /* USE RECENT LOCATION */
  const useRecent = (loc) => {
    setSelectedLocation(loc);
    setQuery(loc.address);
    setPosition({ lat: loc.lat, lng: loc.lng });
  };

  return (
    <div className="loc-page">
      <style>{`
        .loc-page{
          height:69vh;
          width:100%;
          position:relative;
          background:#0b0b0f;
          overflow:hidden;
          font-family:system-ui;
          color:#fff;
        }

        .loc-map{ height:100%; width:100%; }

        .loc-search{
          position:absolute;
          top:16px;
          left:16px;
          right:16px;
          z-index:50;
          background:rgba(20,20,20,.7);
          backdrop-filter:blur(16px);
          border:1px solid rgba(255,255,255,.08);
          border-radius:16px;
          display:flex;
          align-items:center;
          padding:10px 12px;
        }

        .loc-search input{
          flex:1;
          background:transparent;
          border:none;
          outline:none;
          color:#fff;
          padding-left:8px;
        }

        .loc-results{
          position:absolute;
          top:70px;
          left:16px;
          right:16px;
          background:#111;
          border-radius:14px;
          overflow:hidden;
          z-index:60;
        }

        .loc-item{
          padding:12px;
          cursor:pointer;
          border-bottom:1px solid rgba(255,255,255,.05);
        }

        .loc-item:hover{ background:rgba(255,255,255,.05); }

        .gps-btn{
          position:absolute;
          bottom:220px;
          right:16px;
          width:56px;
          height:56px;
          border-radius:50%;
          border:none;
          background:#fff;
          color:#ff6a00;
          font-size:20px;
          z-index:40;
        }

        .bottom-sheet{
          position:absolute;
          bottom:0;
          left:0;
          right:0;
          background:rgba(20,20,20,.95);
          backdrop-filter:blur(20px);
          border-radius:24px 24px 0 0;
          padding:16px;
          z-index:80;
        }

        .recent{
          margin-bottom:10px;
        }

        .recent-item{
          font-size:12px;
          padding:6px 10px;
          background:rgba(255,255,255,.05);
          margin:4px 0;
          border-radius:10px;
          cursor:pointer;
        }

        .addr{
          font-size:.9rem;
          color:#ccc;
          margin-top:2px;
        }

        .confirm-btn{
          width:100%;
          padding:9px;
          border:none;
          border-radius:14px;
          font-weight:700;
          color:#fff;
          background:linear-gradient(135deg,#ff6a00,#ff3d00);
        }
      `}</style>

      {/* MAP */}
      <div className="loc-map">
        <LocationMap position={position} setPosition={setPosition} />
      </div>

      {/* SEARCH */}
      <div className="loc-search">
        <i className="ti ti-search" />
        <input
          value={query}
          placeholder="Search location..."
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      {/* RESULTS */}
      {results.length > 0 && (
        <div className="loc-results">
          {results.map((place) => (
            <div
              key={place.place_id}
              className="loc-item"
              onClick={() => selectLocation(place)}
            >
              {place.display_name}
            </div>
          ))}
        </div>
      )}

      {/* GPS */}
      <button className="gps-btn" onClick={getCurrentLocation}>
        📍
      </button>

      {/* BOTTOM SHEET */}
      <div className="bottom-sheet">

        {/* RECENT LOCATIONS */}
        {recentLocations.length > 0 && (
          <div className="recent">
            <b style={{ fontSize: "12px", color: "#aaa" }}>
              Recent Locations
            </b>

            {recentLocations.map((loc, i) => (
  <div
    key={i}
    className="recent-item"
    onClick={() => useRecent(loc)}
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "10px",
    }}
  >
    <div className="text-xs" style={{ flex: 1 }}>
      {loc.address}
    </div>

    {/* ❌ Delete Button */}
    <button
      onClick={(e) => {
        e.stopPropagation(); // IMPORTANT (prevents selecting location)
        removeRecentLocation(i);
      }}
      style={{
        background: "transparent",
        border: "none",
        color: "#ff4d4f",
        fontSize: "16px",
        cursor: "pointer",
        lineHeight: 1,
      }}
      title="Remove"
    >
     <FaTimes />
    </button>
  </div>
))}
          </div>
        )}

        <div className="addr">
          <b>Selected Location</b>
          <br />
          {selectedLocation?.address || "Move pin or search location"}
        </div>

        <button
          className="confirm-btn mt-4"
          disabled={confirming || !position}
          onClick={confirmLocation}
        >
          {confirming ? "Saving..." : "Confirm Location"}
        </button>
      </div>
    </div>
  );
}