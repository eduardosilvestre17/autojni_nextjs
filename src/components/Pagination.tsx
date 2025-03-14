// components/Pagination.tsx
"use client";

import React from "react";
import { twMerge } from "tailwind-merge";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  maxDelta?: number; // Número de páginas que aparecem dos lados da currentPage
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  maxDelta = 2,
}) => {
  // Gera array de páginas + elipses
  function getPages(): (number | "...")[] {
    const pages: (number | "...")[] = [];
    // Sempre exibimos a 1ª página
    pages.push(1);

    const start = Math.max(2, currentPage - maxDelta);
    const end = Math.min(totalPages - 1, currentPage + maxDelta);

    if (start > 2) {
      pages.push("...");
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages - 1) {
      pages.push("...");
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  }

  const pages = getPages();

  const canGoPrev = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  return (
    <div className="flex items-center justify-center gap-2">
      {/* Botão "Anterior" */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!canGoPrev}
        className={twMerge(`
          px-3 py-1 rounded text-sm flex items-center
          bg-primary-dark text-white hover:bg-primary
          disabled:opacity-50 disabled:cursor-not-allowed
        `)}
      >
        <span className="mr-1">«</span>
      </button>

      {/* Botões de páginas */}
      {pages.map((p, idx) => {
        if (p === "...") {
          return (
            <span
              key={`ellipsis-${idx}`}
              className="px-2 py-1 text-foreground/60 cursor-default select-none"
            >
              ...
            </span>
          );
        }

        const pageNum = p as number;
        const isActive = pageNum === currentPage;

        return (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            className={twMerge(`
              px-3 py-1 rounded text-sm transition-colors
              text-white
              ${
                isActive
                  ? "bg-myOrange hover:bg-myOrange-dark"
                  : "bg-primary-dark hover:bg-primary"
              }
            `)}
          >
            {pageNum}
          </button>
        );
      })}

      {/* Botão "Próxima" */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!canGoNext}
        className={twMerge(`
          px-3 py-1 rounded text-sm flex items-center
          bg-primary-dark text-white hover:bg-primary
          disabled:opacity-50 disabled:cursor-not-allowed
        `)}
      >
        <span className="ml-1">»</span>
      </button>
    </div>
  );
};

export default Pagination;
