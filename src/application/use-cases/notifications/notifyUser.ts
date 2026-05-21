import { logger } from "../../../infra/observability/logger.js";
import type {
  PushCategory,
  PushNotificationRepository,
  PushNotificationService,
  PushNotificationMessage,
} from "../../ports/PushNotifications.js";

export function notifyUser(deps: {
  pushNotificationsRepo?: PushNotificationRepository;
  pushNotificationService?: PushNotificationService;
}) {
  return async (params: {
    userId: string;
    category: PushCategory;
    message: PushNotificationMessage;
  }) => {
    if (!deps.pushNotificationsRepo || !deps.pushNotificationService) return;

    try {
      const tokens = await deps.pushNotificationsRepo.listTokensForUser(params.userId, params.category);
      if (tokens.length === 0) return;

      await deps.pushNotificationService.send(tokens, params.message);
    } catch (error) {
      logger.warn({ err: error, userId: params.userId, category: params.category }, "Falha ao enviar push");
    }
  };
}
