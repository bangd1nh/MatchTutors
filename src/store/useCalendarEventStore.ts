import { create } from "zustand";
import { SSchedulesBody } from "../types/suggestionSchedules";
import { Session } from "@/types/session";

export interface CalendarEventItem {
   start: Date;
   end: Date;
   resource?: Session | any;
   isBusy?: boolean;
   title?: string;
}

type CalendarEventChangeType =
   | "drop"
   | "resize"
   | "selectEvent"
   | "selectSlot"
   | "remove";

interface CalendarEventChange {
   type: CalendarEventChangeType;
   sessionId?: string;
   startTime?: string;
   endTime?: string;
}

interface CalendarEventState {
   events: CalendarEventItem[];
   title: string;
   proposedTotalPrice: number;
   location: string;
   teachingRequestId: string;
   lastChange?: CalendarEventChange;
   setEvents: (events: CalendarEventItem[]) => void;
   addEvent: (event: CalendarEventItem) => void;
   updateEventTime: (start: Date, end: Date) => void;
   removeEvent: (sessionId: string) => void;
   setChange: (change: CalendarEventChange) => void;
   getEvents: () => SSchedulesBody;
   setTitle: (title: string) => void;
   getTitle: () => string;
   setProposedTotalPrice: (price: number) => void;
   getProposedTotalPrice: () => number;
   setLocation: (location: string) => void;
   getLocation: () => string;
   setTeachingRequestId: (tlId: string) => void;
   reset: () => void;
}

export const useCalendarEventStore = create<CalendarEventState>((set, get) => ({
   events: [],
   title: "lịch đề xuất",
   proposedTotalPrice: 0,
   location: "",
   teachingRequestId: "",
   lastChange: undefined,
   setEvents: (events) =>
      set((state) => ({
         events: events.map((evt) => ({ ...evt, title: state.title })),
      })),
   addEvent: (event) =>
      set((state) => ({
         events: [...state.events, { ...event, title: state.title }],
      })),
   updateEventTime: (start, end) =>
      set((state) => ({
         events: state.events.map((evt) => {
            return { ...evt, start, end };
         }),
      })),
   removeEvent: (sessionId) =>
      set((state) => ({
         events: state.events.filter(
            (evt) => evt.resource?._id !== sessionId
         ),
      })),
   setChange: (change) => set({ lastChange: change }),
   setTeachingRequestId: (teachingRequestId) => set({ teachingRequestId }),
   getEvents: () => {
      const currentEvent = get().events;
      const location = get().location;
      const payload = {
         TRId: get().teachingRequestId,
         title: get().title,
         proposedTotalPrice: get().proposedTotalPrice,
         location: location,
         schedules: [
            ...currentEvent.map((e) => {
               return { 
                  start: e.start, 
                  end: e.end,
                  location: location || undefined
               };
            }),
         ],
      };
      return payload;
   },
   setTitle: (title) => {
      set((state) => ({
         title,
         events: state.events.map((evt) => ({ ...evt, title })),
      }));
   },
   getTitle: () => get().title,
   setProposedTotalPrice: (price) => set({ proposedTotalPrice: price }),
   getProposedTotalPrice: () => get().proposedTotalPrice,
   setLocation: (location) => set({ location }),
   getLocation: () => get().location,
   reset: () => set({ lastChange: undefined }),
}));
