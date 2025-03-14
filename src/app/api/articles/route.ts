// app/api/articles/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Define o revalidate para 12 horas (43200 segundos)
export const revalidate = 43200;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // 1) Paginação
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);

    // 2) Busca
    const search = searchParams.get("search") || "";

    // 3) Filtro de preço
    const minPrice = parseFloat(searchParams.get("minPrice") || "0");
    const maxPrice = parseFloat(searchParams.get("maxPrice") || "999999");

    // 4) Filtro de disponibilidade (stock)
    // Ex.: ?stock=inStock,outOfStock
    const stockParam = searchParams.get("stock") || "";
    const stockValues = stockParam.split(",").filter(Boolean);

    // 5) Ordenação
    // Ex.: ?orderBy=menor-preco
    const orderByParam = searchParams.get("orderBy") || "";

    let orderByClause: any = { id: "asc" }; // fallback
    if (orderByParam === "menor-preco") {
      orderByClause = { sellingPrice: "asc" };
    } else if (orderByParam === "maior-preco") {
      orderByClause = { sellingPrice: "desc" };
    } else if (orderByParam === "mais-recentes") {
      // Ajuste se tiver campo "createdAt" ou similar
      orderByClause = { id: "desc" };
    }
    // "relevancia" ficaria a seu critério; aqui deixamos fallback = id asc.

    // Montamos objeto 'where' considerando todos os filtros
    const where: any = {
      // a) Filtro de busca
      ...(search
        ? {
            OR: [
              { description: { contains: search, mode: "insensitive" } },
              { brand: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
      // b) Faixa de preço
      sellingPrice: {
        gte: minPrice,
        lte: maxPrice,
      },
    };

    // c) Filtro de disponibilidade
    // Se "inStock" checado => stockQuantity > 0
    // Se "outOfStock" checado => stockQuantity = 0
    // Se ambos => não filtra (ou filtra com OR)
    // Se nenhum => não filtra
    if (stockValues.length === 1) {
      if (stockValues[0] === "inStock") {
        where.stockQuantity = { gt: 0 };
      } else if (stockValues[0] === "outOfStock") {
        where.stockQuantity = 0;
      }
    } else if (stockValues.length === 2) {
    }

    // Fazemos count e findMany
    const total = await prisma.article.count({ where });
    const articles = await prisma.article.findMany({
      where,
      skip: offset,
      take: limit,
      orderBy: orderByClause,
    });

    return NextResponse.json({ articles, total });
  } catch (err: any) {
    console.error("Erro na rota /api/articles:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
