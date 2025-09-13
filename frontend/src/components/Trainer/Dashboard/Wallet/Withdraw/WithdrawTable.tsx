"use client";

import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Plus,
} from "lucide-react";
import WithdrawRequest from "./WithdrawRequest";

export interface InvoiceType {
  transaction_Id: string;      // updated typo from transition_Id
  walletType: "Card" | "Paypal";
  date: string;
  amount: string;
  leftAmount: string;
  status: string;
}


export const invoices: InvoiceType[] = [
  {
    transaction_Id: "TXN001",
    walletType: "Card",
    date: "2025-09-10",
    amount: "150.00",
    leftAmount: "50.00",
    status: "Pending",
  },
  {
    transaction_Id: "TXN002",
    walletType: "Paypal",
    date: "2025-09-08",
    amount: "200.00",
    leftAmount: "0.00",
    status: "Completed",
  },
  {
    transaction_Id: "TXN003",
    walletType: "Card",
    date: "2025-09-05",
    amount: "120.00",
    leftAmount: "20.00",
    status: "Pending",
  },
  {
    transaction_Id: "TXN004",
    walletType: "Paypal",
    date: "2025-09-03",
    amount: "180.00",
    leftAmount: "0.00",
    status: "Completed",
  },
  {
    transaction_Id: "TXN005",
    walletType: "Card",
    date: "2025-09-01",
    amount: "100.00",
    leftAmount: "100.00",
    status: "Pending",
  },
];


const ITEMS_PER_PAGE = 10;

const WithdrawTable = () => {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Filter data based on status
  const filteredData = useMemo(() => {
    if (statusFilter === "all") {
      return invoices;
    }
    return invoices.filter(
      (invoice) => invoice.status.toLowerCase() === statusFilter.toLowerCase()
    );
  }, [statusFilter]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentData = filteredData.slice(startIndex, endIndex);
  const [open, setOpen] = useState<boolean>(false)

  // Reset to first page when filter changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "accepted":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);
  const goToPreviousPage = () =>
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  const goToNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <div className="-mt-10">
        <WithdrawRequest open={open} setOpen={setOpen}/>
      <Card className="bg-white shadow-none border-none">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Withdraw History
            </CardTitle>

            {/* Status Filter */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                  Filter by Status:
                </label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40 h-9">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="accepted">Accepted</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
              
              onClick={()=> setOpen(true)}
              >
                <Plus/> Add Request 
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Table */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold py-2 text-gray-900 py-4 w-16">
                    No.
                  </TableHead>
                  <TableHead className="font-semibold py-2 text-gray-900">
                    Wallet Type
                  </TableHead>
                  <TableHead className="font-semibold py-2 text-gray-900">
                    Transition Type
                  </TableHead>
                  <TableHead className="font-semibold py-2 text-gray-900">
                    Date
                  </TableHead>
                  <TableHead className="font-semibold py-2 text-gray-900">
                    Amount
                  </TableHead>
                  <TableHead className="font-semibold py-2 text-gray-900">
                    Left Amount
                  </TableHead>
                  <TableHead className="font-semibold py-2 text-gray-900">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentData.length > 0 ? (
                  currentData.map((invoice, index) => (
                    <TableRow
                      key={invoice.transaction_Id}
                      className="hover:bg-gray-50"
                    >
                      <TableCell className="font-medium text-gray-600 py-4">
                        {startIndex + index + 1}
                      </TableCell>
                      <TableCell className="font-medium text-gray-900">
                        {invoice.walletType}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {invoice.transaction_Id}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {formatDate(invoice.date)}
                      </TableCell>
                      <TableCell className="font-semibold text-gray-900">
                        {invoice.amount}
                      </TableCell>
                      <TableCell className="font-semibold text-gray-900">
                        {invoice.leftAmount}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`${getStatusColor(
                            invoice.status
                          )} border font-medium`}
                        >
                          {invoice.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-8 text-gray-500"
                    >
                      No invoices found for the selected filter.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1} to{" "}
                {Math.min(endIndex, filteredData.length)} of{" "}
                {filteredData.length} results
              </div>

              <div className="flex items-center gap-2">
                {/* First Page */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToFirstPage}
                  disabled={currentPage === 1}
                  className="h-8 w-8 p-0"
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>

                {/* Previous Page */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className="h-8 w-8 p-0"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((page) => {
                      // Show current page, first page, last page, and pages around current
                      return (
                        page === 1 ||
                        page === totalPages ||
                        Math.abs(page - currentPage) <= 1
                      );
                    })
                    .map((page, index, array) => {
                      // Add ellipsis if there's a gap
                      const showEllipsis =
                        index > 0 && array[index - 1] < page - 1;
                      return (
                        <React.Fragment key={page}>
                          {showEllipsis && (
                            <span className="px-2 py-1 text-gray-400">...</span>
                          )}
                          <Button
                            variant={
                              currentPage === page ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => handlePageChange(page)}
                            className={`h-8 w-8 p-0 ${
                              currentPage === page
                                ? "bg-orange-500 hover:bg-orange-600 text-white"
                                : ""
                            }`}
                          >
                            {page}
                          </Button>
                        </React.Fragment>
                      );
                    })}
                </div>

                {/* Next Page */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className="h-8 w-8 p-0"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>

                {/* Last Page */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToLastPage}
                  disabled={currentPage === totalPages}
                  className="h-8 w-8 p-0"
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WithdrawTable;
