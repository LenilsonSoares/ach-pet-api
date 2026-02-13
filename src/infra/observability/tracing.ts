import { NodeSDK } from "@opentelemetry/sdk-node";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";

const sdk = new NodeSDK({
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();

// Exemplo: Tracing automático de requisições HTTP, DB, etc.
// Para produção, configure exportadores (OTLP, Jaeger, etc)
