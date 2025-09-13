import { getMyTutorProfile, createTutorProfile, updateTutorProfile, deleteCertificationImage } from "@/api/tutor";
import { useQuery, useQueryClient, useMutation, UseMutationOptions } from "@tanstack/react-query";
import { Tutor } from "@/types/Tutor";
import { useToast } from "./useToast";

// 🔹 My tutor profile
export const useTutorProfile = () =>
    useQuery({
        queryKey: ["tutor", "me"],
        queryFn: getMyTutorProfile,
    });

// 🔹 Create tutor profile
export const useCreateTutorProfile = (options?: UseMutationOptions<Tutor, Error, FormData>) => {
    const queryClient = useQueryClient();
    const toast = useToast();

    return useMutation({
        mutationFn: (formData: FormData) => createTutorProfile(formData),
        onSuccess: (data, variables, context) => {
            queryClient.invalidateQueries({ queryKey: ["tutor", "me"] });
            queryClient.invalidateQueries({ queryKey: ["tutors"] });
            queryClient.invalidateQueries({ queryKey: ["tutors", "approved"] });

            // Set the new tutor data in cache
            queryClient.setQueryData(["tutor", "me"], data);

            // Call custom onSuccess if provided
            options?.onSuccess?.(data, variables, context);

            toast("success", "Tutor profile created successfully!");
        },
        onError: (error, variables, context) => {
            // Call custom onError if provided
            options?.onError?.(error, variables, context);

            toast("error", error.message || "Failed to create tutor profile");
        },
        ...options,
    });
};

// 🔹 Update tutor profile
export const useUpdateTutorProfile = (options?: UseMutationOptions<Tutor, Error, FormData>) => {
    const queryClient = useQueryClient();
    const toast = useToast();

    return useMutation({
        mutationFn: (formData: FormData) => updateTutorProfile(formData),
        onSuccess: (data, variables, context) => {
            // Update the cache with new data
            queryClient.setQueryData(["tutor", "me"], data);
            queryClient.invalidateQueries({ queryKey: ["tutors"] });
            queryClient.invalidateQueries({ queryKey: ["tutors", "approved"] });

            // Also update any individual tutor queries that might be cached
            queryClient.setQueryData(["tutor", data._id], data);

            // Call custom onSuccess if provided
            options?.onSuccess?.(data, variables, context);

            toast("success", "Tutor profile updated successfully!");
        },
        onError: (error, variables, context) => {
            // Call custom onError if provided
            options?.onError?.(error, variables, context);

            toast("error", error.message || "Failed to update tutor profile");
        },
        ...options,
    });
};

// 🔹 Delete certification image
export const useDeleteCertificationImage = (options?: UseMutationOptions<Tutor, Error, { certIndex: number; imageIndex: number }>) => {
    const queryClient = useQueryClient();
    const toast = useToast();

    return useMutation({
        mutationFn: ({ certIndex, imageIndex }: { certIndex: number; imageIndex: number }) =>
            deleteCertificationImage(certIndex, imageIndex),
        onSuccess: (data, variables, context) => {
            // Update the cache with the modified tutor data
            queryClient.setQueryData(["tutor", "me"], data);
            queryClient.setQueryData(["tutor", data._id], data);

            // Call custom onSuccess if provided
            options?.onSuccess?.(data, variables, context);

            toast("success", "Certification image deleted successfully");
        },
        onError: (error, variables, context) => {
            // Call custom onError if provided
            options?.onError?.(error, variables, context);

            toast("error", error.message || "Failed to delete certification image");
        },
        ...options,
    });
};

// 🔹 Optimistic update for tutor profile
export const useOptimisticUpdateTutor = () => {
    const queryClient = useQueryClient();
    const updateMutation = useUpdateTutorProfile();

    return async (updates: Partial<Tutor>) => {
        const previousTutor = queryClient.getQueryData<Tutor>(["tutor", "me"]);

        if (!previousTutor) return;

        // Optimistically update the cache
        const optimisticTutor = { ...previousTutor, ...updates };
        queryClient.setQueryData(["tutor", "me"], optimisticTutor);

        try {
            // Convert updates to FormData for the API
            const formData = new FormData();
            Object.entries(updates).forEach(([key, value]) => {
                if (value !== undefined) {
                    if (typeof value === 'object') {
                        formData.append(key, JSON.stringify(value));
                    } else {
                        formData.append(key, value.toString());
                    }
                }
            });

            await updateMutation.mutateAsync(formData);
        } catch (error) {
            // Revert on error
            queryClient.setQueryData(["tutor", "me"], previousTutor);
            throw error;
        }
    };
};