// components/dashboard/TrainersTable.tsx
"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit } from "lucide-react";
import Link from "next/link";
import { Teacher } from "@/types/admin/dashboard";

interface Trainer {
  id: string;
  name: string;
  state: string;
  status: "Verified" | "Unverified";
  avatar?: string;
  sports: string;
}

const trainersData: Trainer[] = [
  {
    id: "1",
    name: "Iva Ryan",
    state: "California",
    status: "Verified",
    avatar: "/avatars/iva.jpg",
    sports: "Football",
  },
  {
    id: "2",
    name: "Lorri Warf",
    state: "Washington",
    status: "Unverified",
    avatar: "/avatars/lorri.jpg",
    sports: "Basketball",
  },
  {
    id: "3",
    name: "James Hall",
    state: "Texas",
    status: "Verified",
    avatar: "/avatars/james.jpg",
    sports: "Football",
  },
];

// const getStatusColor = (status: string) => {
//   switch (status) {
//     case "Verified":
//       return "bg-green-100 text-green-800 hover:bg-green-100";
//     case "Unverified":
//       return "bg-red-100 text-red-800 hover:bg-red-100";
//     default:
//       return "bg-gray-100 text-gray-800 hover:bg-gray-100";
//   }
// };

interface TrainersTableProps {
  data: Teacher[];
}

const TrainersTable: React.FC<TrainersTableProps> = ({ data = [] }) => {
  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <div className="flex items-center justify-between mb-4 px-4">
            <h3 className="text-xl font-semibold">Total trainers</h3>
            <Link href={"/dashboard/trainers"}>
              <Button
                variant="ghost"
                size="sm"
                className="text-[#808080] hover:text-[#F15A24]"
              >
                View all
              </Button>
            </Link>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="border-b">
                <TableHead className="px-6 text-left text-[#808080] font-medium">
                  Name
                </TableHead>
                <TableHead className="px-6 text-left text-[#808080] font-medium">
                  State
                </TableHead>
                <TableHead className="px-6 text-left text-[#808080] font-medium">
                  Status
                </TableHead>
                <TableHead className="px-6 text-right text-[#808080] font-medium">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[#808080] hover:text-[#F15A24]"
                  >
                    Net Income
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((trainer) => (
                <TableRow
                  key={trainer.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <TableCell className="px-6">
                    <div className="flex items-center space-x-3">
                      {/* <Avatar className="h-10 w-10">
                        <AvatarImage src={trainer.avatar} alt={trainer.name} />
                        <AvatarFallback className="bg-[#F15A24] text-white">
                          {trainer.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar> */}
                      <span className="font-medium text-gray-900">
                        {trainer.full_name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-[#808080]">
                    {trainer.location ? trainer.location : "Location not found"}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {trainer.coach_type.length > 0 ? (
                      <>
                        {trainer.coach_type.map((item, index) => (
                          <Badge key={index} variant="secondary">
                            {item}
                          </Badge>
                        ))}
                      </>
                    ) : (
                      <span>No Sports Selected</span>
                    )}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-center">
                    {trainer.net_income}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrainersTable;
