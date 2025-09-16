import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { BookedSession } from "@/types/teacher/dashboard";
import { useRouter } from "next/navigation";
import { useLazyGetGeneratedTokenQuery } from "@/store/Slices/apiSlices/trainerApiSlice";
import { useDispatch } from "react-redux";
import { setCallConfig } from "@/store/Slices/stateSlices/studentSlice";

interface CurrentReservationsProps {
  reservations: BookedSession[];
  onViewAll: () => void;
}

export const CurrentReservations: React.FC<CurrentReservationsProps> = ({
  reservations,
  onViewAll,
}) => {
  const [getToken] = useLazyGetGeneratedTokenQuery();
  const router = useRouter();
  const dispatch = useDispatch();
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-50 text-green-700 border-green-200";
      case "Ongoing":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Upcoming":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getSessionTypeVariant = (sessionType: string) => {
    switch (sessionType) {
      case "virtual":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case ",mindset":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "in-Person":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const handleRouting = async (id: string) => {
    console.log("clicked on handle")
    const response = await getToken(id).unwrap();
    if (response.token) {
      dispatch(setCallConfig(response))
      router.push("/video");
    }
  };
  return (
    <Card className="bg-white border border-gray-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-semibold">
          Current Bookings
        </CardTitle>
        <Link href={"/dashboard/trainer-bookings"}>
          <Button
            variant="ghost"
            size="sm"
            onClick={onViewAll}
            className="text-gray-600 hover:text-gray-900"
          >
            View all
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">No</TableHead>
              <TableHead>Student Name</TableHead>
              <TableHead>Session Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reservations.map((reservation, index) => (
              <TableRow key={reservation.id} className="hover:bg-gray-50">
                <TableCell className="font-medium text-gray-600">
                  {String(index + 1).padStart(2, "0")}
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-gray-900">
                      {reservation.student_name}
                    </span>
                  </div>
                </TableCell>

                <TableCell>
                  <Badge
                    variant="outline"
                    className={getSessionTypeVariant(reservation.session_type)}
                  >
                    {reservation.session_type}
                  </Badge>
                </TableCell>

                <TableCell>
                  <Badge
                    variant="outline"
                    className={getStatusVariant(reservation.status)}
                  >
                    {reservation.status === "Upcoming" && "Up Coming"}
                    {reservation.status === "Completed" && "Completed"}
                    {reservation.status === "Ongoing" && "On Going"}
                  </Badge>
                </TableCell>

                <TableCell className="text-right">
                  <Button
                    size="sm"
                    variant={
                      reservation.status === "Ongoing" ? "default" : "ghost"
                    }
                    onClick={()=> handleRouting(reservation.id)}
                    disabled={reservation.status !== "Ongoing"}
                    // onClick={() => onEdit(reservation.id)}
                    className="py-2"
                  >
                    {reservation.status === "Ongoing"
                      ? "Join Session"
                      : `${reservation.status}`}
                  </Button>
                </TableCell>
              </TableRow>
            ))}

            {reservations.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-gray-500"
                >
                  No bookings found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
