// src/lib/upload/localStorageService.ts
import fs from "fs";
import path from "path";
import { StorageService } from "./storageService";

const uploadFolder = path.join(process.cwd(), "public", "uploads");

/**
 * Gera um nome de arquivo único, se quiser evitar colisões
 */
function generateUniqueFilename(original: string): string {
  const timestamp = Date.now();
  const ext = path.extname(original);
  const base = path.basename(original, ext).replace(/[^a-z0-9]+/gi, "-");
  return `${base}-${timestamp}${ext}`;
}

export const localStorageService: StorageService = {
  async saveFile(tempPath, finalName) {
    // Garante que a pasta /public/uploads exista
    if (!fs.existsSync(uploadFolder)) {
      fs.mkdirSync(uploadFolder, { recursive: true });
    }

    // Se finalName estiver vazio, gera um nome único
    const safeName = finalName ? finalName : generateUniqueFilename("file.jpg");

    const fullDest = path.join(uploadFolder, safeName);

    // Move do temp path para a pasta uploads
    fs.renameSync(tempPath, fullDest);

    return safeName; // retorna só o nome do arquivo
  },

  getPublicUrl(filename) {
    // Se o file estiver em /public/uploads, sua URL é /uploads/filename
    return "/uploads/" + filename;
  },
};
