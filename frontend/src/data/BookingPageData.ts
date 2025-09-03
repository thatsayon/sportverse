export interface BookingCardProps {
  id: number;
  trainerName: string;
  sports: "Football" | "Basketball";
  sessionTime: string;
  sessionDate: string;
  sessionType: "Virtual Session" | "Mindset Session" | "In Person";
  trainerImage?: string;
  rating?: number;
}

export const BookingPageData: BookingCardProps[] = [
  {
    id: 1,
    trainerName: "Sarah Martinez",
    sports: "Basketball",
    sessionTime: "3:00 PM - 4:00 PM",
    sessionDate: "December 21, 2024",
    sessionType: "Virtual Session",
    rating: 5,
  },
  {
    id: 2,
    trainerName: "Mike Johnson",
    sports: "Football",
    sessionTime: "10:00 AM - 11:00 AM",
    sessionDate: "December 22, 2025",
    sessionType: "In Person",
    rating: 4,
  },
  {
    id: 3,
    trainerName: "Lisa Chen",
    sports: "Basketball",
    sessionTime: "2:00 PM - 3:00 PM",
    sessionDate: "December 23, 2024",
    sessionType: "Mindset Session",
    rating: 5,
  },
  {
    id: 4,
    trainerName: "David Thompson",
    sports: "Football",
    sessionTime: "5:00 PM - 6:00 PM",
    sessionDate: "December 24, 2024",
    sessionType: "Virtual Session",
    rating: 4,
  },
  {
    id: 5,
    trainerName: "Emily Rodriguez",
    sports: "Basketball",
    sessionTime: "9:00 AM - 10:00 AM",
    sessionDate: "December 25, 2024",
    sessionType: "In Person",
    rating: 5,
  },
  {
    id: 6,
    trainerName: "James Wilson",
    sports: "Football",
    sessionTime: "7:00 PM - 8:00 PM",
    sessionDate: "December 26, 2024",
    sessionType: "Mindset Session",
    rating: 4,
  },
  {
    id: 7,
    trainerName: "Anna Davis",
    sports: "Basketball",
    sessionTime: "11:00 AM - 12:00 PM",
    sessionDate: "December 27, 2024",
    sessionType: "Virtual Session",
    rating: 5,
  },
  {
    id: 8,
    trainerName: "Chris Brown",
    sports: "Football",
    sessionTime: "4:00 PM - 5:00 PM",
    sessionDate: "December 28, 2024",
    sessionType: "In Person",
    rating: 3,
  },
];
