"use client";
import { useState, ChangeEvent } from "react";

interface TextAreaInputProps {
  placeholder?: string;
  className?: string;
  value?: string;
  onChange?: (newValue: string) => void;
  isError?: boolean;
  required?: boolean;
  rows?: number; // Para definir quantas linhas a textarea terá (padrão=4)
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
  // Estado interno apenas para refletir mudanças externas,
  // caso o componente seja controlado pelo "pai".
  const [textValue, setTextValue] = useState(value);

  // Se a prop "value" mudar externamente, atualizamos o estado interno.
  if (value !== textValue) {
    setTextValue(value);
  }

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setTextValue(e.target.value);
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <div className={`relative ${className}`}>
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
          ${isError ? "!border-red-500" : ""}
          resize-none  /* Se quiser desabilitar o redimensionamento da textarea */
        `}
        rows={rows}
        required={required}
        value={textValue}
        onChange={handleTextChange}
      />
    </div>
  );
}
