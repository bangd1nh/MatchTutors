import { Marker, Tooltip } from "react-leaflet";
import L, { LatLngExpression } from "leaflet";

interface Place {
    name: string;
    position: LatLngExpression;
    address: string;
    subject: string;
    level: string;
    avatarUrl: string;
    rating: number;
}

const CustomMarker = ({ place }: { place: Place }) => {
    const icon = L.divIcon({
        className: 'custom-marker',
        html: `
            <div class="relative flex items-center justify-center">
                <img src="${place.avatarUrl}" class="w-12 h-12 rounded-full border-2 border-white shadow-md">
                <div class="absolute bottom-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
        `,
        iconSize: [48, 48],
        iconAnchor: [24, 48],
    });

    return (
        <Marker position={place.position} icon={icon}>
            <Tooltip>
                <div>
                    <h3 className="font-bold">{place.name}</h3>
                    <p>{place.address}</p>
                    <p>{place.subject} - {place.level}</p>
                    <p>Rating: {place.rating}</p>
                </div>
            </Tooltip>
        </Marker>
    );
};

export default CustomMarker;
