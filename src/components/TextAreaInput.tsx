"use client";
import { useState, ChangeEvent, FocusEvent } from "react";

interface TextAreaInputProps {
  placeholder?: string;
  className?: string;
  value?: string;
  onChange?: (newValue: string) => void;
  isError?: boolean;
  required?: boolean;
  rows?: number;
}

export function TextAreaInput({
  placeholder = "Escreva aqui...",
  className = "",
  value = "",
  onChange,
  isError = false,
  required = false,
  rows = 4,
}: TextAreaInputProps) {
  const [textValue, setTextValue] = useState(value);
  const [localError, setLocalError] = useState(isError);

  if (value !== textValue) {
    setTextValue(value);
  }
  if (isError !== localError) {
    setLocalError(isError);
  }

  function handleTextChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setTextValue(e.target.value);
    onChange?.(e.target.value);
  }

  function handleFocus(e: FocusEvent<HTMLTextAreaElement>) {
    setLocalError(false);
  }

  return (
    <div
      className={`relative ${className}`}
      onClick={() => {
        setLocalError(false);
      }}
    >
      <textarea
        placeholder={placeholder}
        className={`
          w-full
          border
          dark:border-search-border-dark
          rounded
          px-4
          py-2
          focus:outline-none
          focus:border-primary
          dark:focus:border-primary-dark
          bg-search-bg
          dark:bg-search-bg-dark
          text-foreground
          dark:text-dark-foreground
          resize-none
          ${localError ? "border-red-500" : ""}
        `}
        rows={rows}
        required={required}
        value={textValue}
        onChange={handleTextChange}
        onFocus={handleFocus}
      />
    </div>
  );
}
