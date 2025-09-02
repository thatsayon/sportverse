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
import { invoices } from "@/data/WithdrawData";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

// Badge colors for status
const getStatusStyles = (status: string) => {
  switch (status) {
    case "Accepted":
      return "bg-green-100 text-green-700 hover:bg-green-100 border-green-200";
    case "Rejected":
      return "bg-red-100 text-red-700 hover:bg-red-100 border-red-200";
    case "Pending":
      return "bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-yellow-200";
    default:
      return "bg-gray-100 text-gray-700 hover:bg-gray-100 border-gray-200";
  }
};

const WithdrawTable: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);
  const [newStatus, setNewStatus] = useState<string>("");

  const itemsPerPage = 10;

  // Filter data based on status
  const filteredData = filterStatus === "All"
    ? invoices
    : invoices.filter((invoice) => invoice.status === filterStatus);

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleStatusChange = (transition_Id: string, newStatus: string) => {
    // Set the selected invoice and new status, and show the confirmation dialog
    setSelectedInvoice(transition_Id);
    setNewStatus(newStatus);
  };

  const confirmStatusChange = () => {
    const updatedInvoices = invoices.map((invoice) =>
      invoice.transition_Id === selectedInvoice
        ? { ...invoice, status: newStatus }
        : invoice
    );
    // Update the invoices state or global state here with updatedInvoices
    setSelectedInvoice(null); // Reset selected invoice after confirmation
    setNewStatus(""); // Reset the status
  };

  return (
    <div className="w-full">
      <div className="mb-4 md:mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold font-montserrat">All Invoice History</h1>
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="text-[#F15A24] border-[#F15A24] w-[130px]">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="Accepted">Accepted</SelectItem>
            <SelectItem value="Rejected">Rejected</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="px-6 py-4">No</TableHead>
              <TableHead className="px-6 py-4">Trainer Name</TableHead>
              <TableHead className="px-6 py-4">Invoice ID</TableHead>
              <TableHead className="px-6 py-4">Location</TableHead>
              <TableHead className="px-6 py-4">Date</TableHead>
              <TableHead className="px-6 py-4">Amount</TableHead>
              <TableHead className="px-6 py-4">Status</TableHead>
              <TableHead className="px-6 py-4">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((item, index) => (
              <TableRow key={item.transition_Id}>
                <TableCell className="px-6 py-4">{index+1}</TableCell>
                <TableCell className="px-6 py-4">{item.trainer_name}</TableCell>
                <TableCell className="px-6 py-4">{item.transition_Id}</TableCell>
                <TableCell className="px-6 py-4">{item.location}</TableCell>
                <TableCell className="px-6 py-4">{item.date}</TableCell>
                <TableCell className="px-6 py-4">{item.amount}</TableCell>
                <TableCell className="px-6 py-4">
                  <Badge variant="outline" className={`${getStatusStyles(item.status)} border`}>
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <Select
                    value={item.status}
                    onValueChange={(newStatus) => handleStatusChange(item.transition_Id, newStatus)}
                  >
                    <SelectTrigger className="text-[#F15A24] border-[#F15A24] w-[130px]">
                      <SelectValue placeholder="Change Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Accepted">Accepted</SelectItem>
                      <SelectItem value="Rejected">Rejected</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
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

      {/* Confirmation Alert Dialog */}
      <AlertDialog open={!!selectedInvoice} onOpenChange={(open) => !open && setSelectedInvoice(null)}>
        <AlertDialogTrigger />
        <AlertDialogContent>
          <AlertDialogTitle>Confirm Status Change</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to change the status of this invoice to{" "}
            <span className="font-semibold">{newStatus}</span>?
          </AlertDialogDescription>
          <div className="flex justify-end gap-4 mt-4">
            <AlertDialogCancel onClick={() => setSelectedInvoice(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmStatusChange}>Confirm</AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default WithdrawTable;
