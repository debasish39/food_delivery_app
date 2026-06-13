import Navbar from "./components/Navbar";
import AppRoutes from "./routes/AppRoutes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/pagination";
import { useEffect, useState } from "react";
function App() {
  const [appLoading, setAppLoading] = useState(true);
  const [locationChecked, setLocationChecked] = useState(false);
  useEffect(() => {
  const timer = setTimeout(() => {
    setAppLoading(false);
  }, 1500); // ⏱ splash duration

  return () => clearTimeout(timer);
}, []);
useEffect(() => {
  if (appLoading) return;

  const stored = JSON.parse(localStorage.getItem("deliveryLocation") || "{}");

  if (stored?.lat && stored?.lng) {
    setLocationChecked(true);
    return;
  }

  if (!navigator.geolocation) {
    setLocationChecked(true);
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords;

      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
        );

        const data = await res.json();

        const locationData = {
          lat: latitude,
          lng: longitude,
          city:
            data.address?.city ||
            data.address?.town ||
            data.address?.village ||
            "Unknown",
          address: data.display_name || "",
        };

        localStorage.setItem("deliveryLocation", JSON.stringify(locationData));
        window.dispatchEvent(new Event("locationChanged"));
      } catch (err) {
        console.log("Reverse geocode failed", err);
      } finally {
        setLocationChecked(true);
      }
    },
    (err) => {
      console.log("Location denied:", err.message);
      setLocationChecked(true);
    },
    {
      enableHighAccuracy: true,
      timeout: 8000,
      maximumAge: 0,
    }
  );
}, [appLoading]);
if (appLoading || !locationChecked) {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#0f0f12] text-white">
      <div className="w-12 h-12 border-4 border-orange-400 border-t-transparent rounded-full animate-spin mb-4" />

      <h1 className="text-xl font-bold tracking-wide">
        Feast<span className="text-orange-400">Run</span>
      </h1>

      <p className="text-white/40 text-sm mt-2">
        Detecting your location...
      </p>
    </div>
  );
}
  return (
    <div className="app-root">

      <ToastContainer
        position="top-right"
        autoClose={300}
        hideProgressBar={true}
        newestOnTop={true}
        draggable
        pauseOnHover
        theme="transparent"
          closeButton={false}

      />

      <Navbar />

      <main className="main-content overflow-x-hidden custom-scrollbar "> 
        <AppRoutes />
      </main>

    </div>
  );
}

export default App;