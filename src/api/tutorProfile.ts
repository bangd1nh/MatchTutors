// api/tutorProfile.ts
import apiClient from '@/lib/api';
import type { Tutor } from '@/types/tutorListandDetail';

export const getMyTutorProfile = async (): Promise<Tutor | null> => {
    try {
        const response = await apiClient.get('/tutor/me');
        return response.data.data;
    } catch (error: any) {
        if (error.response?.status === 404) {
            return null; // Profile doesn't exist yet
        }
        throw error;
    }
};

export const createTutorProfile = async (formData: FormData): Promise<Tutor> => {
    const response = await apiClient.post('/tutor/profile', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data.data;
};

export const updateTutorProfile = async (formData: FormData): Promise<Tutor> => {
    const response = await apiClient.put('/tutor/profile', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data.data;
};

export const deleteCertificationImage = async (
    certificationIndex: number,
    imageIndex: number
): Promise<Tutor> => {
    const response = await apiClient.delete(
        `/tutor/certification-image/${certificationIndex}/${imageIndex}`
    );
    return response.data.data;
};