import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import {
   MapPin,
   Clock,
   GraduationCap,
   DollarSign,
   ChevronDown,
   X,
   Search,
   BookOpen,
   Layers,
} from "lucide-react";
import type { Tutor } from "@/types/Tutor";
import { Level, LEVEL_VALUES } from "@/enums/level.enum";
import { SUBJECT_VALUES } from "@/enums/subject.enum";
import { TimeSlot } from "@/enums/timeSlot.enum";

const getLevelDisplayName = (level: Level): string => {
   const levelMap: Record<Level, string> = {
      [Level.GRADE_1]: "Grade 1",
      [Level.GRADE_2]: "Grade 2",
      [Level.GRADE_3]: "Grade 3",
      [Level.GRADE_4]: "Grade 4",
      [Level.GRADE_5]: "Grade 5",
      [Level.GRADE_6]: "Grade 6",
      [Level.GRADE_7]: "Grade 7",
      [Level.GRADE_8]: "Grade 8",
      [Level.GRADE_9]: "Grade 9",
      [Level.GRADE_10]: "Grade 10",
      [Level.GRADE_11]: "Grade 11",
      [Level.GRADE_12]: "Grade 12",
      [Level.UNIVERSITY]: "University",
   };
   return levelMap[level];
};

interface TutorFilterBarProps {
   currentFilters: {
      searchQuery: string;
      priceRange: [number, number];
      ratingRange: [number, number];
      selectedTimeSlots: string[];
      selectedDays: string[];
      isOnline: boolean | null;
      selectedSubjects: string[];
      selectedLocation: string;
      experienceYears: [number, number];
      selectedClassTypes: string[];
      selectedLevels: string[];
   };
   onFilterChange: (
      newFilters: Partial<TutorFilterBarProps["currentFilters"]>
   ) => void;
   onApplyFilters: () => void;
   onClearFilters: () => void;
   tutors: Tutor[];
}

