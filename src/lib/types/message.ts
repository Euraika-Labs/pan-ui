export type MessageRole = 'user' | 'assistant' | 'system' | 'tool';

export type MessageAttachment = {
  id: string;
  name: string;
  size: number;
  type: string;
};

export type Message = {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: string;
  attachments?: MessageAttachment[];
};
