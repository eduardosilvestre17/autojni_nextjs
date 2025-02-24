import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Decimal } from "@prisma/client/runtime/library";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const data: any = {};
    for (const [key, value] of formData.entries()) {
      if (key === "images") continue;
      data[key] = value;
    }
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

    const imagensFiles = formData
      .getAll("images")
      .filter((value): value is File => value instanceof File);
    const imagensArray = imagensFiles.map((file) =>
      JSON.stringify({ originalName: file.name, newName: file.name })
    );

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
        paginaUrl: data.paginaUrl || null,
        urlPersonalizada: data.urlPersonalizada || null,
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
