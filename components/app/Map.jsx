'use client';

import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import 'leaflet-geosearch/dist/geosearch.css';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';

// Hook to force map refresh
const MapRefresher = () => {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();
  }, [map]);
  return null;
};

// Hook to add search control
const SearchControl = () => {
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
    return () => map.removeControl(searchControl);
  }, [map]);

  return null;
};

const Map = ({ center = [10.76, 106.66], zoom = 13 }) => {
  return (
    <div className='w-full h-[500px] relative rounded-lg overflow-hidden'>
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
        <SearchControl />
      </MapContainer>
    </div>
  );
};

export default Map;
