// src/pages/api/uploads.ts

import type { NextApiRequest, NextApiResponse } from "next";
import formidable, { Fields, Files } from "formidable";
import fs from "fs";
import path from "path";

// Para desativar o body parser padrão do Next (obrigatório para usar formidable).
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não suportado" });
  }

  try {
    // 1) Garante a pasta /public/uploads
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // 2) Cria o parser do formidable
    const form = formidable({
      multiples: true, // se quiser aceitar múltiplos arquivos
      maxFileSize: 6 * 1024 * 1024, // 6MB, por exemplo
      uploadDir, // caminho onde os arquivos temporários serão criados
      keepExtensions: true, // manter extensão do arquivo
    });

    // 3) Faz o parse do request
    form.parse(req, async (err: any, fields: Fields, files: Files) => {
      if (err) {
        console.error("Erro no upload:", err);
        return res.status(500).json({ error: "Falha ao processar arquivo." });
      }

      // 'files.images' -> se enviarmos com formData.append("images", file)
      const fileArray = Array.isArray(files.images)
        ? files.images
        : [files.images].filter(Boolean);

      // 4) Para cada arquivo, movemos / renomeamos se quiser
      const fileUrls: string[] = [];

      for (const file of fileArray) {
        // Se 'file' for undefined ou inválido, ignora
        if (!file || !file.filepath) continue;

        // Caminho temporário (onde o formidable salvou)
        const tempPath = file.filepath;
        // Nome original do arquivo
        const originalName = file.originalFilename || "arquivo.jpg";
        // Gera um nome final (se quiser remover espaços, etc.)
        const finalName = originalName.replace(/\s+/g, "-");

        // Caminho final em /public/uploads
        const finalPath = path.join(uploadDir, finalName);

        // Move do temp para o final
        fs.renameSync(tempPath, finalPath);

        // URL de acesso público (ex.: /uploads/arquivo.jpg)
        const fileUrl = "/uploads/" + finalName;
        fileUrls.push(fileUrl);
      }

      // 5) Retorna as URLs geradas
      return res.json({
        success: true,
        images: fileUrls,
        fields, // se quiser retornar também os campos do form
      });
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: "Erro inesperado." });
  }
}
