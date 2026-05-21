import type {
  PushCategory,
  PushNotificationPreferences,
  PushNotificationRepository,
  PushTokenTarget,
} from "../../application/ports/PushNotifications.js";
import { prisma } from "../db/prisma.js";

export class PrismaPushNotificationRepository implements PushNotificationRepository {
  async upsertToken(input: {
    userId: string;
    token: string;
    platform?: string;
    deviceName?: string;
  }): Promise<void> {
    await prisma.pushToken.upsert({
      where: { token: input.token },
      create: {
        userId: input.userId,
        token: input.token,
        platform: input.platform,
        deviceName: input.deviceName,
        enabled: true,
      },
      update: {
        userId: input.userId,
        platform: input.platform,
        deviceName: input.deviceName,
        enabled: true,
      },
      select: { id: true },
    });
  }

  async updatePreferences(
    userId: string,
    input: PushNotificationPreferences,
  ): Promise<{ pushChatEnabled: boolean; pushAdoptionEnabled: boolean } | null> {
    const exists = await prisma.user.findUnique({ where: { id: userId }, select: { id: true } });
    if (!exists) return null;

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        pushChatEnabled: input.pushChatEnabled,
        pushAdoptionEnabled: input.pushAdoptionEnabled,
      },
      select: {
        pushChatEnabled: true,
        pushAdoptionEnabled: true,
      },
    });

    return user;
  }

  async listTokensForUser(userId: string, category: PushCategory): Promise<PushTokenTarget[]> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        pushChatEnabled: true,
        pushAdoptionEnabled: true,
        pushTokens: {
          where: { enabled: true },
          select: { token: true },
        },
      },
    });

    if (!user) return [];
    if (category === "CHAT" && !user.pushChatEnabled) return [];
    if (category === "ADOPTION" && !user.pushAdoptionEnabled) return [];

    return user.pushTokens;
  }
}
