"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { MdClose } from "react-icons/md";
import { HiCheckCircle, HiXCircle, HiInformationCircle } from "react-icons/hi";

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

  let bgColor = "bg-blue-600";
  let Icon = HiInformationCircle;

  if (type === "success") {
    bgColor = "bg-green-600";
    Icon = HiCheckCircle;
  } else if (type === "error") {
    bgColor = "bg-red-600";
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

// Apenas um componente simples para inputs de texto
function TextInput({
  label,
  value,
  onChange,
  required,
  type = "text",
  isError,
  placeholder,
}: {
  label?: string;
  value: string;
  onChange: (val: string) => void;
  required?: boolean;
  type?: string;
  isError?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      {label && (
        <label className="block font-medium mb-1">
          {label}
          {required && <span className="text-red-500"> *</span>}
        </label>
      )}
      <input
        type={type}
        className={`w-full p-2 border rounded focus:outline-none ${
          isError
            ? "border-red-500"
            : "border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
        }`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || ""}
      />
    </div>
  );
}

// Checkbox genérico
function CheckBoxInput({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (val: boolean) => void;
}) {
  return (
    <label className="flex items-center space-x-2 text-sm">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span>{label}</span>
    </label>
  );
}

// Botões
function PrimaryButton({
  children,
  onClick,
  type,
  disabled,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}) {
  return (
    <button
      type={type || "button"}
      onClick={onClick}
      disabled={disabled}
      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
    >
      {children}
    </button>
  );
}

function SecondaryButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
    >
      {children}
    </button>
  );
}

type ActiveTab = "detalhes" | "precos" | "imagens";

