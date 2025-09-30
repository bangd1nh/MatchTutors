// hooks/useTutorFormValidation.ts
import { useState, useCallback } from "react";
import { ZodError } from "zod";
import { tutorProfileFormSchema, tutorProfileEditSchema, TutorProfileFormData } from "@/validation/tutorProfileSchema";
import { getFieldErrors, getFirstErrorForField, FieldErrors } from "@/lib/validationUtils";

export function useTutorFormValidation() {
    const [errors, setErrors] = useState<FieldErrors>({});
    const [hasErrors, setHasErrors] = useState(false);

    // Real-time validation for individual fields
    const validateField = useCallback((field: string, value: any, isEditing: boolean = false) => {
        try {
            const schema = isEditing ? tutorProfileEditSchema : tutorProfileFormSchema;

            // Validate just this field using the schema's shape
            schema.shape[field as keyof typeof schema.shape].parse(value);

            // If valid, remove any existing error for this field
            setErrors((prev: FieldErrors) => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });

            return true;
        } catch (error) {
            if (error instanceof ZodError) {
                const fieldErrors = getFieldErrors(error);
                setErrors((prev: FieldErrors) => ({ ...prev, ...fieldErrors }));
                return false;
            }
            return false;
        }
    }, []);

    // Full form validation (for save)
    const validateForm = useCallback((data: TutorProfileFormData, isEditing: boolean = false) => {
        try {
            const schema = isEditing ? tutorProfileEditSchema : tutorProfileFormSchema;
            schema.parse(data);
            setErrors({});
            setHasErrors(false);
            return { isValid: true, errors: {} };
        } catch (error) {
            if (error instanceof ZodError) {
                const fieldErrors = getFieldErrors(error);
                setErrors(fieldErrors);
                setHasErrors(true);
                return { isValid: false, errors: fieldErrors };
            }
            throw error;
        }
    }, []);

    const getError = (fieldName: string): string | null => {
        return getFirstErrorForField(errors, fieldName);
    };

    const hasError = (fieldName: string): boolean => {
        return !!getError(fieldName);
    };

    const clearErrors = () => {
        setErrors({});
        setHasErrors(false);
    };

    const clearFieldError = (fieldName: string) => {
        setErrors((prev: FieldErrors) => {
            const newErrors = { ...prev };
            delete newErrors[fieldName];
            return newErrors;
        });
    };

    return {
        errors,
        hasErrors,
        validateForm,
        validateField,
        getError,
        hasError,
        clearErrors,
        clearFieldError,
    };
}