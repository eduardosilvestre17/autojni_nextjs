"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { PrimaryButton, SecondaryButton } from "@/components/Buttons";

// Tabs possíveis
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
  newName: string; // Nome que o usuário pode alterar antes de fazer o upload
}

function parseTaxa(): number {
  return 23;
}

export default function ProdutoPage() {
  // 1) Hooks do Next Auth
  const { data: session, status } = useSession();
  const router = useRouter();

  // 2) Todos os useState
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>("detalhes");

  // Campos do produto
  const [titulo, setTitulo] = useState("");
  const [referencia, setReferencia] = useState("");
  const [tipoProduto, setTipoProduto] = useState("");
  const [descricaoCurta, setDescricaoCurta] = useState("");
  const [descricaoCompleta, setDescricaoCompleta] = useState("");

  // Outras Infos
  const [peso, setPeso] = useState("0");
  const [hasMedidas, setHasMedidas] = useState(false);
  const [medidas, setMedidas] = useState("");
  const [stock, setStock] = useState("");
  const [vendasExtraStock, setVendasExtraStock] = useState(false);
  const [unidade, setUnidade] = useState("");
  const [taxaImposto, setTaxaImposto] = useState("23");
  const [qtdMinima, setQtdMinima] = useState("");
  const [produtoFragil, setProdutoFragil] = useState(false);
  const [permitirUpload, setPermitirUpload] = useState(false);
  const [produtoGPSR, setProdutoGPSR] = useState(false);
  const [estado, setEstado] = useState("novo");
  const [destaque, setDestaque] = useState(false);
  const [novidade, setNovidade] = useState(false);
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

  // Imagens
  const [imagensData, setImagensData] = useState<ImageData[]>([]);
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);

  // Variações
  const [usarPrecosVariacoes, setUsarPrecosVariacoes] = useState(false);
  const [variacoes, setVariacoes] = useState("");

  // SEO
  const [paginaUrl, setPaginaUrl] = useState("automatico");
  const [urlPersonalizada, setUrlPersonalizada] = useState("");
  const [tituloPagina, setTituloPagina] = useState("");
  const [descricaoPagina, setDescricaoPagina] = useState("");
  const [metatagsPagina, setMetatagsPagina] = useState("");

  // Especificações
  const [especificacoes, setEspecificacoes] = useState("");

  // Preço: qual campo foi alterado por último
  const [lastChangedCompra, setLastChangedCompra] = useState<
    "semIva" | "comIva" | null
  >(null);
  const [lastChangedVenda, setLastChangedVenda] = useState<
    "semIva" | "comIva" | null
  >(null);

  // 3) Efeitos
  // 3a) Se não autenticado, redirecionar
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  // 3b) Calcular margens
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

  // 3c) Sincroniza compra sem e com IVA
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

  // 3d) Sincroniza venda sem e com IVA
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

  // 4) Se ainda estiver carregando a sessão, podemos exibir algo
  if (status === "loading") {
    return <p>Carregando...</p>;
  }

  // Handlers de imagem
  function handleImagensChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      const files = Array.from(e.target.files).map((file) => {
        const previewUrl = URL.createObjectURL(file);
        return { file, previewUrl, newName: file.name };
      });
      setImagensData((prev) => [...prev, ...files]);
    }
  }

  function handleImageNameChange(index: number, newName: string) {
    setImagensData((prev) =>
      prev.map((item, i) => (i === index ? { ...item, newName } : item))
    );
  }

  function handleRemoveImage(index: number) {
    setImagensData((prev) => {
      const clone = [...prev];
      clone.splice(index, 1);
      return clone;
    });
  }

  function handleNovoProduto() {
    setTitulo("");
    setReferencia("");
    setTipoProduto("");
    setDescricaoCurta("");
    setDescricaoCompleta("");
    setPeso("0");
    setHasMedidas(false);
    setMedidas("");
    setStock("");
    setVendasExtraStock(false);
    setUnidade("");
    setTaxaImposto("23");
    setQtdMinima("");
    setProdutoFragil(false);
    setPermitirUpload(false);
    setProdutoGPSR(false);
    setEstado("novo");
    setDestaque(false);
    setNovidade(false);
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
    setEspecificacoes("");
    setErro("");
    setActiveTab("detalhes");
  }

  // Envio do formulário
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro("");

    // Campos obrigatórios
    if (
      !titulo ||
      !referencia ||
      !tipoProduto ||
      !descricaoCurta ||
      !precoPrincipal
    ) {
      setErro("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    setLoading(true);

    try {
      // 1) Upload das imagens para pages/api/uploads.ts
      let imageUrls: string[] = [];
      if (imagensData.length > 0) {
        const imagesForm = new FormData();
        imagensData.forEach((item) => {
          imagesForm.append("images", item.file, item.newName);
        });

        // Fazemos fetch para "/api/uploads" (Pages Router).
        // A rota /api/uploads foi criada em pages/api/uploads.ts
        // que usa formidable para salvar em /public/uploads
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

      // 2) Enviar dados do produto (com as URLs das imagens) para "/api/products"
      //    (Pode ser no App Router ou Pages Router, depende de como você implementou).
      const productData = {
        titulo,
        referencia,
        tipoProduto,
        descricaoCurta,
        descricaoCompleta,
        peso,
        hasMedidas,
        medidas,
        stock,
        vendasExtraStock,
        unidade,
        taxaImposto,
        qtdMinima,
        produtoFragil,
        permitirUpload,
        produtoGPSR,
        estado,
        destaque,
        novidade,
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
        especificacoes,
        imagens: imageUrls, // array de URLs
      };

      const formData = new FormData();
      for (const [key, value] of Object.entries(productData)) {
        formData.append(
          key,
          typeof value === "boolean"
            ? value
              ? "true"
              : "false"
            : (value as string)
        );
      }

      // Faz fetch p/ "/api/products"
      // Se também estiver no Pages Router, seria pages/api/products.ts
      const res = await fetch("/api/products", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        setErro(data.error || "Erro ao criar produto.");
      } else {
        router.push("/dashboard");
      }
    } catch (error: any) {
      setErro(error.message || "Falha na requisição.");
    } finally {
      setLoading(false);
    }
  }

  // --- Renderização das ABAs
  function renderAbaDetalhes() {
    return (
      <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded space-y-4">
        <div>
          <label className="font-medium block mb-1">
            Título <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="font-medium block mb-1">
            Referência <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={referencia}
            onChange={(e) => setReferencia(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="font-medium block mb-1">
            Tipo de produto <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            placeholder="Ex: Eletrônico, Roupa, etc."
            value={tipoProduto}
            onChange={(e) => setTipoProduto(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="font-medium block mb-1">
            Descrição curta <span className="text-red-500">*</span>
          </label>
          <textarea
            className="w-full p-2 border rounded"
            rows={2}
            value={descricaoCurta}
            onChange={(e) => setDescricaoCurta(e.target.value)}
            required
          />
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-200">
            Caso pretenda dar uma descrição mais completa ao seu produto,
            preencha abaixo:
          </p>
          <textarea
            className="w-full p-2 border rounded mt-2"
            rows={4}
            placeholder="Descrição completa do produto..."
            value={descricaoCompleta}
            onChange={(e) => setDescricaoCompleta(e.target.value)}
          />
        </div>
      </div>
    );
  }

  function renderAbaOutras() {
    return (
      <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded space-y-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="font-medium block mb-1">
              Peso <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center">
              <input
                type="number"
                className="p-2 border rounded w-32"
                value={peso}
                onChange={(e) => setPeso(e.target.value)}
                required
              />
              <span className="ml-2">kg</span>
            </div>
          </div>
          <div className="flex-1">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={hasMedidas}
                onChange={() => setHasMedidas(!hasMedidas)}
              />
              Adicionar medidas
            </label>
            {hasMedidas && (
              <input
                type="text"
                placeholder="Ex: 10x20x30 cm"
                className="mt-2 p-2 border rounded w-full"
                value={medidas}
                onChange={(e) => setMedidas(e.target.value)}
              />
            )}
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="font-medium block mb-1">Stock</label>
            <input
              type="number"
              className="w-full p-2 border rounded"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />
          </div>
          <div className="flex-1 flex items-center mt-6 gap-2">
            <input
              type="checkbox"
              checked={vendasExtraStock}
              onChange={() => setVendasExtraStock(!vendasExtraStock)}
            />
            <label>Vendas extra stock</label>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="font-medium block mb-1">Unidade</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              placeholder="Ex: un, pc, cx..."
              value={unidade}
              onChange={(e) => setUnidade(e.target.value)}
            />
          </div>
          <div className="flex-1">
            <label className="font-medium block mb-1">Taxa de imposto</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              placeholder="Ex: 23%"
              value={taxaImposto}
              onChange={(e) => setTaxaImposto(e.target.value)}
            />
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="font-medium block mb-1">Qtd. mínima</label>
            <input
              type="number"
              className="w-full p-2 border rounded"
              value={qtdMinima}
              onChange={(e) => setQtdMinima(e.target.value)}
            />
          </div>
          <div className="flex-1 flex items-center gap-2 mt-6">
            <input
              type="checkbox"
              checked={produtoFragil}
              onChange={() => setProdutoFragil(!produtoFragil)}
            />
            <label>Produto frágil</label>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex-1 flex items-center gap-2">
            <input
              type="checkbox"
              checked={permitirUpload}
              onChange={() => setPermitirUpload(!permitirUpload)}
            />
            <label>Permitir upload de ficheiros no carrinho</label>
          </div>
          <div className="flex-1 flex items-center gap-2">
            <input
              type="checkbox"
              checked={produtoGPSR}
              onChange={() => setProdutoGPSR(!produtoGPSR)}
            />
            <label>Produto abrangido pelo GPSR</label>
          </div>
        </div>
        <div>
          <label className="block font-medium">Estado</label>
          <select
            className="p-2 border rounded w-full mt-1"
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
          >
            <option value="novo">Novo</option>
            <option value="usado">Usado</option>
            <option value="recondicionado">Recondicionado</option>
          </select>
        </div>
        <div className="flex gap-4">
          <div className="flex-1 flex items-center gap-2">
            <input
              type="checkbox"
              checked={destaque}
              onChange={() => setDestaque(!destaque)}
            />
            <label>Destaque</label>
          </div>
          <div className="flex-1 flex items-center gap-2">
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
          <input
            type="text"
            className="w-full p-2 border rounded"
            placeholder="Adicionar categorias..."
            value={categorias}
            onChange={(e) => setCategorias(e.target.value)}
          />
        </div>
        <div>
          <label className="font-medium block mb-1">Marcas</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            placeholder="Adicionar marcas..."
            value={marcas}
            onChange={(e) => setMarcas(e.target.value)}
          />
        </div>
        <div>
          <label className="font-medium block mb-1">Etiquetas</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            placeholder="Adicionar etiquetas..."
            value={etiquetas}
            onChange={(e) => setEtiquetas(e.target.value)}
          />
        </div>
        <div>
          <label className="font-medium block mb-1">Código de barras</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            placeholder="Ex: 1234567890"
            value={codigoBarras}
            onChange={(e) => setCodigoBarras(e.target.value)}
          />
        </div>
      </div>
    );
  }

  function renderAbaPrecos() {
    return (
      <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded space-y-4">
        <p className="text-sm text-gray-600 dark:text-gray-200">
          Defina os preços sem IVA ou com IVA manualmente. As margens são
          calculadas com base no preço de compra e venda sem IVA.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">
              Preço de compra (s/ IVA)
            </label>
            <input
              type="number"
              step="0.01"
              className="w-full p-2 border rounded"
              value={precoCompraSemIva}
              onChange={(e) => {
                setPrecoCompraSemIva(e.target.value);
                setLastChangedCompra("semIva");
              }}
            />
          </div>
          <div>
            <label className="block font-medium mb-1">
              Preço de compra (c/ IVA)
            </label>
            <input
              type="number"
              step="0.01"
              className="w-full p-2 border rounded"
              value={precoCompraComIva}
              onChange={(e) => {
                setPrecoCompraComIva(e.target.value);
                setLastChangedCompra("comIva");
              }}
            />
          </div>
          <div>
            <label className="block font-medium mb-1">
              Preço de venda (s/ IVA)
            </label>
            <input
              type="number"
              step="0.01"
              className="w-full p-2 border rounded"
              value={precoVendaSemIva}
              onChange={(e) => {
                setPrecoVendaSemIva(e.target.value);
                setLastChangedVenda("semIva");
              }}
            />
          </div>
          <div>
            <label className="block font-medium mb-1">
              Preço de venda (c/ IVA)
            </label>
            <input
              type="number"
              step="0.01"
              className="w-full p-2 border rounded"
              value={precoVendaComIva}
              onChange={(e) => {
                setPrecoVendaComIva(e.target.value);
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
            <input
              type="number"
              step="0.01"
              className="w-full p-2 border rounded"
              value={precoPrincipal}
              onChange={(e) => setPrecoPrincipal(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Preço promocional</label>
            <input
              type="number"
              step="0.01"
              className="w-full p-2 border rounded"
              value={precoPromocional}
              onChange={(e) => setPrecoPromocional(e.target.value)}
            />
          </div>
        </div>
      </div>
    );
  }

  function renderAbaImagens() {
    return (
      <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded space-y-4">
        <p className="text-sm text-gray-600 dark:text-gray-200">
          A primeira imagem será a principal. Evite arquivos maiores que 6MB.
        </p>
        <input type="file" multiple onChange={handleImagensChange} />

        {imagensData.length > 0 && (
          <div className="mt-4 space-y-2">
            {imagensData.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-800 rounded"
              >
                <img
                  src={item.previewUrl}
                  alt="preview"
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <label className="text-sm block mb-1">Nome p/ BD</label>
                  <input
                    type="text"
                    value={item.newName}
                    onChange={(e) =>
                      handleImageNameChange(index, e.target.value)
                    }
                    className="p-1 border rounded w-full"
                  />
                </div>
                <button
                  type="button"
                  className="px-2 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                  onClick={() => handleRemoveImage(index)}
                >
                  Remover
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Imagens já enviadas (se existir) */}
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

  function renderAbaVariacoes() {
    return (
      <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded space-y-4">
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
        <textarea
          className="w-full p-2 border rounded"
          rows={4}
          placeholder="Ex: { cor: 'Branco', adicional: 5.00 }"
          value={variacoes}
          onChange={(e) => setVariacoes(e.target.value)}
        />
      </div>
    );
  }

  function renderAbaSeo() {
    return (
      <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded space-y-4">
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
            <input
              type="text"
              placeholder="/meu-produto-personalizado"
              className="mt-2 w-full p-2 border rounded"
              value={urlPersonalizada}
              onChange={(e) => setUrlPersonalizada(e.target.value)}
            />
          )}
        </div>
        <div>
          <label className="font-medium block mb-1">Título da página</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={tituloPagina}
            onChange={(e) => setTituloPagina(e.target.value)}
          />
        </div>
        <div>
          <label className="font-medium block mb-1">Descrição da página</label>
          <textarea
            className="w-full p-2 border rounded"
            rows={2}
            value={descricaoPagina}
            onChange={(e) => setDescricaoPagina(e.target.value)}
          />
        </div>
        <div>
          <label className="font-medium block mb-1">Metatags da página</label>
          <textarea
            className="w-full p-2 border rounded"
            rows={2}
            placeholder="Separe as metatags com ponto e vírgula"
            value={metatagsPagina}
            onChange={(e) => setMetatagsPagina(e.target.value)}
          />
        </div>
      </div>
    );
  }

  function renderAbaEspecificacoes() {
    return (
      <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded space-y-4">
        <p className="text-sm text-gray-600 dark:text-gray-200">
          Configure especificações (Memória, Processador, etc.).
        </p>
        <textarea
          className="w-full p-2 border rounded"
          rows={4}
          placeholder="Ex: Memória: 16GB RAM; Disco: 512GB SSD; ..."
          value={especificacoes}
          onChange={(e) => setEspecificacoes(e.target.value)}
        />
      </div>
    );
  }

  // Render final
  return (
    <div className="w-full max-w-5xl mx-auto bg-white p-6 rounded shadow dark:bg-gray-800">
      <h1 className="text-2xl font-bold mb-4">Produto - Configuração Geral</h1>
      {erro && <p className="text-red-600 mb-2">{erro}</p>}

      {/* Tabs */}
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

      {/* Form */}
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

// Componente simples p/ Tabs
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
      className={`pb-2 border-b-2 transition-colors ${
        active
          ? "border-blue-600 font-semibold"
          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
      }`}
    >
      {label}
    </button>
  );
}
