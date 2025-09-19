// Updated types for session management

export type CreateSessionRequest = {
  id?: string;
  training_type: string;
  price: string;
  close_before: string;
  available_days: {
    id?: string; // Optional day ID for existing days
    day: string;
    time_slots: {
      id?: string; // Optional ID for existing slots
      start_time: string;
      end_time: string;
    }[];
  }[];
};

export type CreateSessionResponse = {
  id: string;
  training_type: string;
  price: string;
  close_before: string;
  days: {
    id: string;
    day: string;
    slots: {
      id: string;
      start_time: string;
      end_time: string;
    }[];
  }[];
  created_at: string;
};

export type DeleteTimeSlotRequest = {
  slot_id: string;
};

export type DeleteTimeSlotResponse = {
  success: string;
  message: string;
};

export type deleteResponse = {
  success: string;
};

export type deleteRequest = {
  id: string;
};

// Time slot checking
export interface TimeCheckRequest {
  day: string;
  start_time: string;
  end_time: string;
  session_id?: string; // Optional for checking existing session slots
}

export interface TimeCheckResponse {
  available: boolean;
  message: string;
}

// Get session types
export interface Slot {
  id: string;
  start_time: string; // Format: "HH:MM:SS"
  end_time: string; // Format: "HH:MM:SS"
}

export interface Day {
  id: string;
  day: string; // e.g., "monday", "wednesday"
  time_slots: Slot[]; // Changed from 'slots' to 'time_slots' to match API response
}

export interface SessionResult {
  id: string;
  training_type: string; // e.g., "mindset"
  price: string; // e.g., "1.11"
  close_before: string; // Format: "HH:MM:SS"
  available_days: Day[];
  created_at: string; // ISO timestamp
}

export interface SessionResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: SessionResult[];
}

// Internal component types for handling mixed existing/new slots
export interface TimeSlot {
  id?: string; // Present for existing slots, undefined for new slots
  start_time: string; // Format: "HH:MM"
  end_time: string; // Format: "HH:MM"
  isExisting?: boolean; // Helper flag to distinguish existing vs new
}