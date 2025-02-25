import React from "react";

interface CheckboxInputProps {
  label: string;
  checked: boolean;
  onChange: (newValue: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export const CheckboxInput: React.FC<CheckboxInputProps> = ({
  label,
  checked,
  onChange,
  disabled = false,
  className = "",
}) => {
  return (
    <label
      className={`
        flex items-center gap-2
        p-2
        rounded
        bg-gray-50 dark:bg-gray-700
        cursor-pointer
        ${disabled ? "opacity-60 cursor-not-allowed" : ""}
        ${className}
      `}
    >
      <input
        type="checkbox"
        className="form-checkbox h-4 w-4 text-blue-600"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
      />
      <span>{label}</span>
    </label>
  );
};
