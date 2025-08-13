// src/hooks/useScheduleSessions.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getScheduleSessions,
    createScheduleSession,
    updateScheduleSession,
    deleteScheduleSession,
    ScheduleSession,
    UpsertScheduleSession,
    PopulatedScheduleSession,
} from "@/api/schedules";

/**
 * Custom hook to manage schedule session data and actions.
 */
export const useScheduleSessions = () => {
    const queryClient = useQueryClient();

    // Query to fetch the list of sessions
    const {
        data: sessions = [],
        isLoading,
        isError,
    } = useQuery<PopulatedScheduleSession[], Error>({
        queryKey: ["scheduleSessions"],
        queryFn: getScheduleSessions,
    });

    // Mutation to create a new session
    const { mutate: createSession, isPending: isCreating } = useMutation<
        ScheduleSession,
        Error,
        UpsertScheduleSession
    >({
        mutationFn: createScheduleSession,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["scheduleSessions"] });
        },
    });

    // Mutation to update a session
    const { mutate: updateSession, isPending: isUpdating } = useMutation<
        ScheduleSession,
        Error,
        { id: string } & UpsertScheduleSession
    >({
        mutationFn: updateScheduleSession,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["scheduleSessions"] });
        },
    });

    // Mutation to delete a session
    const { mutate: deleteSession, isPending: isDeleting } = useMutation<
        void,
        Error,
        string
    >({
        mutationFn: deleteScheduleSession,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["scheduleSessions"] });
        },
    });

    return {
        sessions,
        isLoading,
        isError,
        createSession,
        isCreating,
        updateSession,
        isUpdating,
        deleteSession,
        isDeleting,
    };
};
