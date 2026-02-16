/**
 * Erro de domínio/aplicação com status HTTP.
 *
 * Usado pelos use cases para sinalizar falhas esperadas (ex.: validação de regra,
 * permissão, recursos inexistentes) sem depender da camada HTTP.
 */

type SupportedLang = 'pt-BR' | 'en-US';

const messages: Record<string, { 'pt-BR': string; 'en-US': string }> = {
  'INVALID_CREDENTIALS': {
    'pt-BR': 'Credenciais inválidas',
    'en-US': 'Invalid credentials',
  },
  'NOT_FOUND': {
    'pt-BR': 'Recurso não encontrado',
    'en-US': 'Resource not found',
  },
  'FORBIDDEN': {
    'pt-BR': 'Acesso negado',
    'en-US': 'Access denied',
  },
  // Adicione outros códigos conforme necessário
};

/**
 * Erro de domínio/aplicação com suporte a internacionalização de mensagens.
 * Permite customizar idioma da mensagem de erro (pt-BR, en-US).
 */
export class AppError extends Error {
  public readonly localizedMessage: string;

  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly code?: string,
    lang: SupportedLang = 'pt-BR',
  ) {
    super(message);
    this.localizedMessage = AppError.resolveMessage(message, code, lang);
  }

  /**
   * Resolve mensagem internacionalizada a partir do code ou do texto.
   */
  private static resolveMessage(
    message: string,
    code?: string,
    lang: SupportedLang = 'pt-BR',
  ): string {
    if (code && messages[code] && messages[code][lang]) {
      return messages[code][lang];
    }
    // fallback: retorna mensagem original
    return message;
  }
}
