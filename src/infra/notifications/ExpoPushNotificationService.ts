import type {
  PushNotificationMessage,
  PushNotificationService,
  PushTokenTarget,
} from "../../application/ports/PushNotifications.js";
import { logger } from "../observability/logger.js";

const EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";
const MAX_BATCH_SIZE = 100;

function isExpoPushToken(token: string) {
  return /^(ExponentPushToken|ExpoPushToken)\[[^\]]+\]$/.test(token);
}

function chunk<T>(items: T[], size: number) {
  const chunks: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
}

export class ExpoPushNotificationService implements PushNotificationService {
  async send(tokens: PushTokenTarget[], message: PushNotificationMessage): Promise<void> {
    const validTokens = tokens.map((item) => item.token).filter(isExpoPushToken);
    if (validTokens.length === 0) return;

    const payloads = validTokens.map((to) => ({
      to,
      sound: "default",
      title: message.title,
      body: message.body,
      data: message.data ?? {},
    }));

    for (const payloadChunk of chunk(payloads, MAX_BATCH_SIZE)) {
      const response = await fetch(EXPO_PUSH_URL, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Accept-Encoding": "gzip, deflate",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payloadChunk),
      });

      if (!response.ok) {
        const body = await response.text().catch(() => "");
        logger.warn({ status: response.status, body }, "Expo push rejeitou a requisicao");
      }
    }
  }
}
