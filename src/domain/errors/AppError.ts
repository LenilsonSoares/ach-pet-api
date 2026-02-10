/**
 * Erro de domínio/aplicação com status HTTP.
 *
 * Usado pelos use cases para sinalizar falhas esperadas (ex.: validação de regra,
 * permissão, recursos inexistentes) sem depender da camada HTTP.
 */
export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly code?: string,
  ) {
    super(message);
  }
}
