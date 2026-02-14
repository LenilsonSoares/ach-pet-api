export interface StorageService {
  /**
   * Salva um arquivo binário e retorna a URL pública.
   * @param file Buffer do arquivo
   * @param filename Nome sugerido
   * @param mimetype Tipo MIME
   */
  save(file: Buffer, filename: string, mimetype: string): Promise<string>;
  /**
   * Remove um arquivo pelo nome/caminho.
   */
  delete(filename: string): Promise<void>;
}
