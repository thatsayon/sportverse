

export interface invoiceType {
  invoiceId: string;
  recementName: string;
  paymentType: "Paypal" | "Card";
  date: string;
  amount: string;
  status: "Complete" | "Pending" | "Cancelled";
}


export const invoices:invoiceType[] = [
  {
    invoiceId: "EKG46SJFNI7",
    recementName: "Christine Brooks",
    paymentType: "Paypal",
    date: "14 Aug 2025",
    amount: "$129.99 USD",
    status: "Complete",
  },
  {
    invoiceId: "258963",
    recementName: "Rosie Pearson",
    paymentType: "Card",
    date: "14 Aug 2025",
    amount: "$129.99 USD",
    status: "Complete",
  },
  {
    invoiceId: "357951",
    recementName: "Darrell Caldwell",
    paymentType: "Paypal",
    date: "14 Aug 2025",
    amount: "$129.99 USD",
    status: "Complete",
  },
  {
    invoiceId: "789321",
    recementName: "Gilbert Johnston",
    paymentType: "Card",
    date: "14 Aug 2025",
    amount: "$129.99 USD",
    status: "Cancelled",
  },
  {
    invoiceId: "546978",
    recementName: "Alan Cain",
    paymentType: "Paypal",
    date: "15 Aug 2025",
    amount: "$129.99 USD",
    status: "Pending",
  },
  {
    invoiceId: "256314",
    recementName: "Gilbert Johnston",
    paymentType: "Card",
    date: "15 Aug 2025",
    amount: "$129.99 USD",
    status: "Complete",
  },
  {
    invoiceId: "789621",
    recementName: "Bradley Lawlor",
    paymentType: "Paypal",
    date: "17 Aug 2025",
    amount: "$129.99 USD",
    status: "Cancelled",
  },
  {
    invoiceId: "369841",
    recementName: "John Dukes",
    paymentType: "Card",
    date: "20 Aug 2025",
    amount: "$129.99 USD",
    status: "Complete",
  },
  {
    invoiceId: "369842",
    recementName: "Kathy Pacheco",
    paymentType: "Paypal",
    date: "21 Aug 2025",
    amount: "$129.99 USD",
    status: "Pending",
  },
  {
    invoiceId: "459873",
    recementName: "Emily Watson",
    paymentType: "Card",
    date: "22 Aug 2025",
    amount: "$129.99 USD",
    status: "Complete",
  },
  {
    invoiceId: "589321",
    recementName: "Michael Lee",
    paymentType: "Paypal",
    date: "23 Aug 2025",
    amount: "$129.99 USD",
    status: "Pending",
  },
  {
    invoiceId: "698742",
    recementName: "Sophia Turner",
    paymentType: "Card",
    date: "24 Aug 2025",
    amount: "$129.99 USD",
    status: "Cancelled",
  },
  {
    invoiceId: "785932",
    recementName: "James Carter",
    paymentType: "Paypal",
    date: "25 Aug 2025",
    amount: "$129.99 USD",
    status: "Complete",
  },
  {
    invoiceId: "879654",
    recementName: "Olivia Martinez",
    paymentType: "Card",
    date: "26 Aug 2025",
    amount: "$129.99 USD",
    status: "Pending",
  },
  {
    invoiceId: "985621",
    recementName: "William Harris",
    paymentType: "Paypal",
    date: "27 Aug 2025",
    amount: "$129.99 USD",
    status: "Complete",
  },
];
