import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Level } from "@/enums/level.enum";
import { Subject } from "@/enums/subject.enum";
import { useUpdateStudentProfile } from "@/hooks/useStudentProfile";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@radix-ui/react-label";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import z from "zod";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { TimeSlot } from "@/enums/timeSlot.enum";
import { useToast } from "@/hooks/useToast";
import { City } from "@/enums/city.enum";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/hooks/useUser";

const studentProfileSchema = z.object({
   name: z.string().min(1, "Vui lòng nhập tên"),
   email: z.string().email(),
   phone: z.string().min(1, "Vui lòng nhập số điện thoại"),
   gender: z.enum(["MALE", "FEMALE", "OTHER"], "Vui lòng chọn giới tính"),
   address: z.object({
      city: z.string().min(1, "Vui lòng chọn thành phố"),
      street: z.string().min(1, "Vui lòng nhập địa chỉ"),
   }),
   avatar: z.any().optional(),
   gradeLevel: z.string().min(1, "Vui lòng chọn lớp"),
   subjectsInterested: z
      .array(z.string())
      .min(1, "Vui lòng chọn ít nhất một môn học"),
   bio: z.string().min(1, "Vui lòng nhập giới thiệu bản thân"),
   learningGoals: z.string().min(1, "Vui lòng nhập mục tiêu học tập"),
   availability: z
      .array(
         z.object({
            dayOfWeek: z.number(),
            slots: z.array(z.string()),
         })
      )
      .min(1, "Vui lòng chọn ít nhất một lịch rảnh"),
});

const DAYS_OF_WEEK = [
   { value: 1, label: "Thứ 2" },
   { value: 2, label: "Thứ 3" },
   { value: 3, label: "Thứ 4" },
   { value: 4, label: "Thứ 5" },
   { value: 5, label: "Thứ 6" },
   { value: 6, label: "Thứ 7" },
   { value: 0, label: "Chủ nhật" },
];

const TIMESLOTS = [
   { value: TimeSlot.PRE_12, label: "Sáng" },
   { value: TimeSlot.MID_12_17, label: "Chiều" },
   { value: TimeSlot.AFTER_17, label: "Tối" },
];

type StudentProfileFormValues = z.infer<typeof studentProfileSchema>;

const SUBJECTS = Object.values(Subject);
const GRADE_LEVELS = Object.values(Level);
const CITIES = Object.values(City);

const CreateStudentProfile = () => {
   const { user } = useUser();
   const navigate = useNavigate();
   const { mutate: createStudentProfile, isPending } =
      useUpdateStudentProfile();
   const {
      register,
      control,
      handleSubmit,
      formState: { errors, isDirty },
      setValue,
   } = useForm<StudentProfileFormValues>({
      resolver: zodResolver(studentProfileSchema),
      mode: "onChange",
      defaultValues: {
         name: user?.name ?? "",
         email: user?.email ?? "",
         phone: user?.phone ?? "",
         gender: undefined,
         address: { city: "", street: "" },
         gradeLevel: "",
         subjectsInterested: [],
         bio: "",
         learningGoals: "",
         availability: [],
      },
   });

   const [avatarPreview, setAvatarPreview] = useState<string | null>(
      user?.avatarUrl || null
   );
   const addToast = useToast();

   const onSubmit = (formData: StudentProfileFormValues) => {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("phone", formData.phone || "");
      data.append("gender", formData.gender || "");
      data.append("address", JSON.stringify(formData.address || {}));
      data.append("gradeLevel", formData.gradeLevel || "");
      data.append("bio", formData.bio || "");
      data.append("learningGoals", formData.learningGoals || "");
      data.append(
         "subjectsInterested",
         JSON.stringify(formData.subjectsInterested || [])
      );
      data.append("availability", JSON.stringify(formData.availability || []));
      if (formData.avatar && formData.avatar instanceof File) {
         data.append("avatar", formData.avatar);
      }

      createStudentProfile(data, {
         onSuccess: () => {
            addToast("success", "Tạo hồ sơ thành công!");
            navigate("/student/profile"); // Navigate to view profile after creation
         },
         onError: () => {
            addToast("error", "Tạo hồ sơ thất bại!");
         },
      });
   };

   const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
         setAvatarPreview(URL.createObjectURL(file));
         setValue("avatar", file, { shouldDirty: true });
      }
   };

   return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-4 sm:p-6">
         <div className="flex justify-between items-center">
            <div>
               <h1 className="text-2xl font-bold">Tạo hồ sơ học sinh</h1>
               <p className="text-muted-foreground">
                  Hoàn thành thông tin dưới đây để tạo hồ sơ của bạn.
               </p>
            </div>
            <Button type="submit" disabled={!isDirty || isPending}>
               {isPending ? (
                  <>
                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                     Đang tạo...
                  </>
               ) : (
                  "Tạo hồ sơ"
               )}
            </Button>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-1 space-y-6">
               <Card>
                  <CardHeader>
                     <CardTitle>Ảnh đại diện</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center gap-4">
                     <Avatar className="h-32 w-32">
                        <AvatarImage src={avatarPreview || ""} alt="Avatar" />
                        <AvatarFallback className="text-4xl">
                           {user?.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                     </Avatar>
                     <Input
                        id="avatar"
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                     />
                  </CardContent>
               </Card>
               <Card>
                  <CardHeader>
                     <CardTitle>Thông tin cá nhân</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     <div className="grid gap-2">
                        <Label htmlFor="name">Họ và tên</Label>
                        <Input id="name" {...register("name")} />
                        {errors.name && (
                           <p className="text-sm text-red-500">
                              {errors.name.message}
                           </p>
                        )}
                     </div>
                     <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                           id="email"
                           type="email"
                           disabled
                           {...register("email")}
                        />
                     </div>
                     <div className="grid gap-2">
                        <Label htmlFor="phone">Số điện thoại</Label>
                        <Input id="phone" {...register("phone")} />
                        {errors.phone && (
                           <p className="text-sm text-red-500">
                              {errors.phone.message}
                           </p>
                        )}
                     </div>
                     <div className="grid gap-2">
                        <Label htmlFor="gender">Giới tính</Label>
                        <Controller
                           name="gender"
                           control={control}
                           render={({ field }) => (
                              <Select
                                 onValueChange={field.onChange}
                                 value={field.value}
                              >
                                 <SelectTrigger>
                                    <SelectValue placeholder="Chọn giới tính" />
                                 </SelectTrigger>
                                 <SelectContent>
                                    <SelectItem value="MALE">Nam</SelectItem>
                                    <SelectItem value="FEMALE">Nữ</SelectItem>
                                    <SelectItem value="OTHER">Khác</SelectItem>
                                 </SelectContent>
                              </Select>
                           )}
                        />
                        {errors.gender && (
                           <p className="text-sm text-red-500">
                              {errors.gender.message}
                           </p>
                        )}
                     </div>
                     <div className="grid gap-2">
                        <Label>Địa chỉ</Label>
                        <div className="space-y-2">
                           <Controller
                              name="address.city"
                              control={control}
                              render={({ field }) => (
                                 <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                 >
                                    <SelectTrigger>
                                       <SelectValue placeholder="Chọn thành phố" />
                                    </SelectTrigger>
                                    <SelectContent>
                                       {CITIES.map((city) => (
                                          <SelectItem key={city} value={city}>
                                             {city}
                                          </SelectItem>
                                       ))}
                                    </SelectContent>
                                 </Select>
                              )}
                           />
                           <Input
                              id="street"
                              placeholder="Số nhà, tên đường..."
                              {...register("address.street")}
                           />
                        </div>
                        {errors.address && (
                           <p className="text-sm text-red-500">
                              {errors.address.city?.message ||
                                 errors.address.street?.message}
                           </p>
                        )}
                     </div>
                  </CardContent>
               </Card>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-2 space-y-6">
               <Card>
                  <CardHeader>
                     <CardTitle>Thông tin học vấn</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     <div className="grid gap-2">
                        <Label htmlFor="gradeLevel">Lớp</Label>
                        <Controller
                           name="gradeLevel"
                           control={control}
                           render={({ field }) => (
                              <Select
                                 onValueChange={field.onChange}
                                 value={field.value}
                              >
                                 <SelectTrigger>
                                    <SelectValue placeholder="Chọn lớp" />
                                 </SelectTrigger>
                                 <SelectContent>
                                    {GRADE_LEVELS.map((level) => (
                                       <SelectItem key={level} value={level}>
                                          {level.replace("GRADE_", "Lớp ")}
                                       </SelectItem>
                                    ))}
                                 </SelectContent>
                              </Select>
                           )}
                        />
                        {errors.gradeLevel && (
                           <p className="text-sm text-red-500">
                              {errors.gradeLevel.message}
                           </p>
                        )}
                     </div>
                     <div className="grid gap-2">
                        <Label>Môn quan tâm</Label>
                        <Controller
                           name="subjectsInterested"
                           control={control}
                           render={({ field }) => (
                              <div className="flex flex-wrap gap-2">
                                 {SUBJECTS.map((subject) => (
                                    <label
                                       key={subject}
                                       className={`flex items-center gap-1 px-3 py-1 rounded-full border cursor-pointer transition ${
                                          field.value?.includes(subject)
                                             ? "bg-sky-600 text-white border-sky-600"
                                             : "bg-muted text-foreground border-muted-foreground hover:bg-sky-100 dark:hover:bg-sky-900"
                                       }`}
                                       style={{ userSelect: "none" }}
                                    >
                                       <input
                                          type="checkbox"
                                          value={subject}
                                          checked={field.value?.includes(
                                             subject
                                          )}
                                          onChange={(e) => {
                                             const newValue = e.target.checked
                                                ? [
                                                     ...(field.value || []),
                                                     subject,
                                                  ]
                                                : (field.value || []).filter(
                                                     (s) => s !== subject
                                                  );
                                             field.onChange(newValue);
                                          }}
                                          className="hidden"
                                       />
                                       {subject}
                                    </label>
                                 ))}
                              </div>
                           )}
                        />
                        {errors.subjectsInterested && (
                           <p className="text-sm text-red-500">
                              {errors.subjectsInterested.message}
                           </p>
                        )}
                     </div>
                     <div className="grid gap-2">
                        <Label htmlFor="bio">Giới thiệu bản thân</Label>
                        <Controller
                           name="bio"
                           control={control}
                           render={({ field }) => (
                              <ReactQuill
                                 theme="snow"
                                 value={field.value || ""}
                                 onChange={field.onChange}
                              />
                           )}
                        />
                        {errors.bio && (
                           <p className="text-sm text-red-500">
                              {errors.bio.message}
                           </p>
                        )}
                     </div>
                     <div className="grid gap-2">
                        <Label htmlFor="learningGoals">Mục tiêu học tập</Label>
                        <Controller
                           name="learningGoals"
                           control={control}
                           render={({ field }) => (
                              <ReactQuill
                                 theme="snow"
                                 value={field.value || ""}
                                 onChange={field.onChange}
                              />
                           )}
                        />
                        {errors.learningGoals && (
                           <p className="text-sm text-red-500">
                              {errors.learningGoals.message}
                           </p>
                        )}
                     </div>
                  </CardContent>
               </Card>
               <Card>
                  <CardHeader>
                     <CardTitle>Lịch rảnh</CardTitle>
                     <CardDescription>
                        Chọn các khung giờ bạn có thể học trong tuần.
                     </CardDescription>
                  </CardHeader>
                  <CardContent>
                     <Controller
                        name="availability"
                        control={control}
                        render={({ field }) => {
                           const value = field.value || [];
                           const handleSlotChange = (
                              day: number,
                              slot: string,
                              checked: boolean
                           ) => {
                              let newValue = [...value];
                              const dayIndex = newValue.findIndex(
                                 (d) => d.dayOfWeek === day
                              );
                              if (dayIndex === -1 && checked) {
                                 newValue.push({
                                    dayOfWeek: day,
                                    slots: [slot],
                                 });
                              } else if (dayIndex !== -1) {
                                 const slots = new Set(
                                    newValue[dayIndex].slots
                                 );
                                 if (checked) slots.add(slot);
                                 else slots.delete(slot);
                                 if (slots.size === 0)
                                    newValue.splice(dayIndex, 1);
                                 else
                                    newValue[dayIndex].slots =
                                       Array.from(slots);
                              }
                              field.onChange(
                                 newValue.sort(
                                    (a, b) => a.dayOfWeek - b.dayOfWeek
                                 )
                              );
                           };

                           return (
                              <div className="overflow-x-auto">
                                 <table className="w-full border-collapse">
                                    <thead>
                                       <tr className="border-b">
                                          {DAYS_OF_WEEK.map((day) => (
                                             <th
                                                key={day.value}
                                                className="p-2 font-semibold text-center"
                                             >
                                                {day.label}
                                             </th>
                                          ))}
                                       </tr>
                                    </thead>
                                    <tbody>
                                       {TIMESLOTS.map((slot) => (
                                          <tr
                                             key={slot.value}
                                             className="border-b"
                                          >
                                             {DAYS_OF_WEEK.map((day) => {
                                                const isChecked =
                                                   value
                                                      .find(
                                                         (d) =>
                                                            d.dayOfWeek ===
                                                            day.value
                                                      )
                                                      ?.slots.includes(
                                                         slot.value
                                                      ) || false;
                                                return (
                                                   <td
                                                      key={day.value}
                                                      className="p-0"
                                                   >
                                                      <label
                                                         className={`flex items-center justify-center w-full h-full min-h-[40px] transition cursor-pointer ${
                                                            isChecked
                                                               ? "bg-sky-600 text-white"
                                                               : "hover:bg-sky-100 dark:hover:bg-sky-900"
                                                         }`}
                                                      >
                                                         <input
                                                            type="checkbox"
                                                            checked={isChecked}
                                                            onChange={(e) =>
                                                               handleSlotChange(
                                                                  day.value,
                                                                  slot.value,
                                                                  e.target
                                                                     .checked
                                                               )
                                                            }
                                                            className="hidden"
                                                         />
                                                         {slot.label}
                                                      </label>
                                                   </td>
                                                );
                                             })}
                                          </tr>
                                       ))}
                                    </tbody>
                                 </table>
                              </div>
                           );
                        }}
                     />
                     {errors.availability && (
                        <p className="text-sm text-red-500 mt-2">
                           {errors.availability.message}
                        </p>
                     )}
                  </CardContent>
               </Card>
            </div>
         </div>
      </form>
   );
};

export default CreateStudentProfile;
