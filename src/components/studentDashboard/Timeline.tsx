import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, FileText, Star, UserPlus, Clock } from "lucide-react";
import type { TimelineItemDTO } from "@/types/studentDashboard";
import { translateType, translateStatus } from "@/utils/studentDashboard";
import { cn } from "@/lib/utils";

interface TimelineProps {
   items: TimelineItemDTO[];
}

export function Timeline({ items }: TimelineProps) {
   const sortedItems = [...items]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10);

   const typeStyles: Record<
      string,
      { icon: React.ReactNode; className: string }
   > = {
      SESSION: {
         icon: <Calendar className="h-4 w-4" />,
         className: "text-blue-600 dark:text-blue-400",
      },
      QUIZ: {
         icon: <FileText className="h-4 w-4" />,
         className: "text-purple-600 dark:text-purple-400",
      },
      REVIEW: {
         icon: <Star className="h-4 w-4" />,
         className: "text-green-600 dark:text-green-400",
      },
      TEACHING_REQUEST: {
         icon: <UserPlus className="h-4 w-4" />,
         className: "text-orange-600 dark:text-orange-400",
      },
      DEFAULT: {
         icon: <Clock className="h-4 w-4" />,
         className: "text-muted-foreground",
      },
   };

   const statusStyles: Record<string, string> = {
      completed:
         "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-700/60",
      scheduled:
         "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-300 dark:border-yellow-700/60",
      failed:
         "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/50 dark:text-red-300 dark:border-red-700/60",
      rejected:
         "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/50 dark:text-red-300 dark:border-red-700/60",
      confirmed:
         "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/50 dark:text-green-500 dark:border-green-900/60",
      not_conducted:
         "bg-red-500 text-red-100 border-red-200 dark:bg-red-500/50 dark:text-red-100 dark:border-red-700/60",
      DEFAULT:
         "bg-gray-100 text-gray-800 border-gray-200 dark:bg-secondary dark:text-secondary-foreground dark:border-border",
   };

   const formatDate = (date: string) => {
      return new Date(date).toLocaleDateString("vi-VN", {
         month: "short",
         day: "numeric",
         hour: "2-digit",
         minute: "2-digit",
      });
   };

   return (
      <Card>
         <CardHeader>
            <CardTitle>Hoạt động gần đây</CardTitle>
         </CardHeader>
         <CardContent>
            {sortedItems.length === 0 ? (
               <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                  <p className="text-muted-foreground">Chưa có hoạt động nào</p>
               </div>
            ) : (
               <div className="border rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                     <table className="w-full text-sm">
                        <thead className="bg-muted/50">
                           <tr className="border-b">
                              <th className="text-left py-3 px-4 font-medium">
                                 Hoạt động
                              </th>
                              <th className="text-left py-3 px-4 font-medium">
                                 Loại
                              </th>
                              <th className="text-left py-3 px-4 font-medium">
                                 Trạng thái
                              </th>
                              <th className="text-left py-3 px-4 font-medium">
                                 Thời gian
                              </th>
                           </tr>
                        </thead>
                        <tbody>
                           {sortedItems.map((item, index) => {
                              const typeStyle =
                                 typeStyles[item.type] || typeStyles.DEFAULT;
                              const statusStyle =
                                 statusStyles[item.status] ||
                                 statusStyles.DEFAULT;

                              return (
                                 <tr
                                    key={index}
                                    className="border-b hover:bg-muted/50 transition-colors last:border-b-0"
                                 >
                                    <td className="py-3 px-4 align-top">
                                       <div>
                                          <div className="font-medium text-foreground">
                                             {item.title}
                                          </div>
                                          <div className="text-muted-foreground mt-1">
                                             {item.description}
                                          </div>
                                       </div>
                                    </td>
                                    <td className="py-3 px-4 align-top">
                                       <div className="flex items-center gap-2">
                                          <div className={typeStyle.className}>
                                             {typeStyle.icon}
                                          </div>
                                          <span className="capitalize text-foreground">
                                             {translateType(item.type)}
                                          </span>
                                       </div>
                                    </td>
                                    <td className="py-3 px-4 align-top">
                                       <Badge
                                          variant="outline"
                                          className={cn(
                                             "text-xs whitespace-nowrap",
                                             statusStyle
                                          )}
                                       >
                                          {translateStatus(
                                             item.type,
                                             item.status
                                          )}
                                       </Badge>
                                    </td>
                                    <td className="py-3 px-4 align-top">
                                       <div className="text-muted-foreground whitespace-nowrap">
                                          {formatDate(item.date)}
                                       </div>
                                    </td>
                                 </tr>
                              );
                           })}
                        </tbody>
                     </table>
                  </div>
               </div>
            )}
         </CardContent>
      </Card>
   );
}
