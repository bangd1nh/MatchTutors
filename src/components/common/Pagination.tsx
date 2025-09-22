import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from "@/components/ui/popover";
import { useState, KeyboardEvent } from "react";

interface PaginationProps {
   currentPage: number;
   totalPages: number;
   onPageChange: (page: number) => void;
   maxVisiblePages?: number;
   className?: string;
   showQuickJump?: boolean;
}

export function Pagination({
   currentPage,
   totalPages,
   onPageChange,
   maxVisiblePages = 5,
   className = "",
   showQuickJump = true,
}: PaginationProps) {
   const [quickJumpPage, setQuickJumpPage] = useState("");
   const [isPopoverOpen, setIsPopoverOpen] = useState(false);

   const clamp = (n: number) => Math.max(1, Math.min(totalPages, n));

   const prev = () => onPageChange(clamp(currentPage - 1));
   const next = () => onPageChange(clamp(currentPage + 1));

   const getPageRange = () => {
      if (totalPages <= maxVisiblePages) {
         return Array.from({ length: totalPages }, (_, i) => i + 1);
      }
      const half = Math.floor(maxVisiblePages / 2);
      let start = Math.max(1, currentPage - half);
      let end = Math.min(totalPages, currentPage + half);

      if (currentPage <= half) {
         start = 1;
         end = maxVisiblePages;
      } else if (currentPage + half > totalPages) {
         end = totalPages;
         start = totalPages - maxVisiblePages + 1;
      }
      return Array.from({ length: end - start + 1 }, (_, i) => start + i);
   };

   const pageRange = getPageRange();

   const handleQuickJump = () => {
      const pageNum = parseInt(quickJumpPage);
      if (!Number.isNaN(pageNum)) {
         const p = clamp(pageNum);
         onPageChange(p);
         setIsPopoverOpen(false);
      }
      setQuickJumpPage("");
   };

   const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") handleQuickJump();
   };

   return (
      <nav
         className={`flex flex-col sm:flex-row items-center gap-3 sm:gap-4 ${className}`}
         aria-label="Pagination"
      >
         <div className="flex items-center gap-2">
            <Button
               variant="ghost"
               size="icon"
               onClick={prev}
               disabled={currentPage === 1}
               aria-label="Previous page"
               className="rounded-full"
            >
               <ChevronLeft className="h-5 w-5" />
            </Button>

            {/* First page + ellipsis */}
            {pageRange[0] > 1 && (
               <>
                  <button
                     onClick={() => onPageChange(1)}
                     className={`h-9 w-9 flex items-center justify-center rounded-full border transition ${
                        currentPage === 1
                           ? "bg-primary text-white border-transparent shadow"
                           : "bg-white text-slate-700 border-slate-200 hover:bg-primary/10"
                     }`}
                     aria-current={currentPage === 1 ? "page" : undefined}
                  >
                     1
                  </button>
                  {pageRange[0] > 2 && (
                     <span className="px-1 text-muted-foreground">
                        <MoreHorizontal className="w-4 h-4" />
                     </span>
                  )}
               </>
            )}

            {/* Main page numbers */}
            {pageRange.map((page) => (
               <button
                  key={page}
                  onClick={() => onPageChange(page)}
                  className={`h-9 min-w-[36px] px-2 flex items-center justify-center rounded-full border transition font-medium ${
                     currentPage === page
                        ? "bg-primary text-white border-transparent shadow"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-primary/10"
                  }`}
                  aria-current={currentPage === page ? "page" : undefined}
               >
                  {page}
               </button>
            ))}

            {/* Last page + ellipsis */}
            {pageRange[pageRange.length - 1] < totalPages && (
               <>
                  {pageRange[pageRange.length - 1] < totalPages - 1 && (
                     <span className="px-1 text-muted-foreground">
                        <MoreHorizontal className="w-4 h-4" />
                     </span>
                  )}
                  <button
                     onClick={() => onPageChange(totalPages)}
                     className={`h-9 w-9 flex items-center justify-center rounded-full border transition font-semibold ${
                        currentPage === totalPages
                           ? "bg-primary text-white border-transparent shadow"
                           : "bg-white text-slate-700 border-slate-200 hover:bg-primary/10"
                     }`}
                     aria-current={
                        currentPage === totalPages ? "page" : undefined
                     }
                  >
                     {totalPages}
                  </button>
               </>
            )}

            <Button
               variant="ghost"
               size="icon"
               onClick={next}
               disabled={currentPage === totalPages}
               aria-label="Next page"
               className="rounded-full"
            >
               <ChevronRight className="h-5 w-5" />
            </Button>
         </div>

         {/* Quick jump only (no textual "Trang X / Y") */}
         {/* <div className="flex items-center gap-3 text-sm text-muted-foreground">
            {showQuickJump && totalPages > 1 && (
               <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                  <PopoverTrigger asChild>
                     <button className="px-3 py-1 rounded-full border text-primary hover:bg-primary/10">
                        Nhảy tới...
                     </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64 p-4">
                     <Label htmlFor="quickJump" className="text-sm font-medium">
                        Đến trang (1-{totalPages})
                     </Label>
                     <div className="mt-2 flex items-center gap-2">
                        <Input
                           id="quickJump"
                           type="number"
                           min={1}
                           max={totalPages}
                           value={quickJumpPage}
                           onChange={(e) => setQuickJumpPage(e.target.value)}
                           onKeyDown={handleKeyDown}
                           placeholder={`1-${totalPages}`}
                           className="w-24"
                        />
                        <Button
                           onClick={handleQuickJump}
                           className="rounded-full"
                        >
                           Đi
                        </Button>
                     </div>
                  </PopoverContent>
               </Popover>
            )}
         </div> */}
      </nav>
   );
}
