// app/api/officegest/sync/route.ts (Next 13)
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const username = "userapi";
  const password = "1c4a331908e1e5feb96ccba9e82c1b2e8d28f9bb";

  const headers = new Headers();
  headers.set("Authorization", `Basic ${btoa(`${username}:${password}`)}`);

  try {
    const url = `https://autojni.officegest.com/api/stocks/articles?limit=999999&offset=0`;
    const response = await fetch(url, { headers });

    // Se o status não for 2xx, gera erro
    if (!response.ok) {
      throw new Error(
        `Erro ao buscar artigos na OfficeGest (status: ${response.status})`
      );
    }

    // Tenta fazer parse do JSON
    const data = await response.json();
    if (!data?.articles) {
      throw new Error("Resposta não contém 'articles'.");
    }

    const articles = data.articles;

    for (const article of articles) {
      // Ajuste dos campos
      const articleType = article.articletype === "N" ? "Normal" : "Serviço";
      const isActive = article.active === "T";

      await prisma.article.upsert({
        where: { id: article.id },
        create: {
          id: article.id,
          description: article.description || "",
          articleType,
          purchasingPrice: article.purchasingprice || 0,
          sellingPrice: article.sellingprice || 0,
          active: isActive,
          // Se article.brand vier numerico, vira string:
          brand: String(article.brand ?? ""),
          stockQuantity: article.stock_quantity || 0,
        },
        update: {
          description: article.description || "",
          articleType,
          purchasingPrice: article.purchasingprice || 0,
          sellingPrice: article.sellingprice || 0,
          active: isActive,
          brand: String(article.brand ?? ""),
          stockQuantity: article.stock_quantity || 0,
        },
      });
    }

    // Retorna sucesso
    return NextResponse.json({
      success: true,
      message: `Sincronizados ${articles.length} artigos.`,
    });
  } catch (err) {
    // Para evitar o erro "payload argument must be of type object", convertemos err p/ string
    const errString = String(err);

    console.error("Erro ao sincronizar artigos: " + errString);

    // Retorna JSON de erro seguro (para o front não quebrar ao tentar .json())
    return NextResponse.json(
      {
        success: false,
        error: errString || "Erro inesperado",
      },
      { status: 500 }
    );
  }
}
