import client from "prom-client";

const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

export const httpRequestDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "Duração das requisições HTTP em segundos",
  labelNames: ["method", "route", "status_code"],
});

// Exemplo de uso:
// const end = httpRequestDuration.startTimer({ method, route });
// ...
// end({ status_code })

export function metricsMiddleware(_req, res, next) {
  res.on("finish", () => {
    // Aqui você pode registrar métricas customizadas
  });
  next();
}

export function metricsEndpoint(req, res) {
  res.set("Content-Type", client.register.contentType);
  res.end(client.register.metrics());
}
