import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { LatLngExpression } from "leaflet";
import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import CustomMarker from "@/components/common/CustomMarker";

interface Place {
    name: string;
    position: LatLngExpression;
    address: string;
    subject: string;
    level: string;
    avatarUrl: string;
    rating: number;
}

const ChangeView = ({
    center,
    zoom,
}: {
    center: LatLngExpression;
    zoom: number;
}) => {
    const map = useMap();
    map.setView(center, zoom);
    return null;
};

const MapOverView = () => {
    const [position, setPosition] = useState<LatLngExpression>([
        16.047079, 108.20623,
    ]);
    const [searchQuery, setSearchQuery] = useState("");
    const [subjectFilter, setSubjectFilter] = useState("all");
    const [levelFilter, setLevelFilter] = useState("all");

    const places: Place[] = [
        {
            name: "Nguyễn Văn A",
            position: [16.0544, 108.2022],
            address: "Hải Châu, Đà Nẵng",
            subject: "Toán",
            level: "THPT",
            avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg",
            rating: 4.8,
        },
        {
            name: "Trần Thị B",
            position: [16.0704, 108.2245],
            address: "Sơn Trà, Đà Nẵng",
            subject: "Tiếng Anh",
            level: "THCS",
            avatarUrl: "https://randomuser.me/api/portraits/women/44.jpg",
            rating: 4.6,
        },
        {
            name: "Lê Văn C",
            position: [16.0471, 108.2062],
            address: "Ngũ Hành Sơn, Đà Nẵng",
            subject: "Vật Lý",
            level: "THPT",
            avatarUrl: "https://randomuser.me/api/portraits/men/65.jpg",
            rating: 4.9,
        },
        {
            name: "Phạm Thị D",
            position: [16.0355, 108.211],
            address: "Hòa Vang, Đà Nẵng",
            subject: "Hóa Học",
            level: "THCS",
            avatarUrl: "https://randomuser.me/api/portraits/women/68.jpg",
            rating: 4.7,
        },
        {
            name: "Đỗ Văn E",
            position: [16.0614, 108.227],
            address: "Thanh Khê, Đà Nẵng",
            subject: "Tin Học",
            level: "THPT",
            avatarUrl: "https://randomuser.me/api/portraits/men/77.jpg",
            rating: 4.5,
        },
    ];

    const filteredPlaces = useMemo(() => {
        return places.filter((place) => {
            const searchLower = searchQuery.toLowerCase();
            const matchesSearch =
                place.name.toLowerCase().includes(searchLower) ||
                place.address.toLowerCase().includes(searchLower) ||
                place.subject.toLowerCase().includes(searchLower) ||
                place.level.toLowerCase().includes(searchLower);

            const matchesSubject =
                subjectFilter === "all" || place.subject === subjectFilter;
            const matchesLevel =
                levelFilter === "all" || place.level === levelFilter;

            return matchesSearch && matchesSubject && matchesLevel;
        });
    }, [searchQuery, subjectFilter, levelFilter, places]);

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                height: "100vh",
            }}
        >
            <div
                style={{
                    padding: "10px",
                    display: "flex",
                    gap: "10px",
                    alignItems: "center",
                    borderBottom: "1px solid #ccc",
                }}
            >
                <Input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, address, subject..."
                    className="w-1/3"
                />
                <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by subject" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Subjects</SelectItem>
                        <SelectItem value="Toán">Toán</SelectItem>
                        <SelectItem value="Tiếng Anh">Tiếng Anh</SelectItem>
                        <SelectItem value="Vật Lý">Vật Lý</SelectItem>
                        <SelectItem value="Hóa Học">Hóa Học</SelectItem>
                        <SelectItem value="Tin Học">Tin Học</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={levelFilter} onValueChange={setLevelFilter}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by level" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Levels</SelectItem>
                        <SelectItem value="THCS">THCS</SelectItem>
                        <SelectItem value="THPT">THPT</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div style={{ flex: 1 }}>
                <MapContainer
                    center={position}
                    zoom={13}
                    scrollWheelZoom={false}
                    style={{ height: "100%", width: "100%", zIndex: "10" }}
                >
                    <ChangeView center={position} zoom={14} />
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {filteredPlaces.map((place, index) => (
                        <CustomMarker key={index} place={place} />
                    ))}
                </MapContainer>
            </div>
        </div>
    );
};

export default MapOverView;
