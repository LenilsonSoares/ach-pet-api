
export interface StorageProvider {
  /**
   * Salva um arquivo binário e retorna a URL pública.
   * @param buffer Conteúdo do arquivo.
   * @param filename Nome original do arquivo.
   * @param mimetype Tipo MIME.
   */
  save(buffer: Buffer, filename: string, mimetype: string): Promise<string>;

  /**
   * Remove um arquivo do storage, se implementado.
   * @param url URL pública do arquivo a ser removido.
   */
  delete?(url: string): Promise<void>;
}
