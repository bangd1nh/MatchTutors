// components/ValidationError.tsx
import { useEffect, useState } from 'react';

interface ValidationErrorProps {
    message?: string | null;
    className?: string;
    show?: boolean; // Control visibility
}

export function ValidationError({ message, className = "", show = true }: ValidationErrorProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (message && show) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    }, [message, show]);

    if (!isVisible) return null;

    return (
        <p className={`text-sm text-red-600 mt-1 transition-opacity duration-200 ${className}`}>
            {message}
        </p>
    );
}