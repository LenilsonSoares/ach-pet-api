// Presenter base para múltiplas interfaces (HTTP, CLI, etc)
// Permite evoluir para REST, GraphQL, CLI, WebSocket, etc, sem acoplamento

export interface Presenter<T = any> {
  success(data: T): any;
  fail(error: Error): any;
}

// Exemplo de Presenter HTTP (Express)
export class HttpJsonPresenter<T = any> implements Presenter<T> {
  constructor(private res: any) {}
  success(data: T) {
    return this.res.status(200).json({ success: true, data });
  }
  fail(error: Error) {
    // Pode customizar para AppError, etc
    return this.res.status(400).json({ success: false, error: error.message });
  }
}

// Exemplo de Presenter para CLI (stdout)
export class CliPresenter<T = any> implements Presenter<T> {
  success(data: T) {
    // eslint-disable-next-line no-console
    console.log(JSON.stringify({ success: true, data }, null, 2));
  }
  fail(error: Error) {
    // eslint-disable-next-line no-console
    console.error(JSON.stringify({ success: false, error: error.message }, null, 2));
  }
}
