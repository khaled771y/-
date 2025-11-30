export enum MessageType {
  USER = 'user',
  BOT = 'bot',
  SYSTEM = 'system'
}

export interface ChatMessage {
  id: string;
  type: MessageType;
  text: string;
  timestamp: Date;
  imageUrl?: string;
  isThinking?: boolean;
  groundingUrls?: string[];
}

export enum AppMode {
  CHAT = 'chat',
  LIVE_VOICE = 'live_voice',
  IMAGE_GEN = 'image_gen',
  CODE = 'code',
  DETECTIVE = 'detective',
  TUTOR = 'tutor',
  FAST = 'fast',
  VIDEO_GEN = 'video_gen'
}

export enum EmotionSensitivity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

export enum ResponseStyle {
  LOGICAL = 'logical',
  BALANCED = 'balanced',
  EMPATHETIC = 'empathetic',
  PLAYFUL = 'playful'
}

export interface UserSettings {
  userName: string;
  persona: string;
  emotionSensitivity: EmotionSensitivity;
  responseStyle: ResponseStyle;
  points: number;
  level: number;
  badges: string[];
}
