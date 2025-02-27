"use client";

import React, { useState, useRef, useEffect } from "react";

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

/**
 * SelectInput
 * - Botão sempre w-full (ocupa todo espaço do container)
 * - Dropdown com minWidth = maior opção, para não "encolher".
 */
export function SelectInput({
  options,
  value,
  onChange,
  placeholder = "Selecione uma opção...",
  isError = false,
  required = false,
  className = "",
}: SelectInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [maxOptionWidth, setMaxOptionWidth] = useState(0);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);

  // Fecha ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: globalThis.MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside as any);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside as any);
    };
  }, []);

  // Mede a maior largura das opções
  useEffect(() => {
    if (!measureRef.current) return;

    let largest = 0;
    // Seleciona todos os elementos marcados com [data-measure]
    const items =
      measureRef.current.querySelectorAll<HTMLElement>("[data-measure]");
    items.forEach((item) => {
      const w = item.offsetWidth;
      if (w > largest) largest = w;
    });

    setMaxOptionWidth(largest);
  }, [options]);

  // Alterna abrir/fechar
  function toggleDropdown() {
    setIsOpen((prev) => !prev);
  }

  // Seleciona opção
  function handleOptionClick(optionValue: string) {
    if (onChange) onChange(optionValue);
    setIsOpen(false);
  }

  // Label da opção selecionada
  const selectedLabel = options.find((opt) => opt.value === value)?.label || "";
  // Exibe placeholder se não estiver selecionado
  const displayText = selectedLabel || placeholder;

  return (
    <div ref={dropdownRef} className={`relative w-full text-left ${className}`}>
      {/* 
        "Fantasma" para medir largura das opções
        Nota: não aplicamos w-full nele, pois queremos medir o tamanho natural
      */}
      <div
        ref={measureRef}
        className="absolute invisible -z-10 top-0 left-0 whitespace-nowrap"
      >
        {options.map((opt) => (
          <div
            key={opt.value}
            data-measure
            className={`
              inline-flex items-center
              px-4 py-2
              border dark:border-search-border-dark
              rounded
              bg-search-bg dark:bg-search-bg-dark
              text-foreground dark:text-dark-foreground
            `}
          >
            <span className="mr-2">{opt.label}</span>
            <span className="text-gray-400">
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
        ))}
      </div>

      {/* BOTÃO Select - ocupa toda a largura do container */}
      <div
        onClick={toggleDropdown}
        className={`
          flex justify-between items-center
          w-full
          px-4 py-2
          border dark:border-search-border-dark
          rounded
          bg-search-bg dark:bg-search-bg-dark
          text-foreground dark:text-dark-foreground
          cursor-pointer
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
            text-gray-400
            transition-transform
            duration-200
            ${isOpen ? "rotate-180" : ""}
          `}
        >
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

      {/* DROPDOWN */}
      {isOpen && (
        <div
          className={`
            absolute left-0
            z-10 mt-1
            py-1
            border dark:border-search-border-dark
            bg-search-bg dark:bg-search-bg-dark
            rounded shadow-lg
            origin-top
            animate-dropdown-open
          `}
          style={{
            // Garante que o menu não fique menor que o maior item
            minWidth: maxOptionWidth > 0 ? maxOptionWidth : undefined,
          }}
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
                whitespace-nowrap
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
