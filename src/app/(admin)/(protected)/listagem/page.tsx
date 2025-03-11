"use client";

import React, { useState, useEffect, useMemo } from "react";
import AdminTable from "@/components/AdminTableClients";

/**
 * Remove acentos e converte a string para lowercase.
 */
function normalizeStr(str: string): string {
  return str
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

/**
 * Verifica se todas as palavras de `userText` estão contidas em `target`,
 * ignorando acentos e diferenças de case.
 */
function matchAllWords(userText: string, target: string): boolean {
  const words = userText.split(/\s+/).filter(Boolean);
  if (words.length === 0) return true;
  const normTarget = normalizeStr(target);
  for (const w of words) {
    if (!normTarget.includes(normalizeStr(w))) {
      return false;
    }
  }
  return true;
}

/** Converte `active: boolean` em texto "Ativo"/"Inativo". */
function getActiveText(active: boolean) {
  return active ? "Ativo" : "Inativo";
}

/** Ajusta o campo `articleType` caso ele seja "N"/"S", ou "Normal"/"Serviço". */
function getArticleTypeText(type: string) {
  if (type === "N") return "Normal";
  if (type === "S") return "Serviço";
  // Se já é "Normal"/"Serviço", retorna o próprio
  return type || "";
}

export default function ArticlesPage() {
  // Estado de busca
  const [typingSearch, setTypingSearch] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Armazena artigos iniciais (10) e completos
  const [initialArticles, setInitialArticles] = useState<any[]>([]);
  const [fullArticles, setFullArticles] = useState<any[]>([]);
  const [allArticlesLoaded, setAllArticlesLoaded] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  // Controle de loading e erro
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Controle de sincronização (manual/automático)
  const [syncLoading, setSyncLoading] = useState(false);
  const [syncMessage, setSyncMessage] = useState("");

  // Debounce de 300ms para `typingSearch`
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(typingSearch);
    }, 300);
    return () => clearTimeout(timer);
  }, [typingSearch]);

  /**
   * Busca 10 artigos do DB local (rota interna)
   */
  async function fetchInitialArticles() {
    setLoading(true);
    setError("");
    try {
      // A rota deve retornar algo como { articles: [...], total: number }
      const res = await fetch("/api/articles?limit=10&offset=0");
      if (!res.ok) {
        throw new Error("Erro ao buscar artigos iniciais do DB");
      }
      const data = await res.json();
      setInitialArticles(data.articles || []);
      setTotalCount(data.total || 0);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  /**
   * Busca TODOS os artigos do DB local (rota interna)
   */
  async function fetchFullArticles() {
    try {
      const res = await fetch("/api/articles?limit=999999&offset=0");
      if (!res.ok) {
        throw new Error("Erro ao buscar todos os artigos do DB");
      }
      const data = await res.json();
      setFullArticles(data.articles || []);
      setAllArticlesLoaded(true);
    } catch (err) {
      console.error(err);
    }
  }

  // Ao montar, busca inicialmente 10 e, em segundo plano, todos
  useEffect(() => {
    fetchInitialArticles();
    fetchFullArticles();
  }, []);

  /**
   * Botão/função de Sincronizar (chama /api/officegest/sync)
   */
  async function handleSync() {
    setSyncLoading(true);
    setSyncMessage("");
    try {
      const res = await fetch("/api/officegest/sync");
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Erro na sincronização");
      }
      setSyncMessage(data.message || "Sincronização concluída!");

      // Recarrega os artigos após sincronizar
      await fetchInitialArticles();
      await fetchFullArticles();

      // Salva timestamp no localStorage para o agendamento
      localStorage.setItem("lastSyncTimestamp", Date.now().toString());
    } catch (err: any) {
      setSyncMessage(err.message);
    } finally {
      setSyncLoading(false);
    }
  }

  /**
   * Agendamento automático: se passaram 12h desde a última sync?
   */
  useEffect(() => {
    const lastSync = localStorage.getItem("lastSyncTimestamp");
    const twelveHours = 12 * 60 * 60 * 1000;
    if (lastSync) {
      const lastSyncTime = parseInt(lastSync, 10);
      const now = Date.now();
      if (now - lastSyncTime >= twelveHours) {
        handleSync();
      }
    } else {
      // Primeira sincronização
      handleSync();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Decide se exibe os 10 iniciais ou todos
  const articlesToFilter = allArticlesLoaded ? fullArticles : initialArticles;

  // Filtro fuzzy
  const filteredArticles = useMemo(() => {
    if (!searchTerm) return articlesToFilter;
    return articlesToFilter.filter((article) => {
      const matchDescription = matchAllWords(
        searchTerm,
        article.description || ""
      );
      const matchId = matchAllWords(searchTerm, String(article.id || ""));
      return matchDescription || matchId;
    });
  }, [articlesToFilter, searchTerm]);

  // Ajusta o articleType e active para exibir "Normal"/"Serviço" e "Ativo"/"Inativo"
  const processedArticles = useMemo(() => {
    return filteredArticles.map((article) => ({
      ...article,
      articletype: getArticleTypeText(article.articleType || ""),
      active: getActiveText(!!article.active),
    }));
  }, [filteredArticles]);

  // Colunas para o AdminTable
  const columns = [
    { key: "id", label: "ID" },
    { key: "description", label: "Descrição" },
    { key: "articletype", label: "Tipo" },
    { key: "purchasingPrice", label: "Preço Compra" },
    { key: "sellingPrice", label: "Preço Venda" },
    { key: "active", label: "Ativo" },
    { key: "brand", label: "Marca" },
    { key: "stockQuantity", label: "Stock" },
  ];

  return (
    <div className="container max-w-5xl mx-auto px-4 py-6 bg-search-bg rounded shadow dark:bg-search-bg-dark text-foreground dark:text-dark-foreground">
      <h1 className="text-2xl font-bold mb-4">Lista de Artigos</h1>

      {/* Botão de sincronizar */}
      <div className="mb-4 flex items-center gap-3">
        <button
          onClick={handleSync}
          disabled={syncLoading}
          className="border border-gray-300 rounded px-4 py-2 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          {syncLoading ? "Sincronizando..." : "Sincronizar"}
        </button>
        {syncMessage && (
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {syncMessage}
          </span>
        )}
      </div>

      {/* Campo de pesquisa */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Pesquisar por ID ou descrição..."
          value={typingSearch}
          onChange={(e) => setTypingSearch(e.target.value)}
          className="border border-search-border-dark p-2 rounded w-full bg-search-bg dark:bg-search-bg-dark text-foreground dark:text-dark-foreground"
        />
      </div>

      {loading && <p>Carregando (inicial)...</p>}
      {error && <p className="text-red-500">Erro: {error}</p>}

      <p className="mb-2 text-sm text-gray-500">
        Total no banco (aprox.): {totalCount}
      </p>

      <div className="w-full overflow-x-auto">
        <AdminTable
          columns={columns}
          data={processedArticles}
          loading={loading}
          rowsPerPage={10}
          mobileColumnKey="description"
        />
      </div>
    </div>
  );
}
