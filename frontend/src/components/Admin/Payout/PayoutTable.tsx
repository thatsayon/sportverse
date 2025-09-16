"use client";
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { invoices } from "@/data/PayoutData";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Badge colors
const getStatusStyles = (status: string) => {
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

const PayoutTable: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState<"all" | "Complete" | "Pending" | "Cancelled">("all");
  const itemsPerPage = 10;

  // Filter logic
  const filteredInvoices =
    filter === "all" ? invoices : invoices.filter((inv) => inv.status === filter);

  // Pagination logic
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredInvoices.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-4 md:mb-8 flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-semibold font-montserrat">
          All Invoice History
        </h1>
        <Select value={filter} onValueChange={(value: any) => { setFilter(value); setCurrentPage(1); }}>
          <SelectTrigger className="text-[#F15A24] border-[#F15A24] w-[160px]">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="Complete">Complete</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="px-6 py-4">Invoice ID</TableHead>
              <TableHead className="px-6 py-4">Recement Name</TableHead>
              <TableHead className="px-6 py-4">Payment Type</TableHead>
              <TableHead className="px-6 py-4">Date</TableHead>
              <TableHead className="px-6 py-4">Amount</TableHead>
              <TableHead className="px-6 py-4">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((item) => (
              <TableRow key={item.invoiceId}>
                <TableCell className="px-6 py-4">{item.invoiceId}</TableCell>
                <TableCell className="px-6 py-4">{item.recementName}</TableCell>
                <TableCell className="px-6 py-4">{item.paymentType}</TableCell>
                <TableCell className="px-6 py-4">{item.date}</TableCell>
                <TableCell className="px-6 py-4">{item.amount}</TableCell>
                <TableCell className="px-6 py-4">
                  <Badge
                    variant="outline"
                    className={`${getStatusStyles(item.status)} border`}
                  >
                    {item.status}
                  </Badge>
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
            className="size-9"
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
                "size-9",
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
            className="size-9"
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

export default PayoutTable;
