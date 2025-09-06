export type SessionStatus = "On Going" | "Up Comming" | "Cancelled";
export type SessionType = "Virtual Session" | "In-person";

export interface SessionActions {
  join_url: string;
}

export interface Session {
  id: string;
  trainer_name: string;
  price: number;
  category: string;
  date: string;        // ISO date string (e.g., "2024-12-21")
  start_time: string;  // "HH:mm" format
  end_time: string;    // "HH:mm" format
  session_type: SessionType;
  status: SessionStatus;
  avatar_url: string;
  actions: SessionActions;
}

export const trainerBookingData: Session[] = [
  {
    id: "1",
    trainer_name: "Sarah Martinez",
    price: 25,
    category: "Basketball",
    date: "2024-12-21",
    start_time: "15:00",
    end_time: "16:00",
    session_type: "Virtual Session",
    status: "On Going",
    avatar_url: "https://example.com/sarah-martinez.jpg",
    actions: {
      join_url: "/join-session/1"
    }
  },
  {
    id: "2",
    trainer_name: "James Anderson",
    price: 30,
    category: "Yoga",
    date: "2024-12-22",
    start_time: "10:00",
    end_time: "11:00",
    session_type: "Virtual Session",
    status: "Up Comming",
    avatar_url: "https://example.com/james-anderson.jpg",
    actions: {
      join_url: "/join-session/2"
    }
  },
  {
    id: "3",
    trainer_name: "Emily Johnson",
    price: 40,
    category: "Pilates",
    date: "2024-12-23",
    start_time: "18:00",
    end_time: "19:00",
    session_type: "In-person",
    status: "On Going",
    avatar_url: "https://example.com/emily-johnson.jpg",
    actions: {
      join_url: "/join-session/3"
    }
  },
  {
    id: "4",
    trainer_name: "Michael Lee",
    price: 50,
    category: "Boxing",
    date: "2024-12-24",
    start_time: "08:00",
    end_time: "09:00",
    session_type: "Virtual Session",
    status: "Cancelled",
    avatar_url: "https://example.com/michael-lee.jpg",
    actions: {
      join_url: "/join-session/4"
    }
  },
  {
    id: "5",
    trainer_name: "Sophia Williams",
    price: 20,
    category: "Dance",
    date: "2024-12-25",
    start_time: "17:00",
    end_time: "18:00",
    session_type: "In-person",
    status: "On Going",
    avatar_url: "https://example.com/sophia-williams.jpg",
    actions: {
      join_url: "/join-session/5"
    }
  },
  {
    id: "6",
    trainer_name: "David Brown",
    price: 35,
    category: "Martial Arts",
    date: "2024-12-26",
    start_time: "12:00",
    end_time: "13:00",
    session_type: "Virtual Session",
    status: "Up Comming",
    avatar_url: "https://example.com/david-brown.jpg",
    actions: {
      join_url: "/join-session/6"
    }
  },
  {
    id: "7",
    trainer_name: "Olivia Taylor",
    price: 28,
    category: "Zumba",
    date: "2024-12-27",
    start_time: "09:00",
    end_time: "10:00",
    session_type: "Virtual Session",
    status: "On Going",
    avatar_url: "https://example.com/olivia-taylor.jpg",
    actions: {
      join_url: "/join-session/7"
    }
  },
  {
    id: "8",
    trainer_name: "Ethan Wilson",
    price: 45,
    category: "Strength Training",
    date: "2024-12-28",
    start_time: "16:00",
    end_time: "17:00",
    session_type: "In-person",
    status: "On Going",
    avatar_url: "https://example.com/ethan-wilson.jpg",
    actions: {
      join_url: "/join-session/8"
    }
  },
  {
    id: "9",
    trainer_name: "Isabella Garcia",
    price: 22,
    category: "Meditation",
    date: "2024-12-29",
    start_time: "07:00",
    end_time: "08:00",
    session_type: "Virtual Session",
    status: "Up Comming",
    avatar_url: "https://example.com/isabella-garcia.jpg",
    actions: {
      join_url: "/join-session/9"
    }
  },
  {
    id: "10",
    trainer_name: "William Thomas",
    price: 60,
    category: "CrossFit",
    date: "2025-01-02",
    start_time: "19:00",
    end_time: "20:00",
    session_type: "In-person",
    status: "On Going",
    avatar_url: "https://example.com/william-thomas.jpg",
    actions: {
      join_url: "/join-session/10"
    }
  },
  {
    id: "11",
    trainer_name: "Mia Robinson",
    price: 18,
    category: "Aerobics",
    date: "2025-01-03",
    start_time: "11:00",
    end_time: "12:00",
    session_type: "Virtual Session",
    status: "Cancelled",
    avatar_url: "https://example.com/mia-robinson.jpg",
    actions: {
      join_url: "/join-session/11"
    }
  },
  {
    id: "12",
    trainer_name: "Benjamin White",
    price: 55,
    category: "Swimming",
    date: "2025-01-04",
    start_time: "14:00",
    end_time: "15:00",
    session_type: "In-person",
    status: "On Going",
    avatar_url: "https://example.com/benjamin-white.jpg",
    actions: {
      join_url: "/join-session/12"
    }
  },
  {
    id: "13",
    trainer_name: "Charlotte Hall",
    price: 27,
    category: "Cycling",
    date: "2025-01-05",
    start_time: "06:00",
    end_time: "07:00",
    session_type: "Virtual Session",
    status: "Up Comming",
    avatar_url: "https://example.com/charlotte-hall.jpg",
    actions: {
      join_url: "/join-session/13"
    }
  },
  {
    id: "14",
    trainer_name: "Alexander King",
    price: 38,
    category: "Running",
    date: "2025-01-06",
    start_time: "13:00",
    end_time: "14:00",
    session_type: "Virtual Session",
    status: "On Going",
    avatar_url: "https://example.com/alexander-king.jpg",
    actions: {
      join_url: "/join-session/14"
    }
  },
  {
    id: "15",
    trainer_name: "Amelia Scott",
    price: 32,
    category: "Stretching",
    date: "2025-01-07",
    start_time: "17:30",
    end_time: "18:30",
    session_type: "In-person",
    status: "On Going",
    avatar_url: "https://example.com/amelia-scott.jpg",
    actions: {
      join_url: "/join-session/15"
    }
  }
];
