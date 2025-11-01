import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form";

import {
   useCreateLearningCommitment,
   useTeachingRequestsByTutor,
} from "@/hooks/useLearningCommitment";
import { CreateLearningCommitmentRequest } from "@/types/learningCommitment";

const formSchema = z.object({
   teachingRequest: z.string().min(1, "Teaching request is required"),
   totalSessions: z.number().min(1, "Total sessions must be at least 1"),
   startDate: z.string().min(1, "Start date is required"),
   endDate: z.string().min(1, "End date is required"),
   totalAmount: z.number().min(0, "Total amount must be positive"),
});

interface Props {
   onSuccess?: () => void;
}

export const CreateLearningCommitmentForm = ({ onSuccess }: Props) => {
   const { mutate: createCommitment, isPending } =
      useCreateLearningCommitment();
   const { data: teachingRequests = [] } = useTeachingRequestsByTutor();

   const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
         teachingRequest: "",
         totalSessions: 1,
         startDate: "",
         endDate: "",
         totalAmount: 0,
      },
   });

   const onSubmit = (values: z.infer<typeof formSchema>) => {
      const selectedRequest = teachingRequests.find(
         (tr: any) => tr._id === values.teachingRequest
      );

      const data: CreateLearningCommitmentRequest = {
         ...values,
         teachingRequest: values.teachingRequest,
         tutor: selectedRequest?.tutor,
         student: selectedRequest?.student,
      };

      createCommitment(data, {
         onSuccess: () => {
            form.reset();
            onSuccess?.();
         },
      });
   };

   return (
      <Card className="w-full max-w-2xl mx-auto">
         <CardHeader>
            <CardTitle>Create Learning Commitment</CardTitle>
         </CardHeader>
         <CardContent>
            <Form {...form}>
               <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
               >
                  <FormField
                     control={form.control}
                     name="teachingRequest"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Teaching Request</FormLabel>
                           <FormControl>
                              {teachingRequests.length > 0 ? (
                                 <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                 >
                                    <SelectTrigger>
                                       <SelectValue placeholder="Select a teaching request" />
                                    </SelectTrigger>
                                    <SelectContent>
                                       {teachingRequests.map((tr: any) => (
                                          <SelectItem
                                             key={tr._id}
                                             value={tr._id}
                                          >
                                             {`${tr.subject} - ${tr.level} (${tr.hourlyRate} VND/hr)`}
                                          </SelectItem>
                                       ))}
                                    </SelectContent>
                                 </Select>
                              ) : (
                                 <p className="text-gray-500">
                                    No teaching requests available
                                 </p>
                              )}
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                     <FormField
                        control={form.control}
                        name="totalSessions"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Total Sessions</FormLabel>
                              <FormControl>
                                 <Input
                                    type="number"
                                    {...field}
                                    onChange={(e) =>
                                       field.onChange(parseInt(e.target.value))
                                    }
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     <FormField
                        control={form.control}
                        name="totalAmount"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Total Amount (VND)</FormLabel>
                              <FormControl>
                                 <Input
                                    type="number"
                                    {...field}
                                    onChange={(e) =>
                                       field.onChange(
                                          parseFloat(e.target.value)
                                       )
                                    }
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <FormField
                        control={form.control}
                        name="startDate"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Start Date</FormLabel>
                              <FormControl>
                                 <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     <FormField
                        control={form.control}
                        name="endDate"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>End Date</FormLabel>
                              <FormControl>
                                 <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                  </div>

                  <Button type="submit" className="w-full" disabled={isPending}>
                     {isPending ? "Creating..." : "Create Learning Commitment"}
                  </Button>
               </form>
            </Form>
         </CardContent>
      </Card>
   );
};
