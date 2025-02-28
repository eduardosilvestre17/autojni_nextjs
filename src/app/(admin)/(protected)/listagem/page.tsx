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

/** Converte "T" em "Ativo" e "F" em "Inativo". */
function getActiveText(active: string) {
  return active === "T" ? "Ativo" : active === "F" ? "Inativo" : active;
}

/** Converte "N" em "Normal" e "S" em "Serviço". */
function getArticleTypeText(type: string) {
  return type === "N" ? "Normal" : type === "S" ? "Serviço" : type;
}

export default function ArticlesPage() {
  // Pesquisa em tempo real (fuzzy)
  const [typingSearch, setTypingSearch] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Dados para carregamento rápido (primeira página) e carregamento completo
  const [initialArticles, setInitialArticles] = useState<any[]>([]);
  const [fullArticles, setFullArticles] = useState<any[]>([]);
  const [allArticlesLoaded, setAllArticlesLoaded] = useState(false);

  // Controle de carregamento e erro
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [totalCount, setTotalCount] = useState(0);

  // Debounce de 300ms para o campo de busca
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(typingSearch);
    }, 300);
    return () => clearTimeout(timer);
  }, [typingSearch]);

  /**
   * Carrega rapidamente apenas a primeira página de artigos (por exemplo, 10 itens).
   */
  async function fetchInitialArticles() {
    setLoading(true);
    setError("");
    try {
      const username = "userapi";
      const password = "1c4a331908e1e5feb96ccba9e82c1b2e8d28f9bb";

      const headers = new Headers();
      headers.set("Authorization", `Basic ${btoa(`${username}:${password}`)}`);

      // Busca somente a primeira página (limite 10)
      const url = `https://autojni.officegest.com/api/stocks/articles?limit=10&offset=0`;
      const response = await fetch(url, { headers });
      if (!response.ok) {
        throw new Error("Erro ao buscar artigos (primeira página)");
      }

      const data = await response.json();
      setInitialArticles(data.articles || []);
      setTotalCount(data.total || 0);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  /**
   * Carrega em segundo plano todos os artigos (sem limite),
   * para permitir pesquisa completa e paginação interna do AdminTable.
   */
  async function fetchFullArticles() {
    try {
      const username = "userapi";
      const password = "1c4a331908e1e5feb96ccba9e82c1b2e8d28f9bb";

      const headers = new Headers();
      headers.set("Authorization", `Basic ${btoa(`${username}:${password}`)}`);

      // Carrega todos os artigos
      const url = `https://autojni.officegest.com/api/stocks/articles?limit=999999&offset=0`;
      const response = await fetch(url, { headers });
      if (!response.ok) {
        throw new Error("Erro ao buscar artigos (completo)");
      }

      const data = await response.json();
      setFullArticles(data.articles || []);
      setAllArticlesLoaded(true);
    } catch (err) {
      // Se der erro no carregamento completo, apenas logamos
      // (a listagem inicial ainda funciona com a primeira página)
      console.error(err);
    }
  }

  // Carregamento rápido ao montar o componente
  useEffect(() => {
    fetchInitialArticles();
  }, []);

  // Carregamento completo em segundo plano
  useEffect(() => {
    fetchFullArticles();
  }, []);

  // Se já carregou tudo, usamos `fullArticles`, caso contrário, `initialArticles`
  const articlesToFilter = allArticlesLoaded ? fullArticles : initialArticles;

  // Filtro fuzzy pela descrição
  const filteredArticles = useMemo(() => {
    if (!searchTerm) return articlesToFilter;
    return articlesToFilter.filter((article) =>
      matchAllWords(searchTerm, article.description || "")
    );
  }, [articlesToFilter, searchTerm]);

  // Ajusta os valores de "articletype" e "active" para exibir textos amigáveis
  const processedArticles = useMemo(() => {
    return filteredArticles.map((article) => ({
      ...article,
      articletype: getArticleTypeText(article.articletype),
      active: getActiveText(article.active),
    }));
  }, [filteredArticles]);

  // Definição das colunas para o AdminTable
  const columns = [
    { key: "id", label: "ID" },
    { key: "description", label: "Descrição" },
    { key: "articletype", label: "Tipo" },
    { key: "purchasingprice", label: "Preço Compra" },
    { key: "sellingprice", label: "Preço Venda" },
    { key: "active", label: "Ativo" },
    { key: "brand", label: "Marca" },
    { key: "stock_quantity", label: "Stock" },
  ];

  return (
    <div className="container max-w-5xl mx-auto px-4 py-6 bg-search-bg rounded shadow dark:bg-search-bg-dark text-foreground dark:text-dark-foreground">
      <h1 className="text-2xl font-bold mb-4">Lista de Artigos</h1>

      {/* Campo de pesquisa em tempo real */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Pesquisar por descrição..."
          value={typingSearch}
          onChange={(e) => setTypingSearch(e.target.value)}
          className="border border-search-border-dark p-2 rounded w-full bg-search-bg dark:bg-search-bg-dark text-foreground dark:text-dark-foreground"
        />
      </div>

      {loading && <p>Carregando...</p>}
      {error && <p className="text-red-500">Erro: {error}</p>}

      {/* Info sobre total de itens retornados ou totalCount se não estiver completo */}
      <div className="mb-2">
        {allArticlesLoaded ? (
          <p>Total de artigos: {filteredArticles.length}</p>
        ) : (
          <p>
            Carregando... Artigos iniciais: {initialArticles.length} / Total:
            {totalCount}
          </p>
        )}
      </div>

      {/* Tabela usando AdminTableClients */}
      <div className="w-full overflow-x-auto">
        <AdminTable
          columns={columns}
          data={processedArticles}
          loading={loading}
          rowsPerPage={10}
          mobileColumnKey="description"
        />
      </div>

      {/* Mensagem enquanto os artigos completos não estão carregados */}
      {!allArticlesLoaded && (
        <p className="mt-4 text-sm italic">
          Carregando todos os artigos em segundo plano...
        </p>
      )}
    </div>
  );
}
