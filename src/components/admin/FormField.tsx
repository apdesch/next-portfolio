import type { FC, ReactNode } from "react";

type FormFieldProps = {
  // The control's id; its error message gets the id `${name}-error`.
  name: string;
  label: string;
  errorMessage?: string;
  className?: string;
  children: ReactNode;
};

// A label above its control, with the field's error message below it.
const FormField: FC<FormFieldProps> = ({
  name,
  label,
  errorMessage,
  className,
  children,
}) => (
  <div className={className}>
    <label htmlFor={name} className="mb-1 block text-sm font-medium">
      {label}
    </label>
    {children}
    {errorMessage && (
      <p
        id={`${name}-error`}
        className="mt-1 mb-0 text-sm text-red-700 dark:text-red-400"
      >
        {errorMessage}
      </p>
    )}
  </div>
);

export default FormField;
