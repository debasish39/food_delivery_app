import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import LocationMap from "../components/LocationMap";

export default function Location({
  onClose,
}) {

  const [query, setQuery] = useState("");
const navigate = useNavigate();
  const [results, setResults] = useState([]);

  const [loading, setLoading] = useState(false);

  const [position, setPosition] = useState({
    lat: 20.2961,
    lng: 85.8245,
  });
const recentLocations =
  JSON.parse(
    localStorage.getItem(
      "recentLocations"
    ) || "[]"
  );


  // Search Location

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
          limit: 5,
        },
      }
    );


setResults(res.data);  

  } catch (error) {
    console.error(error);
    toast.error("Search failed");
  }
};
  // Current Location

  const getCurrentLocation = () => {

    setLoading(true);

   navigator.geolocation.getCurrentPosition(
  ({ coords }) => {

    setPosition({
      lat: coords.latitude,
      lng: coords.longitude,
    });

    setQuery(
  `${coords.latitude}, ${coords.longitude}`
);

    toast.success(
      "Location Found"
    );
    if (onClose) {
  onClose();
}

    setLoading(false);
  },
  () => {
    toast.error(
      "Location Permission Denied"
    );
    setLoading(false);
  }
);
  };

  // Select Search Result
const selectLocation = (place) => {

  
  setPosition({
    lat: parseFloat(place.lat),
    lng: parseFloat(place.lon),
  });

  
setQuery(place.display_name);
  setResults([]);
};
  // Confirm Location

const confirmLocation = async () => {
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

    const address = res.data.address;

setQuery(res.data.display_name);

  const location = {
  area:
    address?.suburb ||
    address?.neighbourhood ||
    address?.quarter ||
    "",
 city:
    address?.city ||
    address?.town ||
    address?.village ||
    "",

  landmark:
    address?.road ||
    "",

  pincode:
    address?.postcode ||
    "",

address: res.data.display_name,

  lat: position.lat,
  lng: position.lng,
};

    localStorage.setItem(
      "deliveryLocation",
      JSON.stringify(location)
    );

    localStorage.setItem(
      "recentLocations",
      JSON.stringify([location])
    );

    window.dispatchEvent(
      new Event("locationChanged")
    );



toast.success("Location Saved");

if (onClose) {
  onClose();
}



  } catch (error) {
  console.error("Confirm Location Error:", error);
  console.error(error?.response?.data);

  toast.error("Failed to save location");
}
};

  return (
    <div className="max-w-4xl mx-auto p-5">
{recentLocations.length > 0 && (

  <div className="mb-5">
    <div className="space-y-2">

    {recentLocations[0] && (

  <div className="mb-5">

    <h2 className="font-semibold mb-3">
      Recent Location
    </h2>

    <div className="space-y-2">

      <div
        onClick={() => {

          setQuery(
            recentLocations[0].address
          );

          setPosition({
            lat: recentLocations[0].lat,
            lng: recentLocations[0].lng,
          });

        }}
        className="p-3 border rounded-lg cursor-pointer hover:bg-gray-100"
      >

        <div className="flex gap-3">

          <span>📍</span>

          <div>

            <h3 className="font-medium">
              {recentLocations[0].city}
            </h3>

            <p className="text-sm text-gray-500">
              {recentLocations[0].address}
            </p>

          </div>

        </div>

      </div>

    </div>

  </div>

)}

    </div>

  </div>

)}
      {/* Search */}

      <input
        type="text"
        value={query}
        placeholder="Enter pincode, area, locality or landmark"
        onChange={(e) =>
          handleSearch(
            e.target.value
          )
        }
        className="w-full border p-4 rounded-xl"
      />

      {/* Search Results */}

     {results.length > 0 && (

  <div className="mt-3 bg-white rounded-xl shadow-lg overflow-hidden">

    {results.map((place) => (
  <div
    key={place.place_id}
    onClick={() =>
      selectLocation(place)
    }
    className="p-4 border-b cursor-pointer hover:bg-orange-50"
  >
    <h3 className="font-medium">
      {place.display_name}
    </h3>
  </div>
))}

  </div>

)}

      {/* Current Location */}

      <button
        onClick={
          getCurrentLocation
        }
        className="w-full mt-4 bg-orange-500 text-white py-3 rounded-xl"
      >
        {loading
          ? "Detecting..."
          : "📍 Use Current Location"}
      </button>

      {/* Map */}

      <div className="mt-6">

        <LocationMap
          position={
            position
          }
          setPosition={
            setPosition
          }
        />

      </div>

      {/* Location Details */}

      <div className="mt-4 bg-gray-100 p-4 rounded-lg">

        <p>
          Latitude:
          {" "}
          {position.lat}
        </p>

        <p>
          Longitude:
          {" "}
          {position.lng}
        </p>

      </div>
<div className="mt-4 bg-white shadow rounded-xl p-4">

  <h3 className="font-semibold mb-2">
    Selected Location
  </h3>

  <p className="text-gray-600">
    {query ||
      "Select a location"}
  </p>

</div>
      {/* Confirm */}

      <button
        onClick={
          confirmLocation
        }
        className="w-full mt-4 bg-green-600 text-white py-3 rounded-xl"
      >
        Confirm Delivery Location
      </button>

    </div>
  );
}