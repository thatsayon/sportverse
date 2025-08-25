"use client";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit2, Trash2 } from "lucide-react";
import { useAppSelector } from "@/store/hooks/hooks";
import { RootState } from "@/store/store";

// Type definitions for better TypeScript support
interface Manager {
  id: string;
  name: string;
  avatar: string;
  idNo: number;
  sport: string;
  state: string;
  status: "Complete" | "Cancelled" | "Pending";
  studentName: string;
  studentPhoto: string;
}

// Dummy data matching the image
const managersData: Manager[] = [
  {
    id: "1",
    name: "Corina McCoy",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150",
    idNo: 123456,
    sport: "Football",
    state: "North Carolina",
    status: "Complete",
    studentName: "John Doe", // New property
    studentPhoto:
      "https://images.unsplash.com/photo-1524749295432-0f2c72e89dbf?w=150", // New property
  },
  {
    id: "2",
    name: "Autumn Phillips",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    idNo: 258963,
    sport: "Football",
    state: "South Carolina",
    status: "Complete",
    studentName: "Jane Smith", // New property
    studentPhoto:
      "https://images.unsplash.com/photo-1516732427-9e255f7b6a92?w=150", // New property
  },
  {
    id: "3",
    name: "Kurt Bates",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
    idNo: 357951,
    sport: "Football",
    state: "Georgia",
    status: "Complete",
    studentName: "Ethan Brown", // New property
    studentPhoto:
      "https://images.unsplash.com/photo-1505697229744-6ed04b6a7983?w=150", // New property
  },
  {
    id: "4",
    name: "Dennis Callis",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150",
    idNo: 789321,
    sport: "Football",
    state: "Tennessee",
    status: "Cancelled",
    studentName: "Liam Johnson", // New property
    studentPhoto:
      "https://images.unsplash.com/photo-1516309928240-cafec7fdd07b?w=150", // New property
  },
  {
    id: "5",
    name: "Corina McCoy",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150",
    idNo: 546978,
    sport: "Basketball",
    state: "Virginia",
    status: "Pending",
    studentName: "Olivia Garcia", // New property
    studentPhoto:
      "https://images.unsplash.com/photo-1499917398990-d724e1f12216?w=150", // New property
  },
  {
    id: "6",
    name: "Dennis Callis",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150",
    idNo: 256314,
    sport: "Basketball",
    state: "Kentucky",
    status: "Complete",
    studentName: "Lucas Martinez", // New property
    studentPhoto:
      "https://images.unsplash.com/photo-1504249277655-dad80ed47fa6?w=150", // New property
  },
  {
    id: "7",
    name: "Frances Swann",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
    idNo: 789621,
    sport: "Basketball",
    state: "Alabama",
    status: "Cancelled",
    studentName: "Sophia Robinson", // New property
    studentPhoto:
      "https://images.unsplash.com/photo-1463598434944-315cfb5fd9b2?w=150", // New property
  },
  {
    id: "8",
    name: "Stephanie Sharkey",
    avatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150",
    idNo: 369841,
    sport: "Football",
    state: "West Virginia",
    status: "Pending",
    studentName: "Mason Lee", // New property
    studentPhoto:
      "https://images.unsplash.com/photo-1509714400243-d29f1907b89f?w=150", // New property
  },
  {
    id: "9",
    name: "John Dukes",
    avatar:
      "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=150",
    idNo: 369841,
    sport: "Basketball",
    state: "Florida",
    status: "Pending",
    studentName: "Amelia White", // New property
    studentPhoto:
      "https://images.unsplash.com/photo-1519300702328-31feef1e1f80?w=150", // New property
  },
  {
    id: "10",
    name: "Joshua Jones",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150",
    idNo: 369841,
    sport: "Football",
    state: "West Virginia",
    status: "Pending",
    studentName: "Isabella Harris", // New property
    studentPhoto:
      "https://images.unsplash.com/photo-1518301138939-cde8d4a5ec8a?w=150", // New property
  },
  {
    id: "11",
    name: "Daniel Hamilton",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    idNo: 369841,
    sport: "Basketball",
    state: "Florida",
    status: "Pending",
    studentName: "Elijah Walker", // New property
    studentPhoto:
      "https://images.unsplash.com/photo-1517707602217-3e21e4ff2ba4?w=150", // New property
  },
  {
    id: "12",
    name: "Michael Roberts",
    avatar:
      "https://images.unsplash.com/photo-1502081510177-717b156b7aeb?w=150",
    idNo: 478291,
    sport: "Basketball",
    state: "California",
    status: "Pending",
    studentName: "Ava Cooper", // New property
    studentPhoto:
      "https://images.unsplash.com/photo-1502081510177-717b156b7aeb?w=150", // New property
  },
];

// Helper function to get status badge variant and styles
const getStatusStyles = (status: Manager["status"]) => {
  switch (status) {
    case "Complete":
      return "bg-green-100 text-green-700 hover:bg-green-100 border-green-200";
    case "Cancelled":
      return "bg-red-100 text-red-700 hover:bg-red-100 border-red-200";
    case "Pending":
      return "bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-yellow-200";
    default:
      return "bg-gray-100 text-gray-700 hover:bg-gray-100 border-gray-200";
  }
};

// Helper function to generate initials from name
const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase();
};

const BookingTable: React.FC = () => {
  const handleEdit = (id: string) => {
    console.log(`Edit manager with ID: ${id}`);
    // Implement edit functionality
  };

  const handleDelete = (id: string) => {
    console.log(`Delete manager with ID: ${id}`);
    // Implement delete functionality
  };

  const {value} = useAppSelector((state: RootState)=> state.state )
  console.log("The value:",value)

  return (
    <div className="w-full">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-medium text-gray-500">
                Coach name
              </TableHead>
              <TableHead className="font-medium text-gray-500">
                Student name
              </TableHead>
              <TableHead className="font-medium text-gray-500">ID No</TableHead>
              <TableHead className="font-medium text-gray-500">
                Sports
              </TableHead>
              <TableHead className="font-medium text-gray-500">
                State name
              </TableHead>
              <TableHead className="font-medium text-gray-500">
                Status
              </TableHead>
              <TableHead className="font-medium text-gray-500">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {managersData.map((manager) => (
              <TableRow key={manager.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={manager.avatar} alt={manager.name} />
                      <AvatarFallback className="bg-gray-200 text-gray-600 text-xs">
                        {getInitials(manager.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-gray-900">{manager.name}</span>
                  </div>
                </TableCell>
                <TableCell className="font-medium">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={manager.studentPhoto}
                        alt={manager.studentName}
                      />
                      <AvatarFallback className="bg-gray-200 text-gray-600 text-xs">
                        {getInitials(manager.studentName)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-gray-900">{manager.studentName}</span>
                  </div>
                </TableCell>
                <TableCell className="text-gray-600">{manager.idNo}</TableCell>
                <TableCell className="text-gray-600">{manager.sport}</TableCell>
                <TableCell className="text-gray-600">{manager.state}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={`${getStatusStyles(
                      manager.status
                    )} border font-medium`}
                  >
                    {manager.status}
                  </Badge>
                </TableCell>

                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(manager.id)}
                      className="h-8 w-8 p-0 hover:bg-gray-100"
                    >
                      <Edit2 className="h-4 w-4 text-gray-500" />
                      <span className="sr-only">Edit manager</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(manager.id)}
                      className="h-8 w-8 p-0 hover:bg-gray-100"
                    >
                      <Trash2 className="h-4 w-4 text-gray-500" />
                      <span className="sr-only">Delete manager</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default BookingTable;
