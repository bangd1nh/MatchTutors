import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface ProfileAvatarProps {
    avatarUrl?: string;
    name?: string;
    onAvatarChange?: (file: File) => void;
    isEditing?: boolean;
}

export function ProfileAvatar({ avatarUrl, name, onAvatarChange, isEditing }: ProfileAvatarProps) {
    const [preview, setPreview] = useState<string | undefined>(avatarUrl);

    const fileInputId = "avatar-upload";

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const objectUrl = URL.createObjectURL(file);
            setPreview(objectUrl); // Set preview immediately
            onAvatarChange?.(file);
        }
    };

    // Clean up object URL when component unmounts or file changes
    useEffect(() => {
        return () => {
            if (preview && preview !== avatarUrl) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview, avatarUrl]);

    // Keep preview in sync with avatarUrl prop
    useEffect(() => {
        setPreview(avatarUrl);
    }, [avatarUrl]);

    return (
        <div className="flex flex-col items-center space-y-4">
            <Avatar className="w-32 h-32">
                <AvatarImage src={preview || "/placeholder.svg"} />
                <AvatarFallback className="text-2xl">
                    {name?.split(" ").map((n: string) => n[0]).join("") || "TU"}
                </AvatarFallback>
            </Avatar>
            {isEditing && (
                <>
                    <input
                        id={fileInputId}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                    <label htmlFor={fileInputId}>
                        <Button variant="outline" size="sm" asChild>
                            <span>Choose Photo</span>
                        </Button>
                    </label>
                    <p className="text-sm text-gray-500 text-center">Upload a professional photo</p>
                </>
            )}
        </div>
    );
}
