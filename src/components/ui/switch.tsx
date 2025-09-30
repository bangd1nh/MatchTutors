import React, { forwardRef } from "react";

type SwitchProps = {
   checked?: boolean;
   onCheckedChange?: (checked: boolean) => void;
   disabled?: boolean;
   className?: string;
   id?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

const Switch = forwardRef<HTMLInputElement, SwitchProps>(
   (
      { checked, onCheckedChange, disabled, className = "", id, ...rest },
      ref
   ) => {
      const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
         onCheckedChange?.(e.target.checked);
         if (rest.onChange) rest.onChange(e);
      };

      const isChecked = !!checked;

      return (
         <label
            htmlFor={id}
            className={`relative inline-flex items-center ${
               disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            } ${className}`}
         >
            <input
               id={id}
               ref={ref}
               type="checkbox"
               role="switch"
               checked={isChecked}
               onChange={handleChange}
               disabled={disabled}
               className="sr-only"
               {...rest}
            />
            <span
               aria-hidden
               className={`w-10 h-6 rounded-full transition-colors duration-200 ${
                  isChecked ? "bg-sky-600" : "bg-slate-300 dark:bg-slate-700"
               }`}
            />
            <span
               aria-hidden
               className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-200 ${
                  isChecked ? "translate-x-4" : "translate-x-0"
               }`}
            />
         </label>
      );
   }
);

Switch.displayName = "Switch";

export default Switch;
