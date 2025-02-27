"use client";

import React, { useState, useRef, useEffect, MouseEvent } from "react";

interface SelectInputOption {
  label: string;
  value: string;
}

interface SelectInputProps {
  options: SelectInputOption[];
  value: string; // valor selecionado atual
  onChange?: (newValue: string) => void;
  placeholder?: string; // texto mostrado quando não há valor selecionado
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
  // Estado de aberto/fechado
  const [isOpen, setIsOpen] = useState(false);

  // Referência para capturar clique fora
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Alterna abrir/fechar
  const toggleDropdown = (e?: MouseEvent<HTMLDivElement>) => {
    setIsOpen((prev) => !prev);
  };

  // Fecha ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | globalThis.MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Seleciona opção
  const handleOptionClick = (optionValue: string) => {
    if (onChange) onChange(optionValue);
    setIsOpen(false);
  };

  // Label da opção selecionada
  const selectedLabel = options.find((opt) => opt.value === value)?.label || "";
  // Exibe placeholder se não estiver selecionado
  const displayText = selectedLabel || placeholder;

  return (
    <div
      ref={dropdownRef}
      className={`relative inline-block text-left ${className}`}
    >
      {/* Botão (label + ícone) */}
      <div
        onClick={toggleDropdown}
        className={`
          flex justify-between items-center
          border dark:border-search-border-dark
          rounded
          px-4 py-2
          cursor-pointer
          bg-search-bg dark:bg-search-bg-dark
          text-foreground dark:text-dark-foreground
          select-none
          focus:outline-none
          ${isError ? "!border-red-500" : ""}
        `}
      >
        <span
          className={`
            mr-2
            ${!selectedLabel ? "text-gray-400" : ""}
          `}
        >
          {displayText}
        </span>

        {/* Ícone seta (chevron), gira 180° se aberto */}
        <span
          className={`
            transition-transform duration-200
            text-gray-400
            ${isOpen ? "rotate-180" : ""}
          `}
        >
          {/* Heroicon: Chevron Down */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 9l6 6 6-6"
            />
          </svg>
        </span>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div
          className={`
            absolute left-0
            z-10 mt-1
            min-w-full   /* pelo menos a largura do 'botão' */
            w-max        /* expande se tiver item maior */
            bg-search-bg dark:bg-search-bg-dark
            border dark:border-search-border-dark
            rounded shadow-lg
            py-1
            origin-top
            animate-dropdown-open
          `}
        >
          {options.map((opt) => (
            <div
              key={opt.value}
              onClick={() => handleOptionClick(opt.value)}
              className={`
                px-4 py-2
                text-sm
                text-foreground dark:text-dark-foreground
                hover:bg-gray-100 dark:hover:bg-gray-700
                cursor-pointer
                whitespace-nowrap  /* previne quebra e força expandir se necessário */
                ${opt.value === value ? "font-semibold" : ""}
              `}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
