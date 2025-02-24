// src/lib/upload/storageService.ts

export interface StorageService {
  /**
   * Recebe o caminho temporário do arquivo e o nome final.
   * Retorna o nome ou caminho público (URL ou relativo) onde foi salvo.
   */
  saveFile(tempPath: string, finalName: string): Promise<string>;

  /**
   * Recebe um nome de arquivo (relativo) e retorna a URL pública de acesso.
   */
  getPublicUrl(filename: string): string;
}

/**
 * Factory para obter a implementação (no futuro, pode haver S3, Cloudinary etc.)
 */
import { localStorageService } from "./localStorageService";

export function getStorageService(): StorageService {
  // EX: se quiser variar por variável de ambiente:
  // if (process.env.STORAGE_TYPE === "S3") return s3StorageService;
  return localStorageService;
}
