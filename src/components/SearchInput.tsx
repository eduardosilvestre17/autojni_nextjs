"use client";
import { useState, ChangeEvent } from "react";

interface SearchInputProps {
  placeholder?: string;
  withIcon?: boolean;
  className?: string;
  type?: React.HTMLInputTypeAttribute; // "text", "number" etc.
  value?: string;
  onChange?: (newValue: string) => void;
  isError?: boolean;
  required?: boolean;
}

export function SearchInput({
  placeholder = "Pesquisar...",
  withIcon = false,
  className = "",
  type = "text",
  value = "",
  onChange,
  isError = false,
  required = false,
}: SearchInputProps) {
  const [inputValue, setInputValue] = useState(value);

  // Se a prop "value" mudar externamente, atualiza o estado interno.
  if (value !== inputValue) {
    setInputValue(value);
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (onChange) onChange(e.target.value);
  };

  return (
    <div className={`relative ${className}`}>
      <input
        type={type}
        placeholder={placeholder}
        required={required}
        value={inputValue}
        onChange={handleInputChange}
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
          ${isError ? "!border-red-500" : ""}
        `}
      />

      {withIcon && (
        <button
          type="submit"
          aria-label="Pesquisar"
          className="absolute right-2 top-1/2 -translate-y-1/2
                     text-foreground dark:text-dark-foreground
                     hover:text-primary-dark dark:hover:text-primary
                     transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35M9.5 17a7.5 7.5 0 1 1 0-15 
                 7.5 7.5 0 0 1 0 15z"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
