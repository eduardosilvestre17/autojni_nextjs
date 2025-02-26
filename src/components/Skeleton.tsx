// src/components/Skeleton.tsx
"use client";

import clsx from "clsx";
import React from "react";

interface SkeletonProps {
  /**
   * Classes extras para customizar largura/altura/margem etc.
   * Ex: "w-full h-6 mb-2".
   */
  className?: string;
}

/**
 * Componente de Skeleton que exibe um bloco com animação de pulse.
 * Use `className` para ajustar tamanho e margens onde for necessário.
 */
export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={clsx(
        // Animação e cores
        "animate-pulse bg-gray-200 dark:bg-gray-600 rounded",
        // Classes extras passadas
        className
      )}
    />
  );
}
