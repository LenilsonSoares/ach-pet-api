export interface SendMessageInputBoundary {
  threadId: string;
  userId: string;
  content: string;
}

export interface SendMessageOutputBoundary {
  messageId: string;
  sentAt: Date;
}

export interface SendMessagePresenter {
  present(output: SendMessageOutputBoundary): any;
}
