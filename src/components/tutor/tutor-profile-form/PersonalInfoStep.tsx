import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    User,
} from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Controller, UseFormReturn } from "react-hook-form"
import { TutorFormData } from "./types"
import ReactQuill from "react-quill"

interface PersonalInfoStepProps {
    form: UseFormReturn<TutorFormData>
}


export function PersonalInfoStep({ form, }: PersonalInfoStepProps) {
    const fileList = form.watch("avatarUrl") as unknown as FileList
    const file = fileList?.[0]
    // console.log(form.getValues())
    return (
        <Card className="shadow-lg border-0 bg-white rounded-2xl overflow-hidden">
            <CardHeader className="bg-slate-50/80 border-b border-slate-100 p-8">
                <CardTitle className="flex items-center gap-3 text-2xl text-slate-800">
                    <div className="p-2 bg-blue-100 rounded-xl">
                        <User className="h-6 w-6 text-blue-600" />
                    </div>
                    Personal Information
                </CardTitle>
                <p className="text-slate-600 mt-2">Tell us about yourself and your background</p>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
                <div className="flex items-start gap-6 p-6 bg-slate-50/50 rounded-2xl border border-slate-100">
                    <Avatar className="h-24 w-24 ring-4 ring-white shadow-lg">
                        <AvatarImage src={file ? URL.createObjectURL(file) : "/placeholder.svg"} />
                        <AvatarFallback className="bg-blue-100 text-blue-600 text-xl font-semibold">
                            <User className="h-10 w-10" />
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-3">
                        <div>
                            <Label htmlFor="avatarUrl" className="text-base font-semibold text-slate-700">
                                Profile Picture
                            </Label>
                            <p className="text-sm text-slate-500 mt-1">
                                Upload a professional photo to build trust with students
                            </p>
                        </div>
                        <div className="flex gap-3 max-w-[50%]">
                            <Input
                                type="file"
                                accept="image/*"
                                {...form.register("avatarUrl")}
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <Label htmlFor="fullName" className="text-base font-semibold text-slate-700">
                            Full Name *
                        </Label>
                        <Input
                            id="fullName"
                            placeholder="Enter your full name"
                            className="h-12 text-base"
                            {...form.register("fullName")}
                        />
                        {form.formState.errors.fullName && (
                            <p className="text-sm text-red-500 flex items-center gap-1">
                                <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                                {form.formState.errors.fullName.message}
                            </p>
                        )}
                    </div>

                </div>

                <div className="space-y-4">
                    <Label className="text-base font-semibold text-slate-700">Gender</Label>
                    <Controller
                        name="gender"
                        control={form.control}
                        render={({ field }) => (
                            <RadioGroup value={field.value} onValueChange={field.onChange} className="flex gap-8">
                                {["Male", "Female", "Other"].map((gender) => (
                                    <div key={gender} className="flex items-center space-x-3">
                                        <RadioGroupItem value={gender} id={gender.toLowerCase()} className="w-5 h-5" />
                                        <Label htmlFor={gender.toLowerCase()} className="text-base font-medium cursor-pointer">
                                            {gender}
                                        </Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        )}
                    />
                </div>

                <div className="space-y-3">
                    <Label htmlFor="bio" className="text-base font-semibold text-slate-700">
                        About You *
                    </Label>

                    <Controller
                        name="bio"
                        control={form.control}
                        render={({ field }) => (
                            <ReactQuill
                                theme="snow"
                                value={field.value}
                                onChange={field.onChange}
                                placeholder="Tell us about yourself, your teaching philosophy, and what makes you unique as a tutor..."
                                className="bg-white rounded-lg border border-slate-300"
                            />
                        )}
                    />

                    <p className="text-sm text-slate-500">
                        Share your passion for teaching and what students can expect
                    </p>

                    {form.formState.errors.bio && (
                        <p className="text-sm text-red-500 flex items-center gap-1">
                            <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                            {form.formState.errors.bio.message}
                        </p>
                    )}
                </div>

                <div className="space-y-6 p-6 bg-slate-50/50 rounded-2xl border border-slate-100">
                    <Label className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        Address Information
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            { key: "street", label: "Street Address", placeholder: "Enter street address" },
                            { key: "city", label: "City", placeholder: "Enter city" },
                        ].map(({ key, label, placeholder }) => (
                            <div key={key} className="space-y-2">
                                <Label htmlFor={key} className="text-sm font-medium text-slate-600">
                                    {label}
                                </Label>
                                <Input
                                    id={key}
                                    placeholder={placeholder}
                                    className="h-11"
                                    {...form.register(`address.${key}` as any)}
                                />
                            </div>
                        ))}
                    </div>
                </div>

            </CardContent>
        </Card>

    )
}