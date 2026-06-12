import { GoogleMap, useLoadScript } from "@react-google-maps/api";
import { useEffect, useRef, useState } from "react";

const containerStyle = {
  width: "100%",
  height: "100%",
};

/* 🎨 Modern dark map style (Uber / Zepto style) */
const mapStyle = [
  {
    elementType: "geometry",
    stylers: [{ color: "#0f0f10" }],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [{ color: "#0f0f10" }],
  },
  {
    elementType: "labels.text.fill",
    stylers: [{ color: "#6b7280" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#1f1f22" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#0a0a0a" }],
  },
];

function DraggableMarker({ map, position, setPosition }) {
  const markerRef = useRef(null);

  useEffect(() => {
    if (!map || !window.google) return;

    // create marker only once
    if (!markerRef.current) {
      markerRef.current = new window.google.maps.Marker({
        map,
        position,
        draggable: true,
        animation: window.google.maps.Animation.DROP,
      });

      markerRef.current.addListener("dragend", (event) => {
        const newPos = {
          lat: event.latLng.lat(),
          lng: event.latLng.lng(),
        };

        setPosition(newPos);
      });
    }

    // update position smoothly
    markerRef.current.setPosition(position);
  }, [map]);

  return null;
}

export default function LocationMap({ position, setPosition }) {
  const mapRef = useRef(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  /* 🚀 Smooth map movement when position changes */
  useEffect(() => {
    if (mapRef.current && position) {
      mapRef.current.panTo(position);
    }
  }, [position]);

  if (loadError) {
    return (
      <div className="flex items-center justify-center h-full text-red-500">
        Failed to load map
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-full">
        Loading map...
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={position}
      zoom={16}
      onLoad={(mapInstance) => {
        mapRef.current = mapInstance;
      }}
      options={{
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
        zoomControl: true,
        gestureHandling: "greedy",

        // 🎨 modern dark UI
        styles: mapStyle,

        // 🚫 remove hybrid clutter
        mapTypeId: "roadmap",

        disableDefaultUI: false,
      }}
    >
      <DraggableMarker
        map={mapRef.current}
        position={position}
        setPosition={setPosition}
      />
    </GoogleMap>
  );
}