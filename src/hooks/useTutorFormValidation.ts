// hooks/useTutorFormValidation.ts
import { useState, useCallback, useRef } from "react";
import { ZodError } from "zod";
import { tutorProfileFormSchema, tutorProfileEditSchema, TutorProfileFormData } from "@/validation/tutorProfileSchema";
import { getFieldErrors, getFirstErrorForField, FieldErrors } from "@/lib/validationUtils";

export function useTutorFormValidation() {
    const [errors, setErrors] = useState<FieldErrors>({});
    const [hasErrors, setHasErrors] = useState(false);
    const errorFieldsRef = useRef<Set<string>>(new Set());

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

            // Remove from error fields set
            errorFieldsRef.current.delete(field);

            return true;
        } catch (error) {
            if (error instanceof ZodError) {
                const fieldErrors = getFieldErrors(error);
                setErrors((prev: FieldErrors) => ({ ...prev, ...fieldErrors }));

                // Add to error fields set
                errorFieldsRef.current.add(field);

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
            errorFieldsRef.current.clear();
            return { isValid: true, errors: {} };
        } catch (error) {
            if (error instanceof ZodError) {
                const fieldErrors = getFieldErrors(error);
                setErrors(fieldErrors);
                setHasErrors(true);

                // Update error fields set
                errorFieldsRef.current.clear();
                Object.keys(fieldErrors).forEach(field => {
                    errorFieldsRef.current.add(field);
                });

                return { isValid: false, errors: fieldErrors };
            }
            throw error;
        }
    }, []);

    // NEW: Scroll to first error field
    const scrollToFirstError = useCallback(() => {
        if (errorFieldsRef.current.size === 0) return;

        // Try to find the first error field and scroll to it
        const firstErrorField = Array.from(errorFieldsRef.current)[0];

        // Give a small delay to ensure DOM is updated
        setTimeout(() => {
            // Try different selectors for the error field
            const selectors = [
                `[name="${firstErrorField}"]`,
                `[id="${firstErrorField}"]`,
                `#${firstErrorField}`,
                `input[name*="${firstErrorField}"]`,
                `select[name*="${firstErrorField}"]`,
                `textarea[name*="${firstErrorField}"]`,
            ];

            for (const selector of selectors) {
                const element = document.querySelector(selector) as HTMLElement;
                if (element) {
                    element.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                    element.focus();
                    break;
                }
            }

            // If no specific element found, scroll to the section
            if (firstErrorField.includes('education') || firstErrorField.includes('startDate') || firstErrorField.includes('endDate')) {
                const educationSection = document.querySelector('[class*="education"]') as HTMLElement;
                if (educationSection) {
                    educationSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                }
            }
        }, 100);
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
        errorFieldsRef.current.clear();
    };

    const clearFieldError = (fieldName: string) => {
        setErrors((prev: FieldErrors) => {
            const newErrors = { ...prev };
            delete newErrors[fieldName];
            return newErrors;
        });
        errorFieldsRef.current.delete(fieldName);
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
        scrollToFirstError,
        errorFields: errorFieldsRef.current,
    };
}