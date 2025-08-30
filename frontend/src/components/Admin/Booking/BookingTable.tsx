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
import { Manager, managersData } from "@/data/BookingData";

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
