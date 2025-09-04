import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default marker icon issue in React
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl,
  shadowUrl: iconShadow,
});
L.Marker.prototype.options.icon = DefaultIcon;

function MapComponent() {
  return (
    <MapContainer
      center={[28.6139, 77.209]} // Delhi coordinates
      zoom={10}
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors"
      />

      <Marker position={[28.6139, 77.209]}>
        <Popup>📍 New Delhi - Example Marker</Popup>
      </Marker>
    </MapContainer>
  );
}

export default MapComponent;
