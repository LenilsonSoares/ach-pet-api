export type PushCategory = "CHAT" | "ADOPTION";

export type PushTokenTarget = {
  token: string;
};

export type PushNotificationMessage = {
  title: string;
  body: string;
  data?: Record<string, unknown>;
};

export type PushNotificationPreferences = {
  pushChatEnabled?: boolean;
  pushAdoptionEnabled?: boolean;
};

export type PushNotificationRepository = {
  upsertToken(input: {
    userId: string;
    token: string;
    platform?: string;
    deviceName?: string;
  }): Promise<void>;
  updatePreferences(
    userId: string,
    input: PushNotificationPreferences,
  ): Promise<{ pushChatEnabled: boolean; pushAdoptionEnabled: boolean } | null>;
  listTokensForUser(userId: string, category: PushCategory): Promise<PushTokenTarget[]>;
};

export type PushNotificationService = {
  send(tokens: PushTokenTarget[], message: PushNotificationMessage): Promise<void>;
};
