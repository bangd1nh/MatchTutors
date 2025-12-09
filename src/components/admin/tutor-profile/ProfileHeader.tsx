import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, User, Shield, ShieldOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileHeaderProps {
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  isBanned: boolean;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  name,
  email,
  phone,
  avatarUrl,
  isBanned,
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/admin/tutors")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Quay lại
            </Button>
            <div className="h-6 w-px bg-gray-300"></div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Hồ sơ Gia sư</h1>
            </div>
          </div>
        </div>

        {/* Profile Header */}
        <div className="flex items-center gap-6 pb-4">
          <Avatar className="h-20 w-20 border-4 border-white shadow-lg">
            <AvatarImage src={avatarUrl} alt={name} />
            <AvatarFallback className="text-2xl">
              {name?.charAt(0).toUpperCase() || "T"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-xl font-bold text-gray-900">{name}</h2>
              {isBanned ? (
                <Badge variant="destructive" className="flex items-center gap-1">
                  <ShieldOff className="h-3 w-3" />
                  Đã khóa
                </Badge>
              ) : (
                <Badge variant="default" className="flex items-center gap-1 bg-green-500">
                  <Shield className="h-3 w-3" />
                  Hoạt động
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {email}
              </div>
              {phone && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {phone}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
