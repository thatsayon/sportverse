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

interface Trainer {
  id: string;
  name: string;
  state: string;
  status: "Confirmed" | "Pending" | "Reject";
  avatar?: string;
}

const trainersData: Trainer[] = [
  {
    id: "1",
    name: "Iva Ryan",
    state: "AL",
    status: "Confirmed",
    avatar: "/avatars/iva.jpg",
  },
  {
    id: "2",
    name: "Lorri Warf",
    state: "FL",
    status: "Confirmed",
    avatar: "/avatars/lorri.jpg",
  },
  {
    id: "3",
    name: "James Hall",
    state: "MD",
    status: "Confirmed",
    avatar: "/avatars/james.jpg",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Confirmed":
      return "bg-green-100 text-green-800 hover:bg-green-100";
    case "Pending":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
    case "Reject":
      return "bg-red-100 text-red-800 hover:bg-red-100";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100";
  }
};

const TrainersTable: React.FC = () => {
  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <div className="flex itec justify-between mb-4 px-4">
            <h3 className="text-xl font-semibold">Total trainers</h3>
            <Button
              variant="ghost"
              size="sm"
              className="text-[#808080] hover:text-[#F15A24]"
            >
              View all
            </Button>
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
                    Action
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trainersData.map((trainer) => (
                <TableRow
                  key={trainer.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <TableCell className="px-6">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={trainer.avatar} alt={trainer.name} />
                        <AvatarFallback className="bg-[#F15A24] text-white">
                          {trainer.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-gray-900">
                        {trainer.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-[#808080]">
                    {trainer.state}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <Badge
                      variant="secondary"
                      className={getStatusColor(trainer.status)}
                    >
                      {trainer.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-[#808080] hover:text-[#F15A24]"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
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
