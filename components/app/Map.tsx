'use client';
import React, { useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { LatLngTuple } from 'leaflet';

// Hook to force map refresh
const MapRefresher = () => {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize(); // Forces tile re-render on mount/resize
  }, [map]);
  return null;
};

interface MapProps {
  center?: LatLngTuple;
  zoom?: number;
}

const Map: React.FC<MapProps> = ({ center = [10.76, 106.66], zoom = 13 }) => {
  return (
    <div className='w-full h-[500px]'>
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        <MapRefresher />
      </MapContainer>
    </div>
  );
};

export default Map;
