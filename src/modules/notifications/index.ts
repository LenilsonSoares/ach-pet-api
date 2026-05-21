import { ExpoPushNotificationService } from "../../infra/notifications/ExpoPushNotificationService.js";
import { PrismaPushNotificationRepository } from "../../infra/repositories/PrismaPushNotificationRepository.js";

export function createNotificationsModule() {
  return {
    pushNotificationsRepo: new PrismaPushNotificationRepository(),
    pushNotificationService: new ExpoPushNotificationService(),
  };
}
