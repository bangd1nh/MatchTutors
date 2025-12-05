// components/PersonalInfoForm.tsx
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ValidationError } from "./ValidationError"

interface PersonalInfoFormProps {
    formData: any
    onFieldChange: (field: string, value: string) => void
    getError: (field: string) => string | null
    hasError: (field: string) => boolean
    clearFieldError: (field: string) => void
}

export function PersonalInfoForm({ formData, onFieldChange, getError, hasError, clearFieldError }: PersonalInfoFormProps) {
    const handleChange = (field: string, value: string) => {
        onFieldChange(field, value);
        clearFieldError(field);
    }

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="name">Họ và tên *</Label>
                    <Input
                        id="name"
                        name="name"
                        value={formData.name || ""}
                        onChange={(e) => handleChange("name", e.target.value)}
                        placeholder="Nhập họ và tên của bạn"
                        className={hasError("name") ? "border-red-500" : ""}
                    />
                    <ValidationError message={getError("name")} />
                </div>
                <div>
                    <Label htmlFor="gender">Giới tính *</Label>
                    <Select
                        value={formData.gender}
                        onValueChange={(value) => handleChange("gender", value)}
                    >
                        <SelectTrigger className={hasError("gender") ? "border-red-500" : ""}>
                            <SelectValue placeholder="Chọn giới tính" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="MALE">Nam</SelectItem>
                            <SelectItem value="FEMALE">Nữ</SelectItem>
                            <SelectItem value="OTHER">Khác</SelectItem>
                        </SelectContent>
                    </Select>
                    <ValidationError message={getError("gender")} />
                </div>
                <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email || ""}
                        onChange={(e) => handleChange("email", e.target.value)}
                        placeholder="email.cua-ban@example.com"
                        className={hasError("email") ? "border-red-500" : ""}
                        disabled
                    />
                    <ValidationError message={getError("email")} />
                </div>
                <div>
                    <Label htmlFor="phone">Số điện thoại *</Label>
                    <Input
                        id="phone"
                        name="phone"
                        value={formData.phone || ""}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        placeholder="Nhập số điện thoại"
                        className={hasError("phone") ? "border-red-500" : ""}
                    />
                    <ValidationError message={getError("phone")} />
                </div>
            </div>
        </div>
    )
}