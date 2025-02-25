import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Decimal } from "@prisma/client/runtime/library";

// Exemplo simples de função slugify para criar um "URL automático"
// Caso não queira usar slug, basta remover e não adicionar no create()
function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[\s]+/g, "-") // espaços viram "-"
    .replace(/[^\w\-]+/g, "") // remove caracteres não alfanuméricos
    .replace(/\-\-+/g, "-") // colapsa múltiplos "-" em um só
    .replace(/^-+|-+$/g, ""); // remove "-" do início e do fim
}

export async function POST(req: Request) {
  try {
    // Obter e processar o formData
    const formData = await req.formData();
    const data: any = {};
    for (const [key, value] of formData.entries()) {
      data[key] = value;
    }
    // Log dos dados recebidos
    console.log("Dados do formData:", data);

    data.hasMedidas = data.hasMedidas === "true";
    data.vendasExtraStock = data.vendasExtraStock === "true";
    data.produtoFragil = data.produtoFragil === "true";
    data.permitirUpload = data.permitirUpload === "true";
    data.produtoGPSR = data.produtoGPSR === "true";
    data.destaque = data.destaque === "true";
    data.novidade = data.novidade === "true";
    data.usarPrecosVariacoes = data.usarPrecosVariacoes === "true";

    if (!data.titulo || !data.referencia) {
      return NextResponse.json(
        { error: "Campos obrigatórios ausentes (título, referência)." },
        { status: 400 }
      );
    }

    // Conversão de valores para Decimal
    const pesoDecimal = data.peso ? new Decimal(data.peso) : null;
    const taxaImpostoDecimal = data.taxaImposto
      ? new Decimal(data.taxaImposto)
      : null;
    const compraNoIvaDecimal = data.precoCompraSemIva
      ? new Decimal(data.precoCompraSemIva)
      : null;
    const compraIvaDecimal = data.precoCompraComIva
      ? new Decimal(data.precoCompraComIva)
      : null;
    const vendaNoIvaDecimal = data.precoVendaSemIva
      ? new Decimal(data.precoVendaSemIva)
      : null;
    const vendaIvaDecimal = data.precoVendaComIva
      ? new Decimal(data.precoVendaComIva)
      : null;
    const margemCustoDecimal = data.margemLucro
      ? new Decimal(data.margemLucro)
      : null;
    const margemVendaDecimal = data.margemRelacional
      ? new Decimal(data.margemRelacional)
      : null;
    const precoPrincipalDecimal = data.precoPrincipal
      ? new Decimal(data.precoPrincipal)
      : null;
    const precoPromocionalDecimal = data.precoPromocional
      ? new Decimal(data.precoPromocional)
      : null;

    // Tratamento do campo "imagens": vem como JSON string
    let imagensArray: string[] = [];
    if (data.imagens) {
      try {
        imagensArray = JSON.parse(data.imagens);
      } catch (e) {
        console.error("Erro ao fazer parse de data.imagens:", e);
        imagensArray = [];
      }
    }
    console.log("Array de imagens a ser salvo:", imagensArray);

    // Exemplo: gerar "slug" com base no título, se quiser
    const slug = slugify(data.titulo);

    // Log final dos dados que serão enviados ao Prisma
    console.log("Dados finais para criação do produto:", {
      ...data,
      slug,
      peso: pesoDecimal,
      taxaImposto: taxaImpostoDecimal,
      precoCompraSemIva: compraNoIvaDecimal,
      precoCompraComIva: compraIvaDecimal,
      precoVendaSemIva: vendaNoIvaDecimal,
      precoVendaComIva: vendaIvaDecimal,
      margemLucro: margemCustoDecimal,
      margemRelacional: margemVendaDecimal,
      precoPrincipal: precoPrincipalDecimal,
      precoPromocional: precoPromocionalDecimal,
      imagens: imagensArray,
    });

    // Criação do produto com Prisma
    const novoProduto = await prisma.product.create({
      data: {
        titulo: data.titulo,
        referencia: data.referencia,
        tipoProduto: data.tipoProduto || null,
        descricaoCurta: data.descricaoCurta || null,
        descricaoCompleta: data.descricaoCompleta || null,
        peso: pesoDecimal,
        hasMedidas: data.hasMedidas || false,
        medidas: data.medidas || null,
        stock: data.stock ? Number(data.stock) : 0,
        vendasExtraStock: data.vendasExtraStock || false,
        unidade: data.unidade || null,
        taxaImposto: taxaImpostoDecimal,
        qtdMinima: data.qtdMinima ? Number(data.qtdMinima) : 0,
        produtoFragil: data.produtoFragil || false,
        permitirUpload: data.permitirUpload || false,
        produtoGPSR: data.produtoGPSR || false,
        estado: data.estado || null,
        destaque: data.destaque || false,
        novidade: data.novidade || false,
        categorias: data.categorias || null,
        marcas: data.marcas || null,
        etiquetas: data.etiquetas || null,
        codigoBarras: data.codigoBarras || null,
        precoCompraSemIva: compraNoIvaDecimal,
        precoCompraComIva: compraIvaDecimal,
        precoVendaSemIva: vendaNoIvaDecimal,
        precoVendaComIva: vendaIvaDecimal,
        margemLucro: margemCustoDecimal,
        margemRelacional: margemVendaDecimal,
        precoPrincipal: precoPrincipalDecimal,
        precoPromocional: precoPromocionalDecimal,
        usarPrecosVariacoes: data.usarPrecosVariacoes || false,
        variacoes: data.variacoes || null,
        slug,
        tituloPagina: data.tituloPagina || null,
        descricaoPagina: data.descricaoPagina || null,
        metatagsPagina: data.metatagsPagina || null,
        especificacoes: data.especificacoes || null,
        imagens: imagensArray,
      },
    });

    return NextResponse.json({ produto: novoProduto }, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar produto:", error);
    return NextResponse.json(
      { error: "Ocorreu um erro ao criar o produto." },
      { status: 500 }
    );
  }
}
