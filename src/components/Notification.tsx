import React, { useEffect, useState } from "react";
import { HiCheckCircle, HiInformationCircle, HiXCircle } from "react-icons/hi";
import { MdClose } from "react-icons/md";

// Tipo de notificação
export type NotificationType = "success" | "error" | "info";

// Estrutura de cada notificação
export interface INotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
}

interface Props {
  notification: INotification;
  onClose: (id: string) => void;
}

/**
 * Componente para exibir cada notificação.
 * Possui animação de entrada (slideIn) e saída (slideOut).
 */
export function NotificationItem({ notification, onClose }: Props) {
  const { id, type, title, message } = notification;

  // Estado local para controlar se estamos "saindo" (exiting)
  const [exiting, setExiting] = useState(false);

  // Define cores/ícone conforme o "type"
  let bgColor = "bg-blue-600";
  let Icon = HiInformationCircle;
  if (type === "success") {
    bgColor = "bg-green-600";
    Icon = HiCheckCircle;
  } else if (type === "error") {
    bgColor = "bg-red-600";
    Icon = HiXCircle;
  }

  // Quando montado, definimos o timer de 4s para fechar
  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  // Handle que dispara a animação de saída
  function handleClose() {
    // Inicia a animação de saída
    setExiting(true);

    // Após 300ms (tempo da animação), chamamos "onClose" do pai
    setTimeout(() => {
      onClose(id);
    }, 300);
  }

  return (
    <>
      {/* CSS inline das animações de entrada e saída */}
      <style>{`
        @keyframes slideInRight {
          0% {
            transform: translateX(120%);
            opacity: 0;
          }
          100% {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes slideOutRight {
          0% {
            transform: translateX(0);
            opacity: 1;
          }
          100% {
            transform: translateX(120%);
            opacity: 0;
          }
        }
        .animate-slideIn {
          animation: slideInRight 0.3s ease forwards;
        }
        .animate-slideOut {
          animation: slideOutRight 0.3s ease forwards;
        }
      `}</style>

      <div
        className={`
          flex items-start gap-3
          w-72
          p-4
          mb-2
          rounded
          text-white
          shadow-lg
          ${bgColor}
          ${exiting ? "animate-slideOut" : "animate-slideIn"}
        `}
      >
        <Icon className="mt-1 h-5 w-5" />
        <div className="flex-1">
          <strong className="block font-semibold">{title}</strong>
          <p className="text-sm">{message}</p>
        </div>
        <button
          className="opacity-80 hover:opacity-100 transition"
          onClick={handleClose}
        >
          <MdClose className="h-5 w-5" />
        </button>
      </div>
    </>
  );
}
