"use client";
import React, { useState, useMemo, MouseEvent } from "react";
import { HiEye } from "react-icons/hi";

interface Column {
  key: string;
  label: string;
}

interface AdminTableProps {
  columns: Column[];
  data: any[];
  loading?: boolean;
  rowsPerPage?: number;
  mobileColumnKey?: string; // Qual coluna deve aparecer no modo mobile (além de Detalhes).
}

export default function AdminTable({
  columns,
  data,
  loading = false,
  rowsPerPage = 10,
  mobileColumnKey,
}: AdminTableProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const [showModal, setShowModal] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const totalPages = useMemo(() => {
    return Math.ceil(data.length / rowsPerPage);
  }, [data, rowsPerPage]);

  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(totalPages);
  }

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return data.slice(startIndex, endIndex);
  }, [currentPage, data, rowsPerPage]);

  function handleNextPage() {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  }

  function handlePrevPage() {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  }

  function openModal(item: any) {
    setSelectedItem(item);
    setShowModal(true);
    setExiting(false);
  }

  function closeModal() {
    setExiting(true);
    setTimeout(() => {
      setExiting(false);
      setShowModal(false);
      setSelectedItem(null);
    }, 200);
  }

  function stopPropagation(e: MouseEvent) {
    e.stopPropagation();
  }

  // Tabela Desktop/Tablet (sem coluna de "Detalhes")
  const DesktopTable = (
    <div className="overflow-x-auto w-full">
      <table className="w-full text-sm table-auto rounded-md overflow-hidden">
        <thead className="bg-primary dark:bg-primary-dark text-white">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="px-3 py-2 text-left">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {!loading && paginatedData.length === 0 && (
            <tr>
              <td
                colSpan={columns.length}
                className="px-3 py-2 text-center text-foreground opacity-60"
              >
                Nenhum registo encontrado.
              </td>
            </tr>
          )}

          {paginatedData.map((item, idx) => (
            <tr
              key={idx}
              className="border-b last:border-0 border-foreground/20"
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className="px-3 py-2 whitespace-normal break-words"
                >
                  {item[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // Tabela Mobile (1 coluna + coluna de Detalhes)
  const MobileTable = (
    <div className="overflow-x-auto w-full">
      <table className="w-full text-sm table-auto rounded-md overflow-hidden">
        <thead className="bg-primary dark:bg-primary-dark text-white">
          <tr>
            <th className="px-3 py-2 text-left">
              {columns.find((col) => col.key === mobileColumnKey)?.label || "—"}
            </th>
            <th className="px-3 py-2 text-center">Detalhes</th>
          </tr>
        </thead>
        <tbody>
          {!loading && paginatedData.length === 0 && (
            <tr>
              <td
                colSpan={2}
                className="px-3 py-2 text-center text-foreground opacity-60"
              >
                Nenhum registo encontrado.
              </td>
            </tr>
          )}
          {paginatedData.map((item, idx) => (
            <tr
              key={idx}
              className="border-b last:border-0 border-foreground/20"
            >
              <td className="px-3 py-2 whitespace-normal break-words">
                {mobileColumnKey ? item[mobileColumnKey] : ""}
              </td>
              <td className="px-3 py-2 text-center">
                <button
                  type="button"
                  onClick={() => openModal(item)}
                  className="text-primary dark:text-primary-dark hover:scale-110 transition"
                >
                  <HiEye className="inline-block w-5 h-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="p-2 rounded relative bg-background dark:bg-search-bg-dark">
      {loading && <p className="text-sm py-2">Carregando...</p>}

      {/* Desktop/Tablet: sem coluna de Detalhes */}
      <div className="hidden sm:block">{DesktopTable}</div>

      {/* Mobile: mostra a coluna mobileColumnKey + Detalhes */}
      <div className="block sm:hidden">
        {mobileColumnKey ? MobileTable : null}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-foreground dark:text-dark-foreground">
            Página {currentPage} de {totalPages} • Total: {data.length}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              className="
                text-sm px-3 py-1 rounded
                disabled:opacity-50
                bg-primary text-white
                dark:bg-primary-dark
                hover:bg-primary-dark dark:hover:bg-primary
                transition-colors
              "
              disabled={currentPage <= 1}
              onClick={handlePrevPage}
            >
              Anterior
            </button>
            <button
              type="button"
              className="
                text-sm px-3 py-1 rounded
                disabled:opacity-50
                bg-primary text-white
                dark:bg-primary-dark
                hover:bg-primary-dark dark:hover:bg-primary
                transition-colors
              "
              disabled={currentPage >= totalPages}
              onClick={handleNextPage}
            >
              Próxima
            </button>
          </div>
        </div>
      )}

      {showModal && selectedItem && (
        <>
          <div
            className={`
              fixed inset-0 z-50 bg-dark-bg bg-opacity-40 flex items-center justify-center
              ${exiting ? "animate-fadeOut" : "animate-fadeIn"}
            `}
            onClick={closeModal}
          >
            <div
              className={`
                relative bg-background dark:bg-dark-bg p-4 rounded shadow-lg w-11/12 max-w-md
                ${exiting ? "animate-scaleOut" : "animate-scaleIn"}
              `}
              onClick={stopPropagation}
            >
              <button
                onClick={closeModal}
                className="absolute top-2 right-2 text-foreground opacity-70 hover:opacity-100 dark:text-dark-foreground transition"
              >
                ✕
              </button>
              <h2 className="text-lg font-bold mb-2 text-foreground dark:text-dark-foreground">
                Detalhes
              </h2>
              <div className="space-y-2 text-foreground dark:text-dark-foreground">
                {columns.map((col) => (
                  <div key={col.key}>
                    <strong>{col.label}:</strong> {selectedItem[col.key]}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <style jsx>{`
            @keyframes fadeIn {
              from {
                opacity: 0;
              }
              to {
                opacity: 1;
              }
            }
            @keyframes fadeOut {
              from {
                opacity: 1;
              }
              to {
                opacity: 0;
              }
            }
            @keyframes scaleIn {
              0% {
                transform: scale(0.8);
              }
              100% {
                transform: scale(1);
              }
            }
            @keyframes scaleOut {
              0% {
                transform: scale(1);
              }
              100% {
                transform: scale(0.8);
              }
            }
            .animate-fadeIn {
              animation: fadeIn 0.2s forwards;
            }
            .animate-fadeOut {
              animation: fadeOut 0.2s forwards;
            }
            .animate-scaleIn {
              animation: scaleIn 0.2s forwards;
            }
            .animate-scaleOut {
              animation: scaleOut 0.2s forwards;
            }
          `}</style>
        </>
      )}
    </div>
  );
}
