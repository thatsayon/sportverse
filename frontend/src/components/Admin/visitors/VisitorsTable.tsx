"use client";
import React, { useState } from "react";
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
import { visitors, visitorType } from "@/data/Visitors";

// Status badge styling
const getStatusStyles = (status: visitorType["status"]) => {
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

const VisitorTable: React.FC = () => {
  const [editDialog, setEditDialog] = useState<boolean>(false);
  const handleEdit = (id: string) => {
    console.log(`Edit booking with ID: ${id}`);
    // Implement edit functionality
  };

  const handleDelete = (id: string) => {
    console.log(`Delete booking with ID: ${id}`);
    // Implement delete functionality
  };

  const { value } = useAppSelector((state: RootState) => state.state);
  console.log("Redux state value:", value);

  return (
    <div className="w-full">
      <div className="rounded-md border bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-medium text-gray-600">ID No</TableHead>
              <TableHead className="font-medium text-gray-600">Coach</TableHead>
              <TableHead className="font-medium text-gray-600">State Name</TableHead>
              <TableHead className="font-medium text-gray-600">Date</TableHead>
              <TableHead className="font-medium text-gray-600">
                Type
              </TableHead>
              <TableHead className="font-medium text-gray-600">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {visitors.map((visitor: visitorType) => (
              <TableRow key={visitor.id} className="hover:bg-gray-50">
                {/* ID */}
                <TableCell className="text-gray-700">{visitor.id}</TableCell>
                {/* Manager */}
                <TableCell className="font-medium text-gray-900">
                  {visitor.manager}
                </TableCell>

                {/* State */}
                <TableCell className="text-gray-700">{visitor.state}</TableCell>

                {/* Date */}
                <TableCell className="text-gray-700">{visitor.date}</TableCell>

                {/* Type */}
                <TableCell className="text-gray-700">{visitor.type}</TableCell>

                {/* Status */}
                <TableCell>
                  <Badge
                    variant="outline"
                    className={`${getStatusStyles(
                      visitor.status
                    )} border font-medium px-2 py-0.5 text-sm`}
                  >
                    {visitor.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default VisitorTable;
