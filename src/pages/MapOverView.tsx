import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { LatLngExpression } from "leaflet";

interface Place {
    name: string;
    position: LatLngExpression;
}

const defaultIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: "https://unpkg.com/leaflet/dist/images/marker-shadow.png",
    shadowSize: [41, 41],
});

const MapOverView = () => {
    const position: [number, number] = [16.047079, 108.20623];
    const places: Place[] = [
        { name: "Bà Nà Hills", position: [15.9975, 107.9882] },
        { name: "Ngũ Hành Sơn", position: [15.975, 108.2583] },
        { name: "Cầu Rồng", position: [16.0614, 108.227] },
        { name: "Biển Mỹ Khê", position: [16.0678, 108.2498] },
    ];

    return (
        <MapContainer
            center={position}
            zoom={13}
            scrollWheelZoom={false}
            style={{ height: "100vh", width: "100%" }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position}>
                <Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
            </Marker>
            {places.map((place, index) => (
                <Marker
                    key={index}
                    position={place.position}
                    icon={defaultIcon}
                >
                    <Popup>{place.name}</Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default MapOverView;
