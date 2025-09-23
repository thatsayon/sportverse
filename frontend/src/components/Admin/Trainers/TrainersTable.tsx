"use client";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Dummy trainer data (you can import this from your data source)
// import { trainerData } from "@/data/TrainerData";
import { useGetTrainersQuery } from "@/store/Slices/apiSlices/adminApiSlice";
import Loading from "@/components/Element/Loading";
import ErrorLoadingPage from "@/components/Element/ErrorLoadingPage";

const TrainersTable: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filterSports, setFilterSports] = useState<string>("All");
  const { data, isLoading, isError } = useGetTrainersQuery();
  const itemsPerPage = 10;

  if (isLoading) return <Loading />;
  if (isError) return <ErrorLoadingPage />;

  const trainerData = data?.results || [];
  // Filter data based on sports
  const filteredData =
    filterSports === "All"
      ? trainerData
      : trainerData.filter((trainer) =>
          trainer.coach_type?.some(
            (sport) => sport.toLowerCase() === filterSports.toLowerCase()
          )
        );

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-4 md:mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold font-montserrat">
            All Trainer Data
          </h1>
        </div>
        <Select value={filterSports} onValueChange={setFilterSports}>
          <SelectTrigger className="text-[#F15A24] border-[#F15A24] w-[130px]">
            <SelectValue placeholder="Filter by Sport" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Sports</SelectItem>
            <SelectItem value="Football">Football</SelectItem>
            <SelectItem value="Basketball">Basketball</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="px-6 py-4">No</TableHead>
              <TableHead className="px-6 py-4">Name</TableHead>
              <TableHead className="px-6 py-4">Username</TableHead>
              <TableHead className="px-6 py-4">Location</TableHead>
              <TableHead className="px-6 py-4">Sports</TableHead>
              <TableHead className="px-6 py-4">Net Income</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((trainer, index) => (
              <TableRow key={trainer.id}>
                <TableCell className="px-6 py-4">{index + 1}</TableCell>
                <TableCell className="px-6 py-4">{trainer.full_name}</TableCell>
                <TableCell className="px-6 py-4">{trainer.username}</TableCell>
                <TableCell className="px-6 py-4">
                  {trainer.location
                    ? trainer.location
                    : "Location Not Selected"}
                </TableCell>
                <TableCell className="px-6 py-4">
                  {trainer.coach_type.length > 0
                    ? trainer.coach_type.join(", ")
                    : "No Sports Selected"}
                </TableCell>
                <TableCell className="px-6 py-4">
                  ${trainer.net_income}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-end mt-4 md:mt-8">
        <div className="flex items-center gap-2">
          {/* Prev */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* Page Numbers */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              className={cn(
                "w-10 h-10",
                currentPage === page
                  ? "bg-orange-500 text-white hover:bg-orange-600"
                  : ""
              )}
              onClick={() => goToPage(page)}
            >
              {page}
            </Button>
          ))}

          {/* Next */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TrainersTable;
