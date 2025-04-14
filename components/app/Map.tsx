'use client';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

export default function Map() {
  return (
    <div className='w-full h-[250px] sm:h-[300px] md:h-[400px] rounded-xl overflow-hidden shadow-md'>
      <MapContainer
        center={[10.762622, 106.660172]}
        zoom={14}
        className='w-full h-full'
      >
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        <Marker position={[10.762622, 106.660172]}>
          <Popup>Vị trí của bạn</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