export function TutorFilterBar({
   currentFilters,
   onFilterChange,
   onApplyFilters,
   onClearFilters,
}: TutorFilterBarProps) {
   const getActiveFilterCount = () => {
      let count = 0;
      if (
         currentFilters.ratingRange[0] > 0 ||
         currentFilters.ratingRange[1] < 5
      )
         count++;
      if (currentFilters.selectedSubjects.length > 0) count++;
      if (currentFilters.selectedLocation) count++;
      if (currentFilters.selectedTimeSlots.length > 0) count++;
      if (currentFilters.selectedDays.length > 0) count++;
      if (currentFilters.selectedClassTypes.length > 0) count++;
      if (currentFilters.selectedLevels.length > 0) count++;
      if (
         currentFilters.priceRange[0] > 0 ||
         currentFilters.priceRange[1] < 2000000
      )
         count++;
      if (
         currentFilters.experienceYears[0] > 0 ||
         currentFilters.experienceYears[1] < 20
      )
         count++;
      return count;
   };

   const activeFilterCount = getActiveFilterCount();

   return (
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
         <div className="px-6 py-4 space-y-3">
            <div className="flex flex-col md:flex-row gap-3">
               {/* Search Input */}
               <div className="flex flex-1 md:w-1/2">
                  <Input
                     placeholder="Search by name..."
                     value={currentFilters.searchQuery}
                     onChange={(e) =>
                        onFilterChange({ searchQuery: e.target.value })
                     }
                     className="h-10 rounded-r-none"
                  />
                  <Button
                     onClick={() => onApplyFilters()}
                     className="h-10 rounded-l-none bg-blue-600 hover:bg-blue-700 text-white"
                  >
                     <Search className="h-4 w-4" />
                  </Button>
               </div>

               {/* Levels, Class Type, Subjects */}
               <div className="flex flex-1 md:w-1/2 items-center gap-2 flex-wrap">
                  {/* Levels Filter */}
                  <Popover>
                     <PopoverTrigger asChild>
                        <Button
                           variant="outline"
                           className="h-10 gap-2 bg-transparent"
                        >
                           <Layers className="h-4 w-4" />
                           Levels
                           {currentFilters.selectedLevels.length > 0 && (
                              <Badge
                                 variant="secondary"
                                 className="ml-1 h-5 px-1.5 text-xs"
                              >
                                 {currentFilters.selectedLevels.length}
                              </Badge>
                           )}
                           <ChevronDown className="h-4 w-4" />
                        </Button>
                     </PopoverTrigger>
                     <PopoverContent
                        className="w-60 max-h-80 overflow-y-auto"
                        align="start"
                     >
                        <div className="space-y-4">
                           <h4 className="font-medium text-sm">
                              Education Levels
                           </h4>
                           <div className="space-y-2">
                              {LEVEL_VALUES.map((level) => (
                                 <div
                                    key={level}
                                    className="flex items-center space-x-2"
                                 >
                                    <Checkbox
                                       id={`level-${level}`}
                                       checked={currentFilters.selectedLevels.includes(
                                          level
                                       )}
                                       onCheckedChange={(checked) => {
                                          onFilterChange({
                                             selectedLevels: checked
                                                ? [
                                                     ...currentFilters.selectedLevels,
                                                     level,
                                                  ]
                                                : currentFilters.selectedLevels.filter(
                                                     (l) => l !== level
                                                  ),
                                          });
                                       }}
                                    />
                                    <Label
                                       htmlFor={`level-${level}`}
                                       className="text-sm"
                                    >
                                       {getLevelDisplayName(level)}
                                    </Label>
                                 </div>
                              ))}
                           </div>
                        </div>
                     </PopoverContent>
                  </Popover>

                  {/* Class Type Filter */}
                  <Popover>
                     <PopoverTrigger asChild>
                        <Button
                           variant="outline"
                           className="h-10 gap-2 bg-transparent"
                        >
                           <BookOpen className="h-4 w-4" />
                           Class Type
                           {currentFilters.selectedClassTypes.length > 0 && (
                              <Badge
                                 variant="secondary"
                                 className="ml-1 h-5 px-1.5 text-xs"
                              >
                                 {currentFilters.selectedClassTypes.length}
                              </Badge>
                           )}
                           <ChevronDown className="h-4 w-4" />
                        </Button>
                     </PopoverTrigger>
                     <PopoverContent className="w-60" align="start">
                        <div className="space-y-4">
                           <h4 className="font-medium text-sm">Class Type</h4>
                           <div className="space-y-2">
                              {[
                                 { value: "ONLINE", label: "Online" },
                                 { value: "IN_PERSON", label: "In Person" },
                              ].map((classType) => (
                                 <div
                                    key={classType.value}
                                    className="flex items-center space-x-2"
                                 >
                                    <Checkbox
                                       id={`classType-${classType.value}`}
                                       checked={currentFilters.selectedClassTypes.includes(
                                          classType.value
                                       )}
                                       onCheckedChange={(checked) => {
                                          onFilterChange({
                                             selectedClassTypes: checked
                                                ? [
                                                     ...currentFilters.selectedClassTypes,
                                                     classType.value,
                                                  ]
                                                : currentFilters.selectedClassTypes.filter(
                                                     (c) =>
                                                        c !== classType.value
                                                  ),
                                          });
                                       }}
                                    />
                                    <Label
                                       htmlFor={`classType-${classType.value}`}
                                       className="text-sm"
                                    >
                                       {classType.label}
                                    </Label>
                                 </div>
                              ))}
                           </div>
                        </div>
                     </PopoverContent>
                  </Popover>

                  {/* Subjects Filter */}
                  <Popover>
                     <PopoverTrigger asChild>
                        <Button
                           variant="outline"
                           className="h-10 gap-2 bg-transparent"
                        >
                           <GraduationCap className="h-4 w-4" />
                           Subjects
                           {currentFilters.selectedSubjects.length > 0 && (
                              <Badge
                                 variant="secondary"
                                 className="ml-1 h-5 px-1.5 text-xs"
                              >
                                 {currentFilters.selectedSubjects.length}
                              </Badge>
                           )}
                           <ChevronDown className="h-4 w-4" />
                        </Button>
                     </PopoverTrigger>
                     <PopoverContent className="w-80" align="start">
                        <div className="space-y-4">
                           <h4 className="font-medium text-sm">
                              Select Subjects
                           </h4>
                           <div className="space-y-2 max-h-60 overflow-y-auto">
                              {SUBJECT_VALUES.map((subject) => (
                                 <div
                                    key={subject}
                                    className="flex items-center space-x-2"
                                 >
                                    <Checkbox
                                       id={`subject-${subject}`}
                                       checked={currentFilters.selectedSubjects.includes(
                                          subject
                                       )}
                                       onCheckedChange={(checked) => {
                                          onFilterChange({
                                             selectedSubjects: checked
                                                ? [
                                                     ...currentFilters.selectedSubjects,
                                                     subject,
                                                  ]
                                                : currentFilters.selectedSubjects.filter(
                                                     (s) => s !== subject
                                                  ),
                                          });
                                       }}
                                    />
                                    <Label
                                       htmlFor={`subject-${subject}`}
                                       className="text-sm"
                                    >
                                       {subject}
                                    </Label>
                                 </div>
                              ))}
                           </div>
                        </div>
                     </PopoverContent>
                  </Popover>
               </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
               <Popover>
                  <PopoverTrigger asChild>
                     <Button
                        variant="outline"
                        className="h-10 gap-2 bg-transparent"
                     >
                        <MapPin className="h-4 w-4" />
                        Location
                        {currentFilters.selectedLocation && (
                           <Badge
                              variant="secondary"
                              className="ml-1 h-5 px-1.5 text-xs"
                           >
                              •
                           </Badge>
                        )}
                        <ChevronDown className="h-4 w-4" />
                     </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80" align="start">
                     <div className="space-y-4">
                        <h4 className="font-medium text-sm">
                           Filter by Location
                        </h4>
                        <Input
                           placeholder="Search by city or state"
                           value={currentFilters.selectedLocation}
                           onChange={(e) =>
                              onFilterChange({
                                 selectedLocation: e.target.value,
                              })
                           }
                        />
                     </div>
                  </PopoverContent>
               </Popover>

               {/* Rating Filter */}
               {/* <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="h-10 gap-2 bg-transparent">
                                <Star className="h-4 w-4" />
                                Rating
                                {(currentFilters.ratingRange[0] > 0 || currentFilters.ratingRange[1] < 5) && (
                                    <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                                        •
                                    </Badge>
                                )}
                                <ChevronDown className="h-4 w-4" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80" align="start">
                            <div className="space-y-6">
                                <div>
                                    <Label className="text-sm font-medium mb-3 block">
                                        Rating: {currentFilters.ratingRange[0]} - {currentFilters.ratingRange[1]} stars
                                    </Label>
                                    <Slider
                                        value={currentFilters.ratingRange}
                                        onValueChange={(value) => onFilterChange({ ratingRange: value as [number, number] })}
                                        max={5}
                                        step={0.5}
                                        className="w-full"
                                    />
                                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                                        <span>0</span>
                                        <span>1</span>
                                        <span>2</span>
                                        <span>3</span>
                                        <span>4</span>
                                        <span>5</span>
                                    </div>
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>
 */}
               {/* Price & Experience Filter */}
               <Popover>
                  <PopoverTrigger asChild>
                     <Button
                        variant="outline"
                        className="h-10 gap-2 bg-transparent"
                     >
                        <DollarSign className="h-4 w-4" />
                        Price & Experience
                        {(currentFilters.priceRange[0] > 0 ||
                           currentFilters.priceRange[1] < 2000000 ||
                           currentFilters.experienceYears[0] > 0 ||
                           currentFilters.experienceYears[1] < 20) && (
                           <Badge
                              variant="secondary"
                              className="ml-1 h-5 px-1.5 text-xs"
                           >
                              •
                           </Badge>
                        )}
                        <ChevronDown className="h-4 w-4" />
                     </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80" align="start">
                     <div className="space-y-6">
                        <div>
                           <Label className="text-sm font-medium mb-3 block">
                              Price Range:{" "}
                              {currentFilters.priceRange[0].toLocaleString()}{" "}
                              vnd -{" "}
                              {currentFilters.priceRange[1].toLocaleString()}{" "}
                              vnd/hr
                           </Label>
                           <Slider
                              value={currentFilters.priceRange}
                              onValueChange={(value) =>
                                 onFilterChange({
                                    priceRange: value as [number, number],
                                 })
                              }
                              max={2000000}
                              step={100000}
                              className="w-full"
                           />
                        </div>
                        <div>
                           <Label className="text-sm font-medium mb-3 block">
                              Experience: {currentFilters.experienceYears[0]} -{" "}
                              {currentFilters.experienceYears[1]} years
                           </Label>
                           <Slider
                              value={currentFilters.experienceYears}
                              onValueChange={(value) =>
                                 onFilterChange({
                                    experienceYears: value as [number, number],
                                 })
                              }
                              max={20}
                              step={1}
                              className="w-full"
                           />
                        </div>
                     </div>
                  </PopoverContent>
               </Popover>

               {/* Schedule Filter */}
               <Popover>
                  <PopoverTrigger asChild>
                     <Button
                        variant="outline"
                        className="h-10 gap-2 bg-transparent"
                     >
                        <Clock className="h-4 w-4" />
                        Schedule
                        {(currentFilters.selectedTimeSlots.length > 0 ||
                           currentFilters.selectedDays.length > 0) && (
                           <Badge
                              variant="secondary"
                              className="ml-1 h-5 px-1.5 text-xs"
                           >
                              {currentFilters.selectedTimeSlots.length +
                                 currentFilters.selectedDays.length}
                           </Badge>
                        )}
                        <ChevronDown className="h-4 w-4" />
                     </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80" align="start">
                     <div className="space-y-6">
                        <div>
                           <Label className="text-sm font-medium mb-3 block">
                              Time of Day
                           </Label>
                           <div className="space-y-2">
                              {[
                                 TimeSlot.PRE_12,
                                 TimeSlot.MID_12_17,
                                 TimeSlot.AFTER_17,
                              ].map((slot) => (
                                 <div
                                    key={slot}
                                    className="flex items-center space-x-2"
                                 >
                                    <Checkbox
                                       id={slot.toLowerCase()}
                                       checked={currentFilters.selectedTimeSlots.includes(
                                          slot
                                       )}
                                       onCheckedChange={(checked) =>
                                          onFilterChange({
                                             selectedTimeSlots: checked
                                                ? [
                                                     ...currentFilters.selectedTimeSlots,
                                                     slot,
                                                  ]
                                                : currentFilters.selectedTimeSlots.filter(
                                                     (s) => s !== slot
                                                  ),
                                          })
                                       }
                                    />
                                    <Label htmlFor={slot.toLowerCase()}>
                                       {slot}
                                    </Label>
                                 </div>
                              ))}
                           </div>
                        </div>
                        <div>
                           <Label className="text-sm font-medium mb-3 block">
                              Days of Week
                           </Label>
                           <div className="grid grid-cols-2 gap-2">
                              {[
                                 "Monday",
                                 "Tuesday",
                                 "Wednesday",
                                 "Thursday",
                                 "Friday",
                                 "Saturday",
                                 "Sunday",
                              ].map((day) => (
                                 <div
                                    key={day}
                                    className="flex items-center space-x-2"
                                 >
                                    <Checkbox
                                       id={day.toLowerCase()}
                                       checked={currentFilters.selectedDays.includes(
                                          day
                                       )}
                                       onCheckedChange={(checked) =>
                                          onFilterChange({
                                             selectedDays: checked
                                                ? [
                                                     ...currentFilters.selectedDays,
                                                     day,
                                                  ]
                                                : currentFilters.selectedDays.filter(
                                                     (d) => d !== day
                                                  ),
                                          })
                                       }
                                    />
                                    <Label
                                       htmlFor={day.toLowerCase()}
                                       className="text-xs"
                                    >
                                       {day.slice(0, 3)}
                                    </Label>
                                 </div>
                              ))}
                           </div>
                        </div>
                     </div>
                  </PopoverContent>
               </Popover>

               {/* Action Buttons */}
               <div className="flex items-center gap-2 ml-2 pl-2 border-l border-gray-200">
                  <Button onClick={onApplyFilters} className="h-10">
                     Apply
                  </Button>
                  {activeFilterCount > 0 && (
                     <Button
                        variant="ghost"
                        onClick={onClearFilters}
                        className="h-10 px-3"
                     >
                        <X className="h-4 w-4" />
                     </Button>
                  )}
               </div>
            </div>
         </div>
      </div>
   );
}
