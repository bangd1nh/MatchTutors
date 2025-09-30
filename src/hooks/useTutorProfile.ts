// hooks/useTutorProfile.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMyTutorProfile, createTutorProfile, updateTutorProfile } from '@/api/tutorProfile';
export const useTutorProfile = () => {
    const queryClient = useQueryClient();

    const {
        data: tutorProfile,
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey: ['tutorProfile'],
        queryFn: getMyTutorProfile,
        retry: false, // Don't retry on 404 (profile not found)
    });

    const createMutation = useMutation({
        mutationFn: createTutorProfile,
        onSuccess: (newTutor) => {
            queryClient.setQueryData(['tutorProfile'], newTutor);
        },
    });

    const updateMutation = useMutation({
        mutationFn: updateTutorProfile,
        onSuccess: (updatedTutor) => {
            queryClient.setQueryData(['tutorProfile'], updatedTutor);
        },
    });

    return {
        tutorProfile,
        isLoading,
        error,
        refetch,
        createTutor: createMutation.mutateAsync,
        updateTutor: updateMutation.mutateAsync,
        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
    };
};