// src/app/api/products/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // ajuste o caminho conforme seu projeto
import { Prisma } from "@prisma/client";

/**
 * Converte uma string em slug (ex: "Produto Novo" -> "produto-novo").
 */
function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[\s]+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Gera um slug único no campo "slug" da tabela Product
 * caso já exista, adiciona "-1", "-2", etc.
 */
async function makeUniqueSlug(baseSlug: string, count = 0): Promise<string> {
  const slug = count > 0 ? `${baseSlug}-${count}` : baseSlug;

  const existe = await prisma.product.findUnique({
    where: { slug },
  });

  if (existe) {
    return makeUniqueSlug(baseSlug, count + 1);
  }

  return slug;
}

/**
 * GET /api/products
 * - Se receber ?search=..., filtra por 'titulo' OU 'referencia' contendo o texto (case-sensitive em MySQL).
 * - Caso contrário, lista todos os produtos.
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = (searchParams.get("search") || "").trim();

    // Montamos o where condicional
    let whereClause: any = undefined;

    if (search) {
      whereClause = {
        OR: [
          {
            titulo: {
              contains: search, // Atenção: case-sensitive em MySQL
            },
          },
          {
            referencia: {
              contains: search, // idem
            },
          },
        ],
      };
    }

    const produtos = await prisma.product.findMany({
      where: whereClause,
      select: {
        id: true,
        titulo: true,
        referencia: true,
        slug: true,
        precoPrincipal: true,
        imagens: true,
      },
    });

    return NextResponse.json(produtos, { status: 200 });
  } catch (error) {
    console.error("Erro GET /api/products:", error);
    return NextResponse.json(
      {
        error: "Erro ao listar produtos",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/products
 * Cria um novo produto recebendo dados via FormData() (multipart/form-data).
 * Campo "imagens" (se vier) é tratado como JSON (array de strings).
 */
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const dados: Record<string, any> = {};

    for (const [chave, valor] of formData.entries()) {
      dados[chave] = valor;
    }

    // Converte "true"/"false" em boolean
    const booleanFields = [
      "hasMedidas",
      "vendasExtraStock",
      "produtoFragil",
      "permitirUpload",
      "produtoGPSR",
      "destaque",
      "novidade",
      "usarPrecosVariacoes",
    ];
    booleanFields.forEach((field) => {
      dados[field] = dados[field] === "true";
    });

    // Verifica campos obrigatórios
    if (!dados.titulo || !dados.referencia) {
      return NextResponse.json(
        { error: "Campos obrigatórios ausentes (titulo, referencia)" },
        { status: 400 }
      );
    }

    // Converte campos numéricos para Prisma.Decimal
    const numericFieldsInput: { [key: string]: string | null } = {
      peso: dados.peso || null,
      taxaImposto: dados.taxaImposto || null,
      precoCompraSemIva: dados.precoCompraSemIva || null,
      precoCompraComIva: dados.precoCompraComIva || null,
      precoVendaSemIva: dados.precoVendaSemIva || null,
      precoVendaComIva: dados.precoVendaComIva || null,
      margemLucro: dados.margemLucro || null,
      margemRelacional: dados.margemRelacional || null,
      precoPrincipal: dados.precoPrincipal || null,
      precoPromocional: dados.precoPromocional || null,
    };

    const numericFields: { [key: string]: Prisma.Decimal | null } = {};
    Object.keys(numericFieldsInput).forEach((key) => {
      numericFields[key] = numericFieldsInput[key]
        ? new Prisma.Decimal(numericFieldsInput[key] as string)
        : null;
    });

    // Parse do campo "imagens" (array de string), armazenado como JSON no Prisma
    let imagens: string[] = [];
    if (dados.imagens) {
      try {
        const parsed = JSON.parse(dados.imagens);
        if (Array.isArray(parsed)) {
          imagens = parsed;
        } else {
          throw new Error("O campo imagens não é um array");
        }
      } catch (err) {
        console.warn("Imagens inválidas, definindo como []", err);
        imagens = [];
      }
    }

    // Gera slug único
    const baseSlug = slugify(dados.titulo);
    const uniqueSlug = await makeUniqueSlug(baseSlug);

    // Cria o produto
    const novoProduto = await prisma.product.create({
      data: {
        titulo: dados.titulo,
        referencia: dados.referencia,
        tipoProduto: dados.tipoProduto || null,
        descricaoCurta: dados.descricaoCurta || null,
        descricaoCompleta: dados.descricaoCompleta || null,
        peso: numericFields.peso,
        hasMedidas: dados.hasMedidas,
        medidas: dados.medidas || null,
        stock: dados.stock ? Number(dados.stock) : 0,
        vendasExtraStock: dados.vendasExtraStock,
        unidade: dados.unidade || null,
        taxaImposto: numericFields.taxaImposto,
        qtdMinima: dados.qtdMinima ? Number(dados.qtdMinima) : 0,
        produtoFragil: dados.produtoFragil,
        permitirUpload: dados.permitirUpload,
        produtoGPSR: dados.produtoGPSR,
        estado: dados.estado || null,
        destaque: dados.destaque,
        novidade: dados.novidade,
        categorias: dados.categorias || null,
        marcas: dados.marcas || null,
        etiquetas: dados.etiquetas || null,
        codigoBarras: dados.codigoBarras || null,
        precoCompraSemIva: numericFields.precoCompraSemIva,
        precoCompraComIva: numericFields.precoCompraComIva,
        precoVendaSemIva: numericFields.precoVendaSemIva,
        precoVendaComIva: numericFields.precoVendaComIva,
        margemLucro: numericFields.margemLucro,
        margemRelacional: numericFields.margemRelacional,
        precoPrincipal: numericFields.precoPrincipal,
        precoPromocional: numericFields.precoPromocional,
        usarPrecosVariacoes: dados.usarPrecosVariacoes,
        variacoes: dados.variacoes || null,
        slug: uniqueSlug,
        tituloPagina: dados.tituloPagina || null,
        descricaoPagina: dados.descricaoPagina || null,
        metatagsPagina: dados.metatagsPagina || null,
        especificacoes: dados.especificacoes || null,
        imagens,

        // Exemplo de campo de data: se existir no schema
        // createdAt: new Date(),
      },
    });

    return NextResponse.json({ produto: novoProduto }, { status: 201 });
  } catch (error) {
    console.error("Erro POST /api/products:", error);
    return NextResponse.json(
      {
        error: "Erro ao criar produto",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}
