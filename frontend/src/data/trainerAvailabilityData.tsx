// Interface for individual time slot
export interface TimeSlot {
  id: string; // Unique identifier for the time slot
  start_time: string; // Start time of the slot (e.g., "10:00:00")
  end_time: string; // End time of the slot (e.g., "11:00:00")
}

// Interface for available days for each trainer
export interface AvailableDay {
  id: string; // Unique identifier for the day
  day: string; // Day of the week (e.g., "Monday", "Tuesday")
  timeslots: TimeSlot[]; // Array of time slots available on this day
}

// Interface for trainer profile with their availability
export interface TrainerAvailabilityType {
  id: string; // Unique identifier for each trainer
  training_type: "virtual" | "inPerson"; // Type of training (virtual or in-person)
  price: number; // Price of the session
  full_name: string; // Full name of the trainer
  username: string; // Username or unique identifier for the trainer
  institute_name: string; // Institute name
  coach_type: "Basketball" | "Football"; // Type of coaching (e.g., "Fitness Coach", "Yoga Instructor")
  available_days: AvailableDay[]; // Available days with timeslots
}

export const trainerAvailability:TrainerAvailabilityType[] = [
  {
    id: "1",
    training_type: "virtual",
    price: 20,
    full_name: "Sarah Johnson",
    username: "sarahj",
    institute_name: "Fitness Pro Academy",
    coach_type: "Basketball",
    available_days: [
      {
        id: "1",
        day: "Monday",
        timeslots: [
          { id: "1", start_time: "09:00:00", end_time: "10:00:00" },
          { id: "2", start_time: "14:00:00", end_time: "15:00:00" }
        ]
      },
      {
        id: "2",
        day: "Wednesday",
        timeslots: [
          { id: "3", start_time: "10:30:00", end_time: "11:30:00" },
          { id: "4", start_time: "16:00:00", end_time: "17:00:00" }
        ]
      }
    ]
  },
  {
    id: "2",
    training_type: "virtual",
    price: 15,
    full_name: "John Smith",
    username: "johnsmith",
    institute_name: "Yoga Center",
    coach_type: "Basketball",
    available_days: [
      {
        id: "3",
        day: "Tuesday",
        timeslots: [
          { id: "5", start_time: "07:00:00", end_time: "08:00:00" },
          { id: "6", start_time: "18:00:00", end_time: "19:00:00" }
        ]
      },
      {
        id: "4",
        day: "Thursday",
        timeslots: [
          { id: "7", start_time: "09:00:00", end_time: "10:00:00" },
          { id: "8", start_time: "15:00:00", end_time: "16:00:00" }
        ]
      }
    ]
  },
  {
    id: "3",
    training_type: "inPerson",
    price: 25,
    full_name: "David Miller",
    username: "davidmiller",
    institute_name: "Strength Training Academy",
    coach_type: "Basketball",
    available_days: [
      {
        id: "5",
        day: "Monday",
        timeslots: [
          { id: "9", start_time: "06:00:00", end_time: "07:00:00" },
          { id: "10", start_time: "12:00:00", end_time: "13:00:00" }
        ]
      },
      {
        id: "6",
        day: "Friday",
        timeslots: [
          { id: "11", start_time: "14:00:00", end_time: "15:00:00" },
          { id: "12", start_time: "17:00:00", end_time: "18:00:00" }
        ]
      }
    ]
  },
  {
    id: "4",
    training_type: "virtual",
    price: 18,
    full_name: "Emily Davis",
    username: "emilydavis",
    institute_name: "Pilates Studio",
    coach_type: "Football",
    available_days: [
      {
        id: "7",
        day: "Monday",
        timeslots: [
          { id: "13", start_time: "10:00:00", end_time: "11:00:00" },
          { id: "14", start_time: "15:00:00", end_time: "16:00:00" }
        ]
      },
      {
        id: "8",
        day: "Thursday",
        timeslots: [
          { id: "15", start_time: "08:00:00", end_time: "09:00:00" },
          { id: "16", start_time: "16:00:00", end_time: "17:00:00" }
        ]
      }
    ]
  },
  {
    id: "5",
    training_type: "inPerson",
    price: 30,
    full_name: "Michael Brown",
    username: "michaelbrown",
    institute_name: "Martial Arts Academy",
    coach_type: "Football",
    available_days: [
      {
        id: "9",
        day: "Tuesday",
        timeslots: [
          { id: "17", start_time: "07:00:00", end_time: "08:00:00" },
          { id: "18", start_time: "14:00:00", end_time: "15:00:00" }
        ]
      },
      {
        id: "10",
        day: "Friday",
        timeslots: [
          { id: "19", start_time: "10:00:00", end_time: "11:00:00" },
          { id: "20", start_time: "13:00:00", end_time: "14:00:00" }
        ]
      }
    ]
  },
  {
    id: "6",
    training_type: "virtual",
    price: 22,
    full_name: "Daniel Walker",
    username: "danielwalker",
    institute_name: "CrossFit Gym",
    coach_type: "Football",
    available_days: [
      {
        id: "11",
        day: "Wednesday",
        timeslots: [
          { id: "21", start_time: "08:00:00", end_time: "09:00:00" },
          { id: "22", start_time: "17:00:00", end_time: "18:00:00" }
        ]
      },
      {
        id: "12",
        day: "Saturday",
        timeslots: [
          { id: "23", start_time: "09:00:00", end_time: "10:00:00" },
          { id: "24", start_time: "12:00:00", end_time: "13:00:00" }
        ]
      }
    ]
  },
  {
    id: "7",
    training_type: "inPerson",
    price: 28,
    full_name: "Ava Martin",
    username: "avamartin",
    institute_name: "Strength Coaching Academy",
    coach_type: "Football",
    available_days: [
      {
        id: "13",
        day: "Monday",
        timeslots: [
          { id: "25", start_time: "08:00:00", end_time: "09:00:00" },
          { id: "26", start_time: "14:00:00", end_time: "15:00:00" }
        ]
      },
      {
        id: "14",
        day: "Thursday",
        timeslots: [
          { id: "27", start_time: "10:00:00", end_time: "11:00:00" },
          { id: "28", start_time: "16:00:00", end_time: "17:00:00" }
        ]
      }
    ]
  },
  {
    id: "8",
    training_type: "virtual",
    price: 18,
    full_name: "Mia Robinson",
    username: "miarobinson",
    institute_name: "Cycling Academy",
    coach_type: "Football",
    available_days: [
      {
        id: "15",
        day: "Tuesday",
        timeslots: [
          { id: "29", start_time: "08:00:00", end_time: "09:00:00" },
          { id: "30", start_time: "17:00:00", end_time: "18:00:00" }
        ]
      },
      {
        id: "16",
        day: "Friday",
        timeslots: [
          { id: "31", start_time: "09:00:00", end_time: "10:00:00" },
          { id: "32", start_time: "15:00:00", end_time: "16:00:00" }
        ]
      }
    ]
  },
  {
    id: "9",
    training_type: "inPerson",
    price: 22,
    full_name: "Lucas Green",
    username: "lucasgreen",
    institute_name: "Boxing Gym",
    coach_type: "Basketball",
    available_days: [
      {
        id: "17",
        day: "Wednesday",
        timeslots: [
          { id: "33", start_time: "07:00:00", end_time: "08:00:00" },
          { id: "34", start_time: "14:00:00", end_time: "15:00:00" }
        ]
      },
      {
        id: "18",
        day: "Saturday",
        timeslots: [
          { id: "35", start_time: "10:00:00", end_time: "11:00:00" },
          { id: "36", start_time: "16:00:00", end_time: "17:00:00" }
        ]
      }
    ]
  }
];
