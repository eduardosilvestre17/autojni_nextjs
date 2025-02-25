/*
  Warnings:

  - The primary key for the `Product` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `description` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Product` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[slug]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `referencia` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `titulo` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" DROP CONSTRAINT "Product_pkey",
DROP COLUMN "description",
DROP COLUMN "name",
DROP COLUMN "price",
ADD COLUMN     "categorias" TEXT,
ADD COLUMN     "codigoBarras" TEXT,
ADD COLUMN     "descricaoCompleta" TEXT,
ADD COLUMN     "descricaoCurta" TEXT,
ADD COLUMN     "descricaoPagina" TEXT,
ADD COLUMN     "destaque" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "especificacoes" TEXT,
ADD COLUMN     "estado" TEXT,
ADD COLUMN     "etiquetas" TEXT,
ADD COLUMN     "hasMedidas" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "imagens" TEXT[],
ADD COLUMN     "marcas" TEXT,
ADD COLUMN     "margemLucro" DECIMAL(10,2),
ADD COLUMN     "margemRelacional" DECIMAL(10,2),
ADD COLUMN     "medidas" TEXT,
ADD COLUMN     "metatagsPagina" TEXT,
ADD COLUMN     "novidade" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "permitirUpload" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "peso" DECIMAL(10,2),
ADD COLUMN     "precoCompraComIva" DECIMAL(10,2),
ADD COLUMN     "precoCompraSemIva" DECIMAL(10,2),
ADD COLUMN     "precoPrincipal" DECIMAL(10,2),
ADD COLUMN     "precoPromocional" DECIMAL(10,2),
ADD COLUMN     "precoVendaComIva" DECIMAL(10,2),
ADD COLUMN     "precoVendaSemIva" DECIMAL(10,2),
ADD COLUMN     "produtoFragil" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "produtoGPSR" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "qtdMinima" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "referencia" TEXT NOT NULL,
ADD COLUMN     "slug" TEXT,
ADD COLUMN     "stock" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "taxaImposto" DECIMAL(5,2),
ADD COLUMN     "tipoProduto" TEXT,
ADD COLUMN     "titulo" TEXT NOT NULL,
ADD COLUMN     "tituloPagina" TEXT,
ADD COLUMN     "unidade" TEXT,
ADD COLUMN     "usarPrecosVariacoes" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "variacoes" TEXT,
ADD COLUMN     "vendasExtraStock" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Product_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Product_id_seq";

-- CreateIndex
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");