export default function ProdutoPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Notificações (toast)
  const [notifications, setNotifications] = useState<INotification[]>([]);

  // Tabs
  const [activeTab, setActiveTab] = useState<ActiveTab>("detalhes");
  const [fieldErrors, setFieldErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Article fields
  const [id, setId] = useState("");
  const [description, setDescription] = useState("");
  const [articleType, setArticleType] = useState("");
  const [brand, setBrand] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");
  const [active, setActive] = useState(false);

  const [purchasingPrice, setPurchasingPrice] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");

  // Uma única imagem
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  function addNotification(
    type: NotificationType,
    title: string,
    message: string
  ) {
    const newNotif: INotification = {
      id: Math.random().toString(36).substring(2, 9),
      type,
      title,
      message,
    };
    setNotifications((prev) => [...prev, newNotif]);
  }
  function removeNotification(id: string) {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }

  // Lidar com upload de imagem (simples)
  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  function handleNovoProduto() {
    setId("");
    setDescription("");
    setArticleType("");
    setBrand("");
    setStockQuantity("");
    setActive(false);
    setPurchasingPrice("");
    setSellingPrice("");
    setImageFile(null);
    setImagePreview("");
    setImageUrl("");
    setFieldErrors([]);
    setActiveTab("detalhes");
    addNotification("info", "Novo Produto", "Formulário resetado.");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFieldErrors([]);
    const missing: string[] = [];

    // Valida campos obrigatórios
    if (!id.trim()) missing.push("id");
    if (!description.trim()) missing.push("description");

    if (missing.length > 0) {
      setFieldErrors(missing);
      addNotification(
        "error",
        "Campos obrigatórios",
        `Preencha: ${missing.join(", ")}`
      );
      return;
    }

    setLoading(true);
    try {
      let uploadedUrl = "";
      // Se houver imagem, faz upload
      if (imageFile) {
        const formImg = new FormData();
        formImg.append("file", imageFile);
        const uploadRes = await fetch("/api/uploads", {
          method: "POST",
          body: formImg,
        });
        if (!uploadRes.ok) {
          throw new Error("Falha ao fazer upload da imagem");
        }
        const uploadData = await uploadRes.json();
        // Supondo que retorne { url: '...' } ou algo do tipo
        uploadedUrl = uploadData.url || "";
        setImageUrl(uploadedUrl);
      }

      // Envia dados do produto
      const productPayload = {
        id,
        description,
        articleType,
        brand,
        stockQuantity: parseInt(stockQuantity, 10) || 0,
        active,
        purchasingPrice: parseFloat(purchasingPrice) || 0,
        sellingPrice: parseFloat(sellingPrice) || 0,
        imageUrl: uploadedUrl, // ou imageUrl
      };

      // A rota /api/products deve criar no banco via Prisma
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productPayload),
      });
      if (!res.ok) {
        const dataErr = await res.json().catch(() => null);
        throw new Error(dataErr?.error || "Erro ao criar produto.");
      }
      addNotification("success", "Sucesso", "Produto criado com sucesso!");
      handleNovoProduto(); // limpa formulário
    } catch (err: any) {
      addNotification(
        "error",
        "Erro",
        err.message || "Falha ao criar produto."
      );
    } finally {
      setLoading(false);
    }
  }

  // Render tabs
  function TabButton({ label, value }: { label: string; value: ActiveTab }) {
    const activeStyles =
      value === activeTab
        ? "border-b-2 border-blue-600 font-semibold text-gray-800 dark:text-white"
        : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:border-gray-300";

    return (
      <button
        type="button"
        onClick={() => setActiveTab(value)}
        className={`whitespace-nowrap transition-colors border-b-2 px-2 pb-2 ${activeStyles}`}
      >
        {label}
      </button>
    );
  }

  function renderTabDetalhes() {
    return (
      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded space-y-4">
        <TextInput
          label="ID"
          required
          value={id}
          onChange={setId}
          isError={fieldErrors.includes("id")}
          placeholder="Ex: COD-123..."
        />
        <TextInput
          label="Descrição"
          required
          value={description}
          onChange={setDescription}
          isError={fieldErrors.includes("description")}
          placeholder="Nome ou descrição do produto..."
        />
        <TextInput
          label="Tipo de Artigo"
          value={articleType}
          onChange={setArticleType}
          placeholder="Ex: Normal, Serviço, etc."
        />
        <TextInput
          label="Marca"
          value={brand}
          onChange={setBrand}
          placeholder="Marca do produto..."
        />
        <TextInput
          label="Stock"
          type="number"
          value={stockQuantity}
          onChange={setStockQuantity}
          placeholder="0"
        />
        <CheckBoxInput label="Ativo?" checked={active} onChange={setActive} />
      </div>
    );
  }

  function renderTabPrecos() {
    return (
      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded space-y-4">
        <TextInput
          label="Preço de compra"
          type="number"
          value={purchasingPrice}
          onChange={setPurchasingPrice}
          placeholder="0.00"
        />
        <TextInput
          label="Preço de venda"
          type="number"
          value={sellingPrice}
          onChange={setSellingPrice}
          placeholder="0.00"
        />
      </div>
    );
  }

  function renderTabImagens() {
    return (
      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded space-y-4">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Selecione a imagem principal do produto.
        </p>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {imagePreview && (
          <div className="mt-4">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-32 h-32 object-cover rounded"
            />
          </div>
        )}
      </div>
    );
  }

  if (status === "loading") {
    return <p>Carregando sessão...</p>;
  }

  return (
    <div className="container max-w-3xl mx-auto px-4 py-6 bg-white rounded shadow dark:bg-gray-800">
      {/* Notificações */}
      <div className="fixed top-4 right-4 z-50">
        {notifications.map((n) => (
          <NotificationItem
            key={n.id}
            notification={n}
            onClose={removeNotification}
          />
        ))}
      </div>

      <h1 className="text-2xl font-bold mb-4">Criar Produto</h1>

      {/* Tabs */}
      <div
        className="
          flex
          gap-4
          mb-6
          text-sm
          border-b
          border-gray-200
          dark:border-gray-700
          pb-2
          overflow-x-auto
        "
      >
        <TabButton label="Detalhes" value="detalhes" />
        <TabButton label="Preços" value="precos" />
        <TabButton label="Imagens" value="imagens" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {activeTab === "detalhes" && renderTabDetalhes()}
        {activeTab === "precos" && renderTabPrecos()}
        {activeTab === "imagens" && renderTabImagens()}

        {/* Botões finais */}
        <div className="flex justify-end space-x-2 mt-4">
          <SecondaryButton onClick={handleNovoProduto}>
            Novo Produto
          </SecondaryButton>
          <PrimaryButton type="submit" disabled={loading}>
            {loading ? "Salvando..." : "Criar Produto"}
          </PrimaryButton>
        </div>
      </form>
    </div>
  );
}
