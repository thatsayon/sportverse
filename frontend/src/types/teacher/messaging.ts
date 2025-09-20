export interface TeacherMessageList {
  conversation_id: string;
  other_user: string;
  last_message: string;
  unread_count: number;
}

export interface TeacherMessageListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: TeacherMessageList[];
}