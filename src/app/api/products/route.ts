// src/app/api/products/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Decimal } from "@prisma/client/runtime/library";

function slugify(t: string) {
  return t
    .toLowerCase()
    .trim()
    .replace(/[\s]+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function makeUniqueSlug(b: string, c = 0): Promise<string> {
  let a = b;
  if (c > 0) a = `${b}-${c}`;
  const e = await prisma.product.findUnique({ where: { slug: a } });
  if (e) return makeUniqueSlug(b, c + 1);
  return a;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const s = searchParams.get("search") ?? "";
    if (s.trim()) {
      const r = await prisma.product.findMany({
        where: { titulo: { contains: s, mode: "insensitive" } },
        select: {
          id: true,
          titulo: true,
          slug: true,
          precoPrincipal: true,
          imagens: true,
        },
      });
      return NextResponse.json(r);
    } else {
      const r = await prisma.product.findMany({
        select: {
          id: true,
          titulo: true,
          slug: true,
          precoPrincipal: true,
          imagens: true,
        },
      });
      return NextResponse.json(r);
    }
  } catch {
    return NextResponse.json(
      { error: "Erro ao listar produtos" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const f = await req.formData();
    const d: any = {};
    for (const [k, v] of f.entries()) d[k] = v;
    d.hasMedidas = d.hasMedidas === "true";
    d.vendasExtraStock = d.vendasExtraStock === "true";
    d.produtoFragil = d.produtoFragil === "true";
    d.permitirUpload = d.permitirUpload === "true";
    d.produtoGPSR = d.produtoGPSR === "true";
    d.destaque = d.destaque === "true";
    d.novidade = d.novidade === "true";
    d.usarPrecosVariacoes = d.usarPrecosVariacoes === "true";
    if (!d.titulo || !d.referencia) {
      return NextResponse.json(
        { error: "Campos obrigatórios ausentes" },
        { status: 400 }
      );
    }
    const p = d.peso ? new Decimal(d.peso) : null;
    const t = d.taxaImposto ? new Decimal(d.taxaImposto) : null;
    const cn = d.precoCompraSemIva ? new Decimal(d.precoCompraSemIva) : null;
    const ci = d.precoCompraComIva ? new Decimal(d.precoCompraComIva) : null;
    const vn = d.precoVendaSemIva ? new Decimal(d.precoVendaSemIva) : null;
    const vi = d.precoVendaComIva ? new Decimal(d.precoVendaComIva) : null;
    const mc = d.margemLucro ? new Decimal(d.margemLucro) : null;
    const mv = d.margemRelacional ? new Decimal(d.margemRelacional) : null;
    const pp = d.precoPrincipal ? new Decimal(d.precoPrincipal) : null;
    const pr = d.precoPromocional ? new Decimal(d.precoPromocional) : null;
    let imgs: string[] = [];
    if (d.imagens) {
      try {
        imgs = JSON.parse(d.imagens);
      } catch {}
    }
    const baseSlug = slugify(d.titulo);
    const uniqueSlug = await makeUniqueSlug(baseSlug);
    const r = await prisma.product.create({
      data: {
        titulo: d.titulo,
        referencia: d.referencia,
        tipoProduto: d.tipoProduto || null,
        descricaoCurta: d.descricaoCurta || null,
        descricaoCompleta: d.descricaoCompleta || null,
        peso: p,
        hasMedidas: d.hasMedidas || false,
        medidas: d.medidas || null,
        stock: d.stock ? Number(d.stock) : 0,
        vendasExtraStock: d.vendasExtraStock || false,
        unidade: d.unidade || null,
        taxaImposto: t,
        qtdMinima: d.qtdMinima ? Number(d.qtdMinima) : 0,
        produtoFragil: d.produtoFragil || false,
        permitirUpload: d.permitirUpload || false,
        produtoGPSR: d.produtoGPSR || false,
        estado: d.estado || null,
        destaque: d.destaque || false,
        novidade: d.novidade || false,
        categorias: d.categorias || null,
        marcas: d.marcas || null,
        etiquetas: d.etiquetas || null,
        codigoBarras: d.codigoBarras || null,
        precoCompraSemIva: cn,
        precoCompraComIva: ci,
        precoVendaSemIva: vn,
        precoVendaComIva: vi,
        margemLucro: mc,
        margemRelacional: mv,
        precoPrincipal: pp,
        precoPromocional: pr,
        usarPrecosVariacoes: d.usarPrecosVariacoes || false,
        variacoes: d.variacoes || null,
        slug: uniqueSlug,
        tituloPagina: d.tituloPagina || null,
        descricaoPagina: d.descricaoPagina || null,
        metatagsPagina: d.metatagsPagina || null,
        especificacoes: d.especificacoes || null,
        imagens: imgs,
      },
    });
    return NextResponse.json({ produto: r }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Erro ao criar produto" },
      { status: 500 }
    );
  }
}
