"use client";
import {
  useState,
  ChangeEvent,
  FocusEvent,
  KeyboardEvent,
  useEffect,
} from "react";

interface SearchInputProps {
  placeholder?: string;
  withIcon?: boolean;
  className?: string;
  type?: React.HTMLInputTypeAttribute;
  value?: string;
  onChange?: (newValue: string) => void;
  isError?: boolean;
  required?: boolean;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
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
  onKeyDown,
}: SearchInputProps) {
  const [inputValue, setInputValue] = useState(value);
  const [localError, setLocalError] = useState(isError);

  // Se a prop "value" mudar externamente, atualiza estado local
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Se a prop "isError" mudar externamente, atualiza estado local
  useEffect(() => {
    setLocalError(isError);
  }, [isError]);

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    setInputValue(e.target.value);
    onChange?.(e.target.value);
  }

  function handleFocus(e: FocusEvent<HTMLInputElement>) {
    // Ao focar, removemos o estado de erro local
    setLocalError(false);
  }

  return (
    <div className={`relative ${className}`}>
      <input
        type={type}
        placeholder={placeholder}
        required={required}
        value={inputValue}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onKeyDown={onKeyDown}
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
          ${localError ? "border-red-500" : ""}
        `}
      />

      {withIcon && (
        <button
          type="submit"
          aria-label="Pesquisar"
          className="
            absolute 
            right-2 
            top-1/2 
            -translate-y-1/2
            text-gray-700 dark:text-gray-300
            hover:text-myOrange
            transition-colors
          "
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
