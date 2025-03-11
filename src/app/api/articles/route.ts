// app/api/articles/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Define o revalidate para 12 horas (43200 segundos)
export const revalidate = 43200;

export async function GET(request: NextRequest) {
  try {
    // Pega ?limit= e ?offset= da URL
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);
    const total = await prisma.article.count();

    const articles = await prisma.article.findMany({
      skip: offset,
      take: limit,
      orderBy: { id: "asc" },
    });

    return NextResponse.json({ articles, total });
  } catch (err: any) {
    console.error("Erro na rota /api/articles:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
