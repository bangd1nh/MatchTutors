import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUserProfile, useUpdateUserProfile } from "@/hooks/useUserProfile";
import {
   updateProfileSchema,
   UpdateProfileData,
} from "@/validation/userSchema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
   Card,
   CardContent,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";

// React Quill
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function ProfileForm() {
   const { data: user, isLoading: isLoadingUser } = useUserProfile();
   const { mutate: updateUser, isPending: isUpdating } = useUpdateUserProfile();
   const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

   const {
      register,
      control,
      handleSubmit,
      reset,
      formState: { errors, isDirty },
   } = useForm<UpdateProfileData>({
      resolver: zodResolver(updateProfileSchema),
   });

   useEffect(() => {
      if (user) {
         reset({
            name: user.name,
            phone: user.phone,
            gender: (user as any).gender ?? "",
            city: (user as any).address?.city ?? "",
            street: (user as any).address?.street ?? "",
         });
         setAvatarPreview(user.avatarUrl || null);
      }
   }, [user, reset]);

   const onSubmit = (data: UpdateProfileData) => {
      const payload: {
         name?: string;
         phone?: string;
         avatar?: File;
         gender?: string;
         address?: { city?: string; street?: string };
      } = {};
      if (data.name) payload.name = data.name;
      if (data.phone) payload.phone = data.phone;
      if (data.gender) payload.gender = data.gender;
      if (data.city || data.street) {
         payload.address = {
            ...(data.city ? { city: data.city } : {}),
            ...(data.street ? { street: data.street } : {}),
         };
      }
      if (data.avatar && data.avatar.length > 0) {
         payload.avatar = data.avatar[0];
      }
      updateUser(payload);
   };

   const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
         setAvatarPreview(URL.createObjectURL(file));
      }
   };

   if (isLoadingUser) {
      return (
         <div className="flex justify-center items-center p-10">
            <Loader2 className="h-8 w-8 animate-spin text-sky-600" />
         </div>
      );
   }

   return (
      <Card className="w-full">
         <CardHeader>
            <CardTitle>Hồ sơ cá nhân</CardTitle>
            <CardDescription>
               Quản lý thông tin cá nhân và ảnh đại diện của bạn.
            </CardDescription>
         </CardHeader>
         <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
               <div className="flex items-center gap-6">
                  <Avatar className="h-24 w-24">
                     <AvatarImage src={avatarPreview || ""} alt="Avatar" />
                     <AvatarFallback className="text-3xl">
                        {user?.name?.charAt(0).toUpperCase()}
                     </AvatarFallback>
                  </Avatar>
                  <div className="grid gap-2">
                     <Label htmlFor="avatar">Thay đổi ảnh đại diện</Label>
                     <Input
                        id="avatarUrl"
                        type="file"
                        accept="image/*"
                        {...register("avatar")}
                        onChange={handleAvatarChange}
                        className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                     />
                     {errors.avatar && (
                        <p className="text-sm text-red-500">
                           {errors.avatar.message as string}
                        </p>
                     )}
                  </div>
               </div>

               <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={user?.email} disabled />
               </div>

               {/* NAME field replaced with React Quill */}
               <div className="grid gap-2">
                  <Label>Họ và tên</Label>
                  <Controller
                     name="name"
                     control={control}
                     defaultValue={user?.name ?? ""}
                     render={({ field }) => (
                        <div>
                           <ReactQuill
                              value={field.value || ""}
                              onChange={(val) => field.onChange(val)}
                              theme="snow"
                              className="bg-white border rounded-md"
                              modules={{
                                 toolbar: [
                                    [{ header: [1, 2, false] }],
                                    ["bold", "italic", "underline"],
                                    [{ list: "ordered" }, { list: "bullet" }],
                                    ["clean"],
                                 ],
                              }}
                           />
                        </div>
                     )}
                  />
                  {errors.name && (
                     <p className="text-sm text-red-500">
                        {errors.name.message as any}
                     </p>
                  )}
               </div>

               <div className="grid gap-2">
                  <Label htmlFor="gender">Giới tính</Label>
                  <select
                     id="gender"
                     {...register("gender")}
                     className="input bg-transparent border rounded-md px-3 py-2"
                     defaultValue={(user as any)?.gender ?? ""}
                  >
                     <option value="">Không xác định</option>
                     <option value="MALE">Nam</option>
                     <option value="FEMALE">Nữ</option>
                     <option value="OTHER">Khác</option>
                  </select>
                  {errors.gender && (
                     <p className="text-sm text-red-500">
                        {errors.gender.message as string}
                     </p>
                  )}
               </div>

               <div className="grid gap-2">
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <Input
                     id="phone"
                     {...register("phone")}
                     defaultValue={user?.phone}
                  />
                  {errors.phone && (
                     <p className="text-sm text-red-500">
                        {errors.phone.message}
                     </p>
                  )}
               </div>

               <div className="grid gap-2">
                  <Label htmlFor="city">Thành phố</Label>
                  <Input
                     id="city"
                     {...register("city")}
                     defaultValue={(user as any)?.address?.city ?? ""}
                  />
                  {errors.city && (
                     <p className="text-sm text-red-500">
                        {errors.city.message as string}
                     </p>
                  )}
               </div>

               <div className="grid gap-2">
                  <Label htmlFor="street">Đường / Địa chỉ</Label>
                  <Input
                     id="street"
                     {...register("street")}
                     defaultValue={(user as any)?.address?.street ?? ""}
                  />
                  {errors.street && (
                     <p className="text-sm text-red-500">
                        {errors.street.message as string}
                     </p>
                  )}
               </div>
            </CardContent>
            <CardFooter className="flex justify-end">
               <Button type="submit" disabled={isUpdating || !isDirty}>
                  {isUpdating && (
                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isUpdating ? "Đang lưu..." : "Lưu thay đổi"}
               </Button>
            </CardFooter>
         </form>
      </Card>
   );
}
