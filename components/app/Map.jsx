'use client';

import L from 'leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import 'leaflet-geosearch/dist/geosearch.css';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvent,
} from 'react-leaflet';

// Default icon fix for React-Leaflet + Webpack
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

const defaultIcon = L.icon({
  iconUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl,
  shadowSize: [41, 41],
});

const MapRefresher = () => {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();
  }, [map]);
  return null;
};

const SearchControl = ({ onLocationSelect }) => {
  const map = useMap();

  useEffect(() => {
    const provider = new OpenStreetMapProvider();

    const searchControl = new GeoSearchControl({
      provider,
      style: 'bar',
      showMarker: true,
      showPopup: true,
      autoClose: true,
      retainZoomLevel: false,
      animateZoom: true,
      keepResult: true,
      searchLabel: 'Tìm địa điểm...',
    });

    map.addControl(searchControl);

    map.on('geosearch/showlocation', (result) => {
      const lat = result.location.y;
      const lng = result.location.x;
      if (onLocationSelect) onLocationSelect({ lat, lng });
    });

    return () => {
      map.removeControl(searchControl);
    };
  }, [map, onLocationSelect]);

  return null;
};

const MapClickHandler = ({ onLocationSelect }) => {
  useMapEvent('dblclick', (e) => {
    const { lat, lng } = e.latlng;
    if (onLocationSelect) onLocationSelect({ lat, lng });
  });

  return null;
};

const Map = ({
  center = [10.76, 106.66],
  zoom = 13,
  className = '',
  onLocationSelect,
  latitude,
  longitude,
}) => {
  const [selectedPosition, setSelectedPosition] = useState(null);

  const handleLocationSelect = (coords) => {
    setSelectedPosition(coords);
    if (onLocationSelect) onLocationSelect(coords);
  };

  // Update marker position when latitude/longitude props change
  useEffect(() => {
    if (latitude && longitude) {
      setSelectedPosition({ lat: latitude, lng: longitude });
    }
    // console.log(latitude, longitude);
  }, [latitude, longitude]);

  return (
    <div className={`relative z-0 w-full ${className}`}>
      <MapContainer
        center={selectedPosition || center} // Use selectedPosition for centering
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
        doubleClickZoom={false}
      >
        <TileLayer
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        {/* <Marker position={center} icon={defaultIcon} /> */}
        <MapRefresher />
        <SearchControl onLocationSelect={handleLocationSelect} />
        <MapClickHandler onLocationSelect={handleLocationSelect} />

        {/* Render marker */}
        {selectedPosition && (
          <Marker
            position={[selectedPosition.lat, selectedPosition.lng]}
            icon={defaultIcon}
          />
        )}
      </MapContainer>
    </div>
  );
};

export default Map;
