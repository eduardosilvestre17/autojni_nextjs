"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { PrimaryButton, SecondaryButton } from "@/components/Buttons";
import { SearchInput } from "@/components/SearchInput";
import { TextAreaInput } from "@/components/TextAreaInput";
import { SelectInput } from "@/components/SelectInput";
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

const toastAnimationStyle = ``;

type ActiveTab =
  | "detalhes"
  | "outras"
  | "precos"
  | "imagens"
  | "variacoes"
  | "seo"
  | "especificacoes";

interface ImageData {
  file: File;
  previewUrl: string;
  baseName: string;
  extension: string;
}

async function isValidImage(file: File): Promise<boolean> {
  if (!file || file.size === 0) return false;
  const slice = file.slice(0, 12);
  const buffer = await slice.arrayBuffer();
  if (buffer.byteLength < 4) return false;

  const arr = new Uint8Array(buffer);
  const hexBytes = Array.from(arr)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  if (hexBytes.startsWith("89504e47")) return true; // PNG
  if (hexBytes.startsWith("ffd8ff")) return true; // JPEG
  if (hexBytes.startsWith("52494646") && hexBytes.length >= 16) {
    // WEBP
    const webpSubstr = hexBytes.substring(16, 24);
    if (webpSubstr === "57454250") return true;
  }
  return false;
}

function parseTaxa(): number {
  return 23;
}

