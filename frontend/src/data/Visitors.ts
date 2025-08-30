export interface visitorType{
  id: string;
  manager: string;
  state: string;
  date: string;
  type: "Basketball" | "Football";
  status: "Complete" | "Cancelled" | "Pending";
}
export const visitors: visitorType[] = [
  {
    id: "123456",
    manager: "Christine Brooks",
    state: "North Carolina",
    date: "14 Aug 2025",
    type: "Basketball",
    status: "Complete",
  },
  {
    id: "258963",
    manager: "Rosie Pearson",
    state: "South Carolina",
    date: "14 Aug 2025",
    type: "Football",
    status: "Complete",
  },
  {
    id: "357951",
    manager: "Darrell Caldwell",
    state: "Georgia",
    date: "14 Aug 2025",
    type: "Basketball",
    status: "Complete",
  },
  {
    id: "785321",
    manager: "Gilbert Johnston",
    state: "Tennessee",
    date: "14 Aug 2025",
    type: "Football",
    status: "Cancelled",
  },
  {
    id: "546978",
    manager: "Alan Cain",
    state: "Virginia",
    date: "15 Aug 2025",
    type: "Football",
    status: "Pending",
  },
  {
    id: "265434",
    manager: "Gilbert Johnston",
    state: "Kentucky",
    date: "15 Aug 2025",
    type: "Basketball",
    status: "Complete",
  },
  {
    id: "798621",
    manager: "Bradley Lawlor",
    state: "Alabama",
    date: "17 Aug 2025",
    type: "Football",
    status: "Cancelled",
  },
  {
    id: "369841",
    manager: "John Dukes",
    state: "West Virginia",
    date: "17 Aug 2025",
    type: "Football",
    status: "Complete",
  },
  {
    id: "369842",
    manager: "John Dukes",
    state: "Florida",
    date: "20 Aug 2025",
    type: "Football",
    status: "Complete",
  },
  {
    id: "369843",
    manager: "Kathy Pacheco",
    state: "West Virginia",
    date: "21 Aug 2025",
    type: "Basketball",
    status: "Pending",
  },
];