export interface ConversationResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Conversation[];
}

export interface Conversation {
  id: string;
  teacher_name: string;
  student_name: string;
  subject: "virtual" | "in_person" | string; // Extendable if more subjects
  message_count: number;
  last_activity: string; // ISO timestamp
  created_at: string; // ISO timestamp
}


export interface ConversationDetail {
  id: string;
  teacher_name: string;
  student_name: string;
  subject: "virtual" | "in_person" | string;
  created_at: string; // ISO timestamp
  messages: PaginatedMessages;
}

export interface PaginatedMessages {
  count: number;
  total_pages: number;
  current_page: number;
  page_size: number;
  next: string | null;
  previous: string | null;
  results: ChatMessage[];
}

export interface ChatMessage {
  id: string;
  sender_name: string;
  sender_username: string;
  recipient_name: string;
  recipient_username: string;
  content: string;
  created_at: string; // ISO timestamp
  delivered: boolean;
  read: boolean;
}
