export interface invoiceType {
  transition_Id: string;
  trainer_name: string;
  location: string;
  date: string;
  amount: string;
  status: string;
  withdrawType: "Card" | "Paypal"; // new field
}

export const invoices: invoiceType[] = [
  {
    transition_Id: "INV001",
    trainer_name: "Sarah Johnson",
    location: "New York",
    date: "2024-01-15",
    amount: "$250.00",
    status: "Pending",
    withdrawType: "Card"
  },
  {
    transition_Id: "INV002",
    trainer_name: "Michael Rodriguez",
    location: "Los Angeles",
    date: "2024-01-20",
    amount: "$300.00",
    status: "Accepted",
    withdrawType: "Paypal"
  },
  {
    transition_Id: "INV003",
    trainer_name: "David Kim",
    location: "San Francisco",
    date: "2024-01-22",
    amount: "$150.00",
    status: "Rejected",
    withdrawType: "Card"
  },
  {
    transition_Id: "INV004",
    trainer_name: "Lisa Anderson",
    location: "Chicago",
    date: "2024-02-01",
    amount: "$400.00",
    status: "Pending",
    withdrawType: "Paypal"
  },
  {
    transition_Id: "INV005",
    trainer_name: "Robert Taylor",
    location: "Houston",
    date: "2024-02-05",
    amount: "$350.00",
    status: "Accepted",
    withdrawType: "Card"
  },
  {
    transition_Id: "INV006",
    trainer_name: "Jennifer Lopez",
    location: "Miami",
    date: "2024-02-10",
    amount: "$200.00",
    status: "Pending",
    withdrawType: "Paypal"
  },
  {
    transition_Id: "INV007",
    trainer_name: "Mark Wilson",
    location: "Austin",
    date: "2024-02-12",
    amount: "$220.00",
    status: "Accepted",
    withdrawType: "Card"
  },
  {
    transition_Id: "INV008",
    trainer_name: "Rachel Green",
    location: "Seattle",
    date: "2024-02-15",
    amount: "$180.00",
    status: "Rejected",
    withdrawType: "Paypal"
  },
  {
    transition_Id: "INV009",
    trainer_name: "Monica Geller",
    location: "Boston",
    date: "2024-02-18",
    amount: "$250.00",
    status: "Pending",
    withdrawType: "Card"
  },
  {
    transition_Id: "INV010",
    trainer_name: "Phoebe Buffay",
    location: "Philadelphia",
    date: "2024-02-20",
    amount: "$275.00",
    status: "Accepted",
    withdrawType: "Paypal"
  },
  {
    transition_Id: "INV011",
    trainer_name: "Chandler Bing",
    location: "Dallas",
    date: "2024-02-22",
    amount: "$310.00",
    status: "Rejected",
    withdrawType: "Card"
  }
];
