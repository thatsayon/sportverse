"use client";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetBookingsQuery } from "@/store/Slices/apiSlices/adminApiSlice";
import { AdminBooking } from "@/types/admin/bookings";
import Loading from "@/components/Element/Loading";
import ErrorLoadingPage from "@/components/Element/ErrorLoadingPage";
import moment from "moment";

// Helper function to get status badge variant and styles
const getStatusStyles = (status: AdminBooking["status"]) => {
  switch (status) {
    case "complete":
      return "bg-green-100 text-green-700 hover:bg-green-100 border-green-200";
    case "ongoing":
      return "bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200";
    case "upcoming":
      return "bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-yellow-200";
    default:
      return "bg-gray-100 text-gray-700 hover:bg-gray-100 border-gray-200";
  }
};

const BookingTable: React.FC = () => {
  const [filterSports, setFilterSports] = useState<string>("All");
  const {data, isLoading, isError} = useGetBookingsQuery()

  const managersData = data?.results || []
  if(isLoading) return <Loading/>
  if(isError) return <ErrorLoadingPage/>

  const filteredData = managersData.filter((trainee) => {
      const matchesSports =
        filterSports === "All" || trainee.status === filterSports;
     
      return matchesSports
    });;

  return (
    <div className="w-full">
      <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-semibold font-montserrat">
            All Booking History
          </h1>
          <Select value={filterSports} onValueChange={setFilterSports}>
            <SelectTrigger className="text-[#F15A24] border-[#F15A24] w-[130px]">
              <SelectValue placeholder="Filter by Sport" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">Status</SelectItem>
              <SelectItem value="complete">Complete</SelectItem>
              <SelectItem value="upcoming">Up Coming</SelectItem>
              <SelectItem value="ongoing">On Going</SelectItem>
            </SelectContent>
          </Select>
        </div>
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-medium text-gray-500">
                No.
              </TableHead>
              <TableHead className="font-medium text-gray-500">
                Trainer name
              </TableHead>
              <TableHead className="font-medium text-gray-500">
                Student name
              </TableHead>
              <TableHead className="font-medium text-gray-500">Price</TableHead>
              <TableHead className="font-medium text-gray-500">Date & Time</TableHead>
              <TableHead className="font-medium text-gray-500">
                Location
              </TableHead>
              <TableHead className="font-medium text-gray-500">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((manager, index) => (
              <TableRow key={manager.id}>
                <TableCell>
                {index+1}
                </TableCell>
                <TableCell className="font-medium">
                  <div className="flex items-center space-x-3">
                    {/* <Avatar className="h-8 w-8">
                      <AvatarImage src={manager.avatar} alt={manager.name} />
                      <AvatarFallback className="bg-gray-200 text-gray-600 text-xs">
                        {getInitials(manager.name)}
                      </AvatarFallback>
                    </Avatar> */}
                    <span className="text-gray-900">{manager.teacher_name}</span>
                  </div>
                </TableCell>
                <TableCell className="font-medium">
                  <div className="flex items-center space-x-3">
                    {/* <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={manager.studentPhoto}
                        alt={manager.studentName}
                      />
                      <AvatarFallback className="bg-gray-200 text-gray-600 text-xs">
                        {getInitials(manager.studentName)}
                      </AvatarFallback>
                    </Avatar> */}
                    <span className="text-gray-900">{manager.student_name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-gray-600">${manager.session_price}</TableCell>
                <TableCell className="text-gray-600">{moment(manager.session_time).format("MMM Do YY, h:mm a")}</TableCell>
                <TableCell className="text-gray-600">{manager.state_name}</TableCell>
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default BookingTable;