export default function ProdutoPage() {
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const { data: session, status } = useSession();
  const router = useRouter();

  const [fieldErrors, setFieldErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>("detalhes");

  // Campos gerais
  const [titulo, setTitulo] = useState("");
  const [referencia, setReferencia] = useState("");
  const [tipoProduto, setTipoProduto] = useState("");
  const [descricaoCurta, setDescricaoCurta] = useState("");
  const [descricaoCompleta, setDescricaoCompleta] = useState("");

  // Outras infos
  const [peso, setPeso] = useState("");
  const [medidas, setMedidas] = useState("");
  const [stock, setStock] = useState("");
  const [qtdMinima, setQtdMinima] = useState("");
  const [unidade, setUnidade] = useState("");
  const [taxaImposto, setTaxaImposto] = useState("23");
  const [vendasExtraStock, setVendasExtraStock] = useState(false);
  const [produtoFragil, setProdutoFragil] = useState(false);
  const [permitirUpload, setPermitirUpload] = useState(false);
  const [produtoGPSR, setProdutoGPSR] = useState(false);
  const [destaque, setDestaque] = useState(false);
  const [novidade, setNovidade] = useState(false);
  const [estado, setEstado] = useState("novo");
  const [categorias, setCategorias] = useState("");
  const [marcas, setMarcas] = useState("");
  const [etiquetas, setEtiquetas] = useState("");
  const [codigoBarras, setCodigoBarras] = useState("");

  // Preços
  const [precoCompraSemIva, setPrecoCompraSemIva] = useState("");
  const [precoCompraComIva, setPrecoCompraComIva] = useState("");
  const [precoVendaSemIva, setPrecoVendaSemIva] = useState("");
  const [precoVendaComIva, setPrecoVendaComIva] = useState("");
  const [margemLucro, setMargemLucro] = useState("");
  const [margemRelacional, setMargemRelacional] = useState("");
  const [precoPrincipal, setPrecoPrincipal] = useState("");
  const [precoPromocional, setPrecoPromocional] = useState("");
  const [lastChangedCompra, setLastChangedCompra] = useState<
    "semIva" | "comIva" | null
  >(null);
  const [lastChangedVenda, setLastChangedVenda] = useState<
    "semIva" | "comIva" | null
  >(null);
  const [usarPrecosVariacoes, setUsarPrecosVariacoes] = useState(false);

  // Imagens
  const [imagensData, setImagensData] = useState<ImageData[]>([]);
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);

  // Variações
  const [variacoes, setVariacoes] = useState("");

  // SEO
  const [paginaUrl, setPaginaUrl] = useState("automatico");
  const [urlPersonalizada, setUrlPersonalizada] = useState("");
  const [tituloPagina, setTituloPagina] = useState("");
  const [descricaoPagina, setDescricaoPagina] = useState("");
  const [metatagsPagina, setMetatagsPagina] = useState("");

  // Especificações: inicia sem nenhuma especificação
  const [especificacoesList, setEspecificacoesList] = useState<
    { titulo: string; descricao: string }[]
  >([]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  // Notificações
  function addNotification(
    type: NotificationType,
    title: string,
    message: string
  ) {
    const id = Math.random().toString(36).substring(2, 9);
    const newNotif: INotification = { id, type, title, message };
    setNotifications((prev) => [...prev, newNotif]);
  }
  function removeNotification(id: string) {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }

  // Calcular margens de lucro
  useEffect(() => {
    const compraSem = parseFloat(precoCompraSemIva) || 0;
    const vendaSem = parseFloat(precoVendaSemIva) || 0;

    if (compraSem > 0) {
      const mc = ((vendaSem - compraSem) / compraSem) * 100;
      setMargemLucro(mc.toFixed(2));
    } else {
      setMargemLucro("0");
    }

    if (vendaSem > 0) {
      const mr = ((vendaSem - compraSem) / vendaSem) * 100;
      setMargemRelacional(mr.toFixed(2));
    } else {
      setMargemRelacional("0");
    }
  }, [precoCompraSemIva, precoVendaSemIva]);

  // Sincroniza compra
  useEffect(() => {
    if (lastChangedCompra === "semIva") {
      const tax = parseTaxa();
      const rate = 1 + tax / 100;
      const semIva = parseFloat(precoCompraSemIva);
      if (!isNaN(semIva)) {
        const computed = semIva * rate;
        if (computed.toFixed(2) !== precoCompraComIva) {
          setPrecoCompraComIva(computed.toFixed(2));
        }
      } else {
        setPrecoCompraComIva("");
      }
    } else if (lastChangedCompra === "comIva") {
      const tax = parseTaxa();
      const rate = 1 + tax / 100;
      const comIva = parseFloat(precoCompraComIva);
      if (!isNaN(comIva)) {
        const computed = comIva / rate;
        if (computed.toFixed(2) !== precoCompraSemIva) {
          setPrecoCompraSemIva(computed.toFixed(2));
        }
      } else {
        setPrecoCompraSemIva("");
      }
    }
  }, [precoCompraSemIva, precoCompraComIva, lastChangedCompra]);

  // Sincroniza venda
  useEffect(() => {
    if (lastChangedVenda === "semIva") {
      const tax = parseTaxa();
      const rate = 1 + tax / 100;
      const semIva = parseFloat(precoVendaSemIva);
      if (!isNaN(semIva)) {
        const computed = semIva * rate;
        if (computed.toFixed(2) !== precoVendaComIva) {
          setPrecoVendaComIva(computed.toFixed(2));
        }
      } else {
        setPrecoVendaComIva("");
      }
    } else if (lastChangedVenda === "comIva") {
      const tax = parseTaxa();
      const rate = 1 + tax / 100;
      const comIva = parseFloat(precoVendaComIva);
      if (!isNaN(comIva)) {
        const computed = comIva / rate;
        if (computed.toFixed(2) !== precoVendaSemIva) {
          setPrecoVendaSemIva(computed.toFixed(2));
        }
      } else {
        setPrecoVendaSemIva("");
      }
    }
  }, [precoVendaSemIva, precoVendaComIva, lastChangedVenda]);

  if (status === "loading") {
    return <p>Carregando...</p>;
  }

  // Handler de imagens
  async function handleImagensChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    const validImages: ImageData[] = [];

    for (const file of files) {
      const ext = file.name.toLowerCase().split(".").pop() || "";
      if (!["png", "jpg", "jpeg", "webp"].includes(ext)) {
        addNotification(
          "error",
          "Formato não permitido",
          `Ficheiro '${file.name}' não é PNG/JPG/WEBP.`
        );
        e.target.value = "";
        return;
      }

      const isImageOk = await isValidImage(file);
      if (!isImageOk) {
        addNotification(
          "error",
          "Ficheiro inválido",
          `Ficheiro '${file.name}' não é uma imagem válida.`
        );
        e.target.value = "";
        return;
      }

      const baseName =
        file.name.substring(0, file.name.lastIndexOf(".")) || "imagem";
      const previewUrl = URL.createObjectURL(file);

      validImages.push({
        file,
        previewUrl,
        baseName,
        extension: ext,
      });
    }

    if (validImages.length > 0) {
      setImagensData((prev) => [...prev, ...validImages]);
    }
  }

  function handleImageBaseNameChange(index: number, newBaseName: string) {
    setImagensData((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, baseName: newBaseName } : item
      )
    );
  }

  function handleRemoveImage(index: number) {
    setImagensData((prev) => {
      const clone = [...prev];
      clone.splice(index, 1);
      return clone;
    });
  }

  // Especificações (novo formato)
  function handleAddEspecificacao() {
    setEspecificacoesList((prev) => [...prev, { titulo: "", descricao: "" }]);
  }

  function handleRemoveEspecificacao(index: number) {
    setEspecificacoesList((prev) => prev.filter((_, i) => i !== index));
  }

  function handleChangeEspecificacao(
    index: number,
    field: "titulo" | "descricao",
    value: string
  ) {
    setEspecificacoesList((prev) =>
      prev.map((spec, i) => (i === index ? { ...spec, [field]: value } : spec))
    );
  }

  // Reset formulário
  function handleNovoProduto() {
    setTitulo("");
    setReferencia("");
    setTipoProduto("");
    setDescricaoCurta("");
    setDescricaoCompleta("");
    setPeso("");
    setMedidas("");
    setStock("");
    setQtdMinima("");
    setUnidade("");
    setTaxaImposto("23");
    setVendasExtraStock(false);
    setProdutoFragil(false);
    setPermitirUpload(false);
    setProdutoGPSR(false);
    setDestaque(false);
    setNovidade(false);
    setEstado("novo");
    setCategorias("");
    setMarcas("");
    setEtiquetas("");
    setCodigoBarras("");

    setPrecoCompraSemIva("");
    setPrecoCompraComIva("");
    setPrecoVendaSemIva("");
    setPrecoVendaComIva("");
    setMargemLucro("");
    setMargemRelacional("");
    setPrecoPrincipal("");
    setPrecoPromocional("");

    setImagensData([]);
    setUploadedImageUrls([]);
    setUsarPrecosVariacoes(false);
    setVariacoes("");

    setPaginaUrl("automatico");
    setUrlPersonalizada("");
    setTituloPagina("");
    setDescricaoPagina("");
    setMetatagsPagina("");

    // Especificações em array (vazio)
    setEspecificacoesList([]);

    setFieldErrors([]);
    setActiveTab("detalhes");

    addNotification(
      "info",
      "Novo Produto",
      "Formulário resetado para novo produto."
    );
  }

  // Submit
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFieldErrors([]);

    const missingFields: string[] = [];
    const missingTabs: string[] = [];

    // "Detalhes"
    const detalhesFields: string[] = [];
    if (!titulo.trim()) detalhesFields.push("titulo");
    if (!referencia.trim()) detalhesFields.push("referencia");
    if (!tipoProduto.trim()) detalhesFields.push("tipoProduto");
    if (!descricaoCurta.trim()) detalhesFields.push("descricaoCurta");
    if (detalhesFields.length > 0) {
      missingTabs.push("Detalhes");
      missingFields.push(...detalhesFields);
    }

    // "Outras"
    const outrasFields: string[] = [];
    if (!peso.trim()) outrasFields.push("peso");
    if (outrasFields.length > 0) {
      missingTabs.push("Outras informações");
      missingFields.push(...outrasFields);
    }

    // "Preços"
    const precosFields: string[] = [];
    if (!precoPrincipal.trim()) precosFields.push("precoPrincipal");
    if (precosFields.length > 0) {
      missingTabs.push("Preços");
      missingFields.push(...precosFields);
    }

    // "Imagens" - pelo menos 1 imagem (ou alguma já salva no array de URLs, se fosse o caso)
    if (imagensData.length === 0 && uploadedImageUrls.length === 0) {
      missingTabs.push("Imagens");
      missingFields.push("imagens");
    }

    if (missingFields.length > 0) {
      const msg = `Faltam campos obrigatórios nas abas: ${missingTabs.join(
        ", "
      )}.`;
      setFieldErrors(missingFields);
      addNotification("error", "Campos obrigatórios", msg);
      return;
    }

    setLoading(true);

    try {
      let imageUrls: string[] = [];
      if (imagensData.length > 0) {
        const imagesForm = new FormData();
        for (const item of imagensData) {
          const finalName = item.baseName + "." + item.extension;
          imagesForm.append("images", item.file, finalName);
        }

        const uploadRes = await fetch("/api/uploads", {
          method: "POST",
          body: imagesForm,
        });
        if (!uploadRes.ok) {
          const data = await uploadRes.json();
          throw new Error(data.error || "Erro ao fazer upload das imagens");
        }
        const uploadData = await uploadRes.json();
        imageUrls = uploadData.images || [];
        setUploadedImageUrls(imageUrls);
      }

      const productData = {
        titulo,
        referencia,
        tipoProduto,
        descricaoCurta,
        descricaoCompleta,
        peso,
        medidas,
        stock,
        qtdMinima,
        unidade,
        taxaImposto,
        vendasExtraStock,
        produtoFragil,
        permitirUpload,
        produtoGPSR,
        destaque,
        novidade,
        estado,
        categorias,
        marcas,
        etiquetas,
        codigoBarras,
        precoCompraSemIva,
        precoCompraComIva,
        precoVendaSemIva,
        precoVendaComIva,
        margemLucro,
        margemRelacional,
        precoPrincipal,
        precoPromocional,
        usarPrecosVariacoes,
        variacoes,
        paginaUrl,
        urlPersonalizada,
        tituloPagina,
        descricaoPagina,
        metatagsPagina,
        especificacoes: especificacoesList, // array de objetos
        imagens: imageUrls,
      };

      const formData = new FormData();
      for (const [key, value] of Object.entries(productData)) {
        if (key === "imagens" && Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else if (key === "especificacoes") {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(
            key,
            typeof value === "boolean"
              ? value
                ? "true"
                : "false"
              : (value as string)
          );
        }
      }

      const res = await fetch("/api/products", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        const errMsg = data.error || "Erro ao criar produto.";
        addNotification("error", "Falha", errMsg);
      } else {
        addNotification(
          "success",
          "Criar Produto",
          "Produto criado com sucesso."
        );

        // Resetar form (sem a notificação "Novo Produto")
        setTitulo("");
        setReferencia("");
        setTipoProduto("");
        setDescricaoCurta("");
        setDescricaoCompleta("");
        setPeso("");
        setMedidas("");
        setStock("");
        setQtdMinima("");
        setUnidade("");
        setTaxaImposto("23");
        setVendasExtraStock(false);
        setProdutoFragil(false);
        setPermitirUpload(false);
        setProdutoGPSR(false);
        setDestaque(false);
        setNovidade(false);
        setEstado("novo");
        setCategorias("");
        setMarcas("");
        setEtiquetas("");
        setCodigoBarras("");

        setPrecoCompraSemIva("");
        setPrecoCompraComIva("");
        setPrecoVendaSemIva("");
        setPrecoVendaComIva("");
        setMargemLucro("");
        setMargemRelacional("");
        setPrecoPrincipal("");
        setPrecoPromocional("");

        setImagensData([]);
        setUploadedImageUrls([]);
        setUsarPrecosVariacoes(false);
        setVariacoes("");

        setPaginaUrl("automatico");
        setUrlPersonalizada("");
        setTituloPagina("");
        setDescricaoPagina("");
        setMetatagsPagina("");

        setEspecificacoesList([]);

        setFieldErrors([]);
        setActiveTab("detalhes");
      }
    } catch (error: any) {
      addNotification(
        "error",
        "Falha",
        error.message || "Falha na requisição."
      );
    } finally {
      setLoading(false);
    }
  }

  // Opções de estado
  const estadoOptions = [
    { label: "Novo", value: "novo" },
    { label: "Usado", value: "usado" },
    { label: "Recondicionado", value: "recondicionado" },
  ];

  // ABA: Detalhes
  function renderAbaDetalhes() {
    return (
      <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded space-y-4">
        <div>
          <label className="font-medium block mb-1">
            Título <span className="text-red-500">*</span>
          </label>
          <SearchInput
            placeholder="Título do produto..."
            withIcon={false}
            value={titulo}
            onChange={setTitulo}
            isError={fieldErrors.includes("titulo")}
            required
          />
        </div>
        <div>
          <label className="font-medium block mb-1">
            Referência <span className="text-red-500">*</span>
          </label>
          <SearchInput
            placeholder="Referência..."
            withIcon={false}
            value={referencia}
            onChange={setReferencia}
            isError={fieldErrors.includes("referencia")}
            required
          />
        </div>
        <div>
          <label className="font-medium block mb-1">
            Tipo de produto <span className="text-red-500">*</span>
          </label>
          <SearchInput
            placeholder="Ex: Eletrônico, Roupa, etc."
            withIcon={false}
            value={tipoProduto}
            onChange={setTipoProduto}
            isError={fieldErrors.includes("tipoProduto")}
            required
          />
        </div>
        <div>
          <label className="font-medium block mb-1">
            Descrição curta <span className="text-red-500">*</span>
          </label>
          <TextAreaInput
            placeholder="Descrição curta do produto..."
            value={descricaoCurta}
            onChange={setDescricaoCurta}
            rows={2}
            required
            isError={fieldErrors.includes("descricaoCurta")}
          />
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-200">
            Caso pretenda dar uma descrição mais completa ao seu produto,
            preencha abaixo:
          </p>
          <TextAreaInput
            placeholder="Descrição completa do produto..."
            value={descricaoCompleta}
            onChange={setDescricaoCompleta}
            rows={4}
          />
        </div>
      </div>
    );
  }

  // ABA: Outras informações
  function renderAbaOutras() {
    return (
      <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-medium block mb-1">
              Peso <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center">
              <SearchInput
                type="number"
                placeholder="0"
                withIcon={false}
                value={peso}
                onChange={setPeso}
                required
                isError={fieldErrors.includes("peso")}
              />
              <span className="ml-2">kg</span>
            </div>
          </div>
          <div>
            <label className="font-medium block mb-1">Medidas</label>
            <SearchInput
              placeholder="Ex: 10x20x30 cm"
              withIcon={false}
              value={medidas}
              onChange={setMedidas}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-medium block mb-1">Stock</label>
            <SearchInput
              type="number"
              placeholder="0"
              withIcon={false}
              value={stock}
              onChange={setStock}
            />
          </div>
          <div>
            <label className="font-medium block mb-1">Qtd. mínima</label>
            <SearchInput
              type="number"
              placeholder="0"
              withIcon={false}
              value={qtdMinima}
              onChange={setQtdMinima}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-medium block mb-1">Unidade</label>
            <SearchInput
              placeholder="Ex: un, pc, cx..."
              withIcon={false}
              value={unidade}
              onChange={setUnidade}
            />
          </div>
          <div>
            <label className="font-medium block mb-1">Taxa de imposto</label>
            <SearchInput
              placeholder="Ex: 23%"
              withIcon={false}
              value={taxaImposto}
              onChange={setTaxaImposto}
            />
          </div>
        </div>
        <div>
          <label className="font-medium block mb-1">Estado</label>
          <SelectInput
            options={estadoOptions}
            value={estado}
            onChange={setEstado}
            placeholder="Selecione o estado..."
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={vendasExtraStock}
              onChange={() => setVendasExtraStock(!vendasExtraStock)}
            />
            <label>Vendas extra stock</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={produtoFragil}
              onChange={() => setProdutoFragil(!produtoFragil)}
            />
            <label>Produto frágil</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={permitirUpload}
              onChange={() => setPermitirUpload(!permitirUpload)}
            />
            <label>Permitir upload de ficheiros</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={produtoGPSR}
              onChange={() => setProdutoGPSR(!produtoGPSR)}
            />
            <label>Produto GPSR</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={destaque}
              onChange={() => setDestaque(!destaque)}
            />
            <label>Destaque</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={novidade}
              onChange={() => setNovidade(!novidade)}
            />
            <label>Novidade</label>
          </div>
        </div>
        <div>
          <label className="font-medium block mb-1">Categorias</label>
          <SearchInput
            placeholder="Adicionar categorias..."
            withIcon={false}
            value={categorias}
            onChange={setCategorias}
          />
        </div>
        <div>
          <label className="font-medium block mb-1">Marcas</label>
          <SearchInput
            placeholder="Adicionar marcas..."
            withIcon={false}
            value={marcas}
            onChange={setMarcas}
          />
        </div>
        <div>
          <label className="font-medium block mb-1">Etiquetas</label>
          <SearchInput
            placeholder="Adicionar etiquetas..."
            withIcon={false}
            value={etiquetas}
            onChange={setEtiquetas}
          />
        </div>
        <div>
          <label className="font-medium block mb-1">Código de barras</label>
          <SearchInput
            placeholder="Ex: 1234567890"
            withIcon={false}
            value={codigoBarras}
            onChange={setCodigoBarras}
          />
        </div>
      </div>
    );
  }

  // ABA: Preços
  function renderAbaPrecos() {
    return (
      <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded space-y-4">
        <p className="text-sm text-gray-600 dark:text-gray-200">
          Defina os preços sem IVA ou com IVA manualmente. As margens são
          calculadas com base no preço de compra e venda sem IVA.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">
              Preço de compra (s/ IVA)
            </label>
            <SearchInput
              type="number"
              placeholder="0.00"
              withIcon={false}
              value={precoCompraSemIva}
              onChange={(val) => {
                setPrecoCompraSemIva(val);
                setLastChangedCompra("semIva");
              }}
            />
          </div>
          <div>
            <label className="block font-medium mb-1">
              Preço de compra (c/ IVA)
            </label>
            <SearchInput
              type="number"
              placeholder="0.00"
              withIcon={false}
              value={precoCompraComIva}
              onChange={(val) => {
                setPrecoCompraComIva(val);
                setLastChangedCompra("comIva");
              }}
            />
          </div>
          <div>
            <label className="block font-medium mb-1">
              Preço de venda (s/ IVA)
            </label>
            <SearchInput
              type="number"
              placeholder="0.00"
              withIcon={false}
              value={precoVendaSemIva}
              onChange={(val) => {
                setPrecoVendaSemIva(val);
                setLastChangedVenda("semIva");
              }}
            />
          </div>
          <div>
            <label className="block font-medium mb-1">
              Preço de venda (c/ IVA)
            </label>
            <SearchInput
              type="number"
              placeholder="0.00"
              withIcon={false}
              value={precoVendaComIva}
              onChange={(val) => {
                setPrecoVendaComIva(val);
                setLastChangedVenda("comIva");
              }}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">
              Margem de lucro (base custo) em %
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded bg-gray-200 dark:bg-gray-600"
              value={margemLucro}
              disabled
            />
          </div>
          <div>
            <label className="block font-medium mb-1">
              Margem de lucro (base venda) em %
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded bg-gray-200 dark:bg-gray-600"
              value={margemRelacional}
              disabled
            />
          </div>
        </div>
        <hr className="my-2 border-gray-300 dark:border-gray-600" />
        <p className="text-sm text-gray-600 dark:text-gray-200">
          Defina os preços principais do produto ou promoções.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">
              Preço principal <span className="text-red-500">*</span>
            </label>
            <SearchInput
              type="number"
              placeholder="0.00"
              withIcon={false}
              value={precoPrincipal}
              onChange={setPrecoPrincipal}
              isError={fieldErrors.includes("precoPrincipal")}
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Preço promocional</label>
            <SearchInput
              type="number"
              placeholder="0.00"
              withIcon={false}
              value={precoPromocional}
              onChange={setPrecoPromocional}
            />
          </div>
        </div>
      </div>
    );
  }

  // ABA: Imagens
  function renderAbaImagens() {
    return (
      <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded space-y-4">
        <p className="text-sm text-gray-600 dark:text-gray-200">
          A primeira imagem será a principal. Evite arquivos maiores que 6MB.
          <br />
          <strong>Formatos permitidos: PNG, JPG, WEBP.</strong>
        </p>
        <input
          type="file"
          multiple
          accept="image/png, image/jpeg, image/webp"
          onChange={handleImagensChange}
        />
        {imagensData.length > 0 && (
          <div className="mt-4 space-y-2">
            {imagensData.map((item, index) => (
              <div
                key={index}
                className="flex w-full items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded"
              >
                <img
                  src={item.previewUrl}
                  alt="preview"
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <SearchInput
                    placeholder="Nome do arquivo..."
                    withIcon={false}
                    value={item.baseName}
                    onChange={(val) => handleImageBaseNameChange(index, val)}
                  />
                </div>
                <div className="h-10 w-20 flex items-center justify-center bg-gray-200 dark:bg-gray-600 rounded text-sm">
                  .{item.extension}
                </div>
                <button
                  type="button"
                  className="h-10 px-4 text-sm bg-red-500 text-white rounded hover:bg-red-600 flex items-center"
                  onClick={() => handleRemoveImage(index)}
                >
                  Remover
                </button>
              </div>
            ))}
          </div>
        )}
        {uploadedImageUrls.length > 0 && (
          <div className="mt-4 p-2 bg-gray-50 dark:bg-gray-800 rounded">
            <h4 className="text-sm font-semibold mb-2">Imagens Salvas:</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
              {uploadedImageUrls.map((url, idx) => (
                <img
                  key={idx}
                  src={url}
                  alt="uploaded"
                  className="w-full h-32 object-cover rounded"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ABA: Variações
  function renderAbaVariacoes() {
    return (
      <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded space-y-4">
        <p className="text-sm text-gray-600 dark:text-gray-200">
          Configure opções extras (cor, tamanho, etc.).
        </p>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={usarPrecosVariacoes}
            onChange={() => setUsarPrecosVariacoes(!usarPrecosVariacoes)}
          />
          <label>Usar preços nas variações</label>
        </div>
        <TextAreaInput
          placeholder="Ex: { cor: 'Branco', adicional: 5.00 }"
          value={variacoes}
          onChange={setVariacoes}
          rows={4}
        />
      </div>
    );
  }

  // ABA: SEO
  function renderAbaSeo() {
    return (
      <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded space-y-4">
        <div>
          <label className="font-medium block mb-1">Página URL *</label>
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="paginaUrl"
                value="automatico"
                checked={paginaUrl === "automatico"}
                onChange={() => setPaginaUrl("automatico")}
              />
              Automático
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="paginaUrl"
                value="personalizado"
                checked={paginaUrl === "personalizado"}
                onChange={() => setPaginaUrl("personalizado")}
              />
              Personalizado
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="paginaUrl"
                value="link"
                checked={paginaUrl === "link"}
                onChange={() => setPaginaUrl("link")}
              />
              Link
            </label>
          </div>
          {paginaUrl === "personalizado" && (
            <SearchInput
              placeholder="/meu-produto-personalizado"
              withIcon={false}
              value={urlPersonalizada}
              onChange={setUrlPersonalizada}
            />
          )}
        </div>
        <div>
          <label className="font-medium block mb-1">Título da página</label>
          <SearchInput
            placeholder="Título da página"
            withIcon={false}
            value={tituloPagina}
            onChange={setTituloPagina}
          />
        </div>
        <div>
          <label className="font-medium block mb-1">Descrição da página</label>
          <TextAreaInput
            placeholder="Descrição da página..."
            value={descricaoPagina}
            onChange={setDescricaoPagina}
            rows={2}
          />
        </div>
        <div>
          <label className="font-medium block mb-1">Metatags da página</label>
          <TextAreaInput
            placeholder="Separe as metatags com ponto e vírgula"
            value={metatagsPagina}
            onChange={setMetatagsPagina}
            rows={2}
          />
        </div>
      </div>
    );
  }

  // ABA: Especificações (array de campos) - começa vazio, só adiciona no botão
  function renderAbaEspecificacoes() {
    return (
      <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded space-y-4">
        <p className="text-sm text-gray-600 dark:text-gray-200">
          Configure especificações únicas (ex: Memória, Processador, etc.).
        </p>

        {especificacoesList.length > 0 &&
          especificacoesList.map((spec, index) => (
            <div
              key={index}
              className="p-2 bg-gray-50 dark:bg-gray-700 rounded space-y-2 mb-2"
            >
              <div>
                <label className="font-medium block mb-1">Título</label>
                <SearchInput
                  placeholder="Título da especificação..."
                  withIcon={false}
                  value={spec.titulo}
                  onChange={(val) =>
                    handleChangeEspecificacao(index, "titulo", val)
                  }
                />
              </div>
              <div>
                <label className="font-medium block mb-1">Descrição</label>
                <TextAreaInput
                  placeholder="Descrição da especificação..."
                  value={spec.descricao}
                  onChange={(val) =>
                    handleChangeEspecificacao(index, "descricao", val)
                  }
                  rows={2}
                />
              </div>
              <button
                type="button"
                onClick={() => handleRemoveEspecificacao(index)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
              >
                Remover
              </button>
            </div>
          ))}

        <button
          type="button"
          onClick={handleAddEspecificacao}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm"
        >
          Adicionar Especificação
        </button>
      </div>
    );
  }

  // Render principal
  return (
    <div
      className="
        container
        max-w-5xl
        mx-auto
        px-4
        py-6
        bg-white
        rounded
        shadow
        dark:bg-gray-800
      "
    >
      <style>{toastAnimationStyle}</style>

      <div className="fixed top-4 right-4 z-50">
        {notifications.map((notif) => (
          <NotificationItem
            key={notif.id}
            notification={notif}
            onClose={removeNotification}
          />
        ))}
      </div>

      <h1 className="text-2xl font-bold mb-4">Produto - Configuração Geral</h1>

      <div className="flex space-x-4 mb-6 text-sm">
        <TabButton
          label="Detalhes"
          active={activeTab === "detalhes"}
          onClick={() => setActiveTab("detalhes")}
        />
        <TabButton
          label="Outras informações"
          active={activeTab === "outras"}
          onClick={() => setActiveTab("outras")}
        />
        <TabButton
          label="Preços"
          active={activeTab === "precos"}
          onClick={() => setActiveTab("precos")}
        />
        <TabButton
          label="Imagens"
          active={activeTab === "imagens"}
          onClick={() => setActiveTab("imagens")}
        />
        <TabButton
          label="Variações"
          active={activeTab === "variacoes"}
          onClick={() => setActiveTab("variacoes")}
        />
        <TabButton
          label="SEO"
          active={activeTab === "seo"}
          onClick={() => setActiveTab("seo")}
        />
        <TabButton
          label="Especificações"
          active={activeTab === "especificacoes"}
          onClick={() => setActiveTab("especificacoes")}
        />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {activeTab === "detalhes" && renderAbaDetalhes()}
        {activeTab === "outras" && renderAbaOutras()}
        {activeTab === "precos" && renderAbaPrecos()}
        {activeTab === "imagens" && renderAbaImagens()}
        {activeTab === "variacoes" && renderAbaVariacoes()}
        {activeTab === "seo" && renderAbaSeo()}
        {activeTab === "especificacoes" && renderAbaEspecificacoes()}

        <div className="flex justify-end space-x-2">
          <SecondaryButton type="button" onClick={handleNovoProduto}>
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

// Botão para trocar de aba
function TabButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`pb-2 border-b-2 transition-colors
        ${
          active
            ? "border-blue-600 font-semibold text-gray-800 dark:text-white"
            : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:border-gray-300"
        }`}
    >
      {label}
    </button>
  );
}
