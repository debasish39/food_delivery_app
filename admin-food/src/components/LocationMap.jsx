import {
  GoogleMap,
  useLoadScript,
} from "@react-google-maps/api";

import {
  useEffect,
  useRef,
  useState,
} from "react";

const containerStyle = {
  width: "100%",
  height: "450px",
};

function DraggableMarker({
  map,
  position,
  setPosition,
}) {
  const markerRef = useRef(null);

  useEffect(() => {
    if (!map || !window.google) return;

    // Create marker once
    if (!markerRef.current) {
      markerRef.current =
        new window.google.maps.Marker({
          map,
          position,
          draggable: true,
        });

      markerRef.current.addListener(
        "dragend",
        (event) => {
          setPosition({
            lat: event.latLng.lat(),
            lng: event.latLng.lng(),
          });
        }
      );
    }

    // Update marker position when state changes
    markerRef.current.setPosition(
      position
    );

    return () => {
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }
    };
  }, [map, position, setPosition]);

  return null;
}

export default function LocationMap({
  position,
  setPosition,
}) {
  const [map, setMap] =
    useState(null);

  const { isLoaded, loadError } =
    useLoadScript({
      googleMapsApiKey:
        import.meta.env
          .VITE_GOOGLE_MAPS_API_KEY,
    });

  if (loadError) {
    return (
      <div className="h-[450px] flex items-center justify-center text-red-500">
        Failed to load Google Maps
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="h-[450px] flex items-center justify-center">
        Loading Map...
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={
        containerStyle
      }
      center={position}
      zoom={15}
      onLoad={(mapInstance) =>
        setMap(mapInstance)
      }
      options={{
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
      }}
    >
      {map && (
        <DraggableMarker
          map={map}
          position={position}
          setPosition={
            setPosition
          }
        />
      )}
    </GoogleMap>
  );
}