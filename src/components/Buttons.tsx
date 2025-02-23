"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";

interface BaseButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

/** BOTÃO PRIMÁRIO (fundo azul) */
export function PrimaryButton({
  children,
  className = "",
  ...props
}: BaseButtonProps) {
  return (
    <button
      {...props}
      className={`
        inline-flex items-center justify-center
        px-6 py-2
        rounded
        text-white
        font-semibold
        bg-primary
        transition-colors
        hover:bg-primary-dark
        ${className}
      `}
    >
      {children}
    </button>
  );
}

/** BOTÃO SECUNDÁRIO (fundo laranja) */
export function SecondaryButton({
  children,
  className = "",
  ...props
}: BaseButtonProps) {
  return (
    <button
      {...props}
      className={`
        inline-flex items-center justify-center
        px-6 py-2
        rounded
        text-white
        font-semibold
        bg-myOrange
        transition-colors
        hover:bg-myOrange-dark
        ${className}
      `}
    >
      {children}
    </button>
  );
}
