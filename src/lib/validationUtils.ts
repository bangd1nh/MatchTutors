import { ZodError } from "zod";

export type FieldErrors = {
    [key: string]: string[];
};

export function getFieldErrors(zodError: ZodError): FieldErrors {
    const errors: FieldErrors = {};

    zodError.issues.forEach((error) => {
        const path = error.path.join(".");
        if (!errors[path]) {
            errors[path] = [];
        }
        errors[path].push(error.message);
    });

    return errors;
}

export function getFirstErrorForField(fieldErrors: FieldErrors, fieldName: string): string | null {
    return fieldErrors[fieldName]?.[0] || null;
}