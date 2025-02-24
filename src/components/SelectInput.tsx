"use client";
import { useState, ChangeEvent } from "react";

interface SelectInputOption {
  label: string;
  value: string;
}

interface SelectInputProps {
  options: SelectInputOption[];
  value: string;
  onChange?: (newValue: string) => void;
  placeholder?: string;
  isError?: boolean;
  required?: boolean;
  className?: string;
}

export function SelectInput({
  options,
  value,
  onChange,
  placeholder = "Selecione uma opção...",
  isError = false,
  required = false,
  className = "",
}: SelectInputProps) {
  // Caso queira estado interno, mas normalmente deixamos controlado externamente
  const [selected, setSelected] = useState(value);

  // Se o "value" mudar externamente, atualizamos o estado
  if (value !== selected) {
    setSelected(value);
  }

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelected(e.target.value);
    if (onChange) onChange(e.target.value);
  };

  return (
    <div className={`relative ${className}`}>
      <select
        required={required}
        value={selected}
        onChange={handleChange}
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
          appearance-none   /* Remove seta padrão do select no Chrome, Safari, etc. */
          ${isError ? "!border-red-500" : ""}
        `}
      >
        {/* Placeholder como primeira opção "desabilitada" */}
        <option value="" disabled hidden>
          {placeholder}
        </option>

        {/* Renderiza as opções */}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* Se quiser inserir um ícone de seta customizado, pode usar algo como */}
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
        {/* ícone de seta, ex: Font Awesome ou HeroIcons */}
        <svg
          className="w-4 h-4"
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M10 3a1 1 0 0 1 .832.445l5 7A1 1 0 0 1 14 12H6a1 1 0 0 1-.832-1.555l5-7A1 1 0 0 1 10 3zm0 2.276L7.175 10h5.65L10 5.276z"
            clipRule="evenodd"
          />
        </svg>
      </span>
    </div>
  );
}
