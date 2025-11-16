import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAISearch } from "@/hooks/useAISearch";
import { useToast } from "@/hooks/useToast";
import { Loader2, Sparkles } from "lucide-react";
import React, { useState } from "react";

type Props = {
   currentFilters: {
      searchQuery: string;
   };
   onFilterChange: (newFilters: Partial<Props["currentFilters"]>) => void;
   onApplyFilters: () => void;
   onAISearchResults?: (results: any) => void;
};

const AISearch = (props: Props) => {
   const { tutorSearch } = useAISearch();
   const addToast = useToast();
   const [aiSearchQuery, setAiSearchQuery] = useState("");

   const handleAISearch = () => {
      if (!aiSearchQuery.trim()) return;

      tutorSearch.mutate(aiSearchQuery, {
         onSuccess: (response) => {
            console.log("AI Search Results:", response);

            // Handle different response structures
            let tutorCount = 0;
            let tutorData = null;

            if (
               response?.data?.results &&
               Array.isArray(response.data.results)
            ) {
               // This matches your new API response structure
               tutorCount = response.data.results.length;
               tutorData = response.data.results;
            } else if (
               response?.data.results &&
               Array.isArray(response.data.results)
            ) {
               tutorCount = response.data.results.length;
               tutorData = response.data.results;
            } else if (response?.data && Array.isArray(response.data)) {
               tutorCount = response.data.length;
               tutorData = response.data;
            } else if (Array.isArray(response)) {
               tutorCount = response.length;
               tutorData = response;
            }

            // Show success toast
            addToast("success", `Tìm thấy ${tutorCount} gia sư phù hợp`);

            // Set the search query in regular filters
            props.onFilterChange({ searchQuery: aiSearchQuery });

            // Pass AI results to parent component
            if (props.onAISearchResults && tutorData) {
               // Pass the entire response to let parent handle structure
               props.onAISearchResults(response);
            }

            // Clear AI search input after successful search
            setAiSearchQuery("");
         },
         onError: (error: any) => {
            console.error("AI Search Error:", error);
            addToast(
               "error",
               error?.message || "Không thể thực hiện tìm kiếm AI"
            );
         },
      });
   };

   const handleKeyPress = (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
         handleAISearch();
      }
   };

   return (
      <div className="px-6 py-4 space-y-4">
         {/* AI Search Bar */}
         <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-2 mb-2">
               <Sparkles className="h-4 w-4 text-purple-600" />
               <span className="text-sm font-medium text-purple-800 dark:text-purple-200">
                  AI Smart Search
               </span>
            </div>
            <div className="flex w-full max-w-2xl gap-2">
               <Input
                  placeholder="Tìm kiếm thông minh với AI: 'giáo viên toán giỏi', 'gia sư có kinh nghiệm dạy IELTS'..."
                  value={aiSearchQuery}
                  onChange={(e) => setAiSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="h-10 flex-1 bg-white dark:bg-gray-900"
                  disabled={tutorSearch.isPending}
               />
               <Button
                  onClick={handleAISearch}
                  disabled={!aiSearchQuery.trim() || tutorSearch.isPending}
                  className="h-10 bg-purple-600 hover:bg-purple-700 text-white shrink-0 min-w-[100px]"
               >
                  {tutorSearch.isPending ? (
                     <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Đang tìm...
                     </>
                  ) : (
                     <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        AI Search
                     </>
                  )}
               </Button>
            </div>
            {tutorSearch.isPending && (
               <div className="mt-2 text-xs text-purple-600 dark:text-purple-400">
                  AI đang phân tích và tìm kiếm gia sư phù hợp...
               </div>
            )}
         </div>
      </div>
   );
};

export default AISearch;
