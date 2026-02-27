export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

// Nimrobo AI Types
export interface NimroboProject {
  id: string;
  name: string;
  description: string;
  prompt: string;
  landingPageTitle: string;
  landingPageInfo: string;
  timeLimitMinutes: number;
  evaluator?: {
    prompt: string;
    questions: { id: string; label: string; type: "text" | "number" }[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface NimroboLink {
  id: string;
  token: string;
  label: string;
  status: "active" | "used" | "expired" | "cancelled" | string;
  expiryPreset: "1_day" | "1_week" | "1_month";
  expiresAt: string;
  timeLimitMinutes: number;
  url: string;
  createdAt: string;
  updatedAt: string;
}

export interface NimroboSessionStatus {
  sessionId: string;
  type: "project" | "instant";
  projectId?: string;
  status: string;
  agentId: string;
  wsUrl: string;
  createdAt?: string;
  updatedAt?: string;
  completedAt?: string;
}
