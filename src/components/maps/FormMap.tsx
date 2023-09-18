import './styles.css';
import 'leaflet/dist/leaflet.css';

import { MapContainer, TileLayer } from 'react-leaflet';

export interface FormMapProps {}

// eslint-disable-next-line no-empty-pattern
export const FormMap = ({}: FormMapProps) => {
  return (
    <MapContainer center={[37.58, -119.4179]} zoom={6}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    </MapContainer>
  );
};
