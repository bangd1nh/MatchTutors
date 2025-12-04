// components/ContactInfoDisplay.tsx
import { Mail, Phone, MapPin, Clock } from "lucide-react"

interface ContactInfoDisplayProps {
    tutor: any
}

export function ContactInfoDisplay({ tutor }: ContactInfoDisplayProps) {
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{tutor.userId.email}</p>
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                        <p className="text-sm text-gray-500">Số điện thoại</p>
                        <p className="font-medium">{tutor.userId.phone}</p>
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <div>
                        <p className="text-sm text-gray-500">Địa chỉ</p>
                        <p className="font-medium">
                            {tutor.userId?.address?.city || "N/A"},
                            {tutor.userId?.address?.street || "N/A"}
                        </p>
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <div>
                        <p className="text-sm text-gray-500">Mức phí theo giờ</p>
                        <p className="font-medium">{tutor.hourlyRate} VND/giờ</p>
                    </div>
                </div>
            </div>
            <div className="pt-4">
                <p className="text-sm text-gray-500 mb-2">Tiểu sử</p>
                <div className="h-40 overflow-y-auto pr-2 border rounded-md p-2 bg-gray-50">
                    <div
                        className="prose prose-sm text-gray-700 max-w-full break-words"
                        dangerouslySetInnerHTML={{ __html: tutor.bio }}
                    />
                </div>
            </div>
        </div>
    )
}
