"use client";

import { useEffect, useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { SearchInput } from "@/components/SearchInput";
import { PrimaryButton, SecondaryButton } from "@/components/Buttons";
import { MdClose } from "react-icons/md";
import { HiCheckCircle, HiXCircle, HiInformationCircle } from "react-icons/hi";
import AdminTable from "@/components/AdminTableClients";

type NotificationType = "success" | "error" | "info";

interface INotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
}

function NotificationItem({
  notification,
  onClose,
}: {
  notification: INotification;
  onClose: (id: string) => void;
}) {
  const { id, type, title, message } = notification;
  const [exiting, setExiting] = useState(false);

  let bgColor = "bg-primary dark:bg-primary-dark";
  let Icon = HiInformationCircle;

  if (type === "success") {
    bgColor = "bg-myOrange dark:bg-myOrange-dark";
    Icon = HiCheckCircle;
  } else if (type === "error") {
    bgColor = "bg-myOrange-dark dark:bg-myOrange";
    Icon = HiXCircle;
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  function handleClose() {
    setExiting(true);
    setTimeout(() => {
      onClose(id);
    }, 300);
  }

  return (
    <>
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

interface ICliente {
  id: number;
  name: string;
  address: string;
  city: string;
  zipcode: string;
  country: string;
  customertaxid: string;
  phone1: string; // "Telemovel" na tabela
  phone2: string;
  mobilephone: string;
  fax: string;
  email: string;
  webpage: string;
  vendorcode: number;
  active: string;
  entitytype: string;
  classifcode: string;
  campaigncode: string;
  customertype: string;
  rgdp_allow_dataprocessing_date: string;
  rgdp_allow_mailing: number;
  activitysector_id: string;
  clientmanager: string;
  exemptionreason_id: string;
}

interface ICustomersResponse {
  customers?: Record<string, ICliente>;
}

function normalizeStr(str: string): string {
  return str
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

/**
 * Verifica se 'userText' está contido em 'target',
 * ignorando acentos e case (match parcial).
 */
function matchAllWords(userText: string, target: string): boolean {
  const words = userText.split(/\s+/).filter(Boolean);
  if (words.length === 0) return true;
  const normTarget = normalizeStr(target);
  for (const w of words) {
    const normW = normalizeStr(w);
    if (!normTarget.includes(normW)) {
      return false;
    }
  }
  return true;
}

export default function ClientesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [allClients, setAllClients] = useState<ICliente[]>([]);
  const [loading, setLoading] = useState(false);

  // Campo de pesquisa que filtra por nome, telemovel, contribuinte
  const [searchTerm, setSearchTerm] = useState("");
  const [typingTerm, setTypingTerm] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      carregarTodosClientes();
    }
  }, [status]);

  async function carregarTodosClientes() {
    try {
      setLoading(true);
      const baseUrl = "https://autojni.officegest.com/api";
      const url = `${baseUrl}/entities/customers?limit=999999`;

      const user = "userapi";
      const pass = "1c4a331908e1e5feb96ccba9e82c1b2e8d28f9bb";
      const basicAuth = btoa(`${user}:${pass}`);

      const res = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Basic ${basicAuth}`,
          Accept: "application/json",
        },
      });
      if (!res.ok) {
        throw new Error("Falha ao buscar clientes");
      }

      const data: ICustomersResponse = await res.json();
      console.log("Resposta da API:", data);

      if (data.customers) {
        setAllClients(Object.values(data.customers));
      } else {
        setAllClients([]);
      }
    } catch (error: any) {
      addNotification("error", "Erro", error.message || "Falha na requisição");
    } finally {
      setLoading(false);
    }
  }

  // Debounce de 300ms para atualizar o searchTerm
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(typingTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [typingTerm]);

  // Filtragem local por nome, telemovel ou contribuinte
  const filteredClients = useMemo(() => {
    if (!searchTerm) return allClients;
    return allClients.filter((cliente) => {
      const matchName = matchAllWords(searchTerm, cliente.name ?? "");
      const matchTelemovel = matchAllWords(searchTerm, cliente.phone1 ?? "");
      const matchContribuinte = matchAllWords(
        searchTerm,
        cliente.customertaxid ?? ""
      );
      // Inclui o cliente se der match em qualquer um dos 3 campos
      return matchName || matchTelemovel || matchContribuinte;
    });
  }, [allClients, searchTerm]);

  function addNotification(
    type: NotificationType,
    title: string,
    message: string
  ) {
    const id = Math.random().toString(36).substring(2, 9);
    setNotifications((prev) => [...prev, { id, type, title, message }]);
  }

  function removeNotification(id: string) {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }

  // Mantemos a função, mas não exibimos mais o botão na interface
  function handleLimpar() {
    setTypingTerm("");
    setSearchTerm("");
  }

  // Definição das colunas da tabela
  const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Nome" },
    { key: "email", label: "Email" },
    { key: "customertaxid", label: "Contribuinte" },
    { key: "phone1", label: "Telemovel" },
  ];

  if (status === "loading") {
    return <p>Carregando sessão...</p>;
  }

  return (
    <div className="container max-w-5xl mx-auto px-4 py-6 bg-search-bg rounded shadow dark:bg-search-bg-dark text-foreground dark:text-dark-foreground">
      {/* Notificações */}
      <div className="fixed top-4 right-4 z-50">
        {notifications.map((notif) => (
          <NotificationItem
            key={notif.id}
            notification={notif}
            onClose={removeNotification}
          />
        ))}
      </div>

      <h1 className="text-2xl font-bold mb-4">Lista de Clientes</h1>

      <div className="mb-4 p-4 bg-search-bg rounded dark:bg-search-bg-dark">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div className="col-span-1 sm:col-span-2">
            <label className="block mb-1 font-semibold">
              Pesquisa por Nome, Telemovel ou Contribuinte:
            </label>
            <SearchInput
              placeholder="Ex: João, 912345678, 123456789"
              withIcon={false}
              value={typingTerm}
              onChange={setTypingTerm}
            />
          </div>
        </div>
        {/* Botão "Limpar" removido */}
      </div>

      <div className="w-full overflow-x-auto">
        <AdminTable
          columns={columns}
          data={filteredClients}
          loading={loading}
          rowsPerPage={10}
          mobileColumnKey="name"
        />
      </div>
    </div>
  );
}
