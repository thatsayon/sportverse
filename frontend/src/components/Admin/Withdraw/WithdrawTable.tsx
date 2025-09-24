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
import { ChevronLeft, ChevronRight, Eye } from "lucide-react";
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
} from "@/components/ui/alert-dialog";
import {
  useGetWithdrawQuery,
  useLazyGetWithdrawDetailsQuery,
  useUpdateWithdrawMutation,
} from "@/store/Slices/apiSlices/adminApiSlice";
import Loading from "@/components/Element/Loading";
import ErrorLoadingPage from "@/components/Element/ErrorLoadingPage";
import { toast } from "sonner";
import { WithdrawDetailsResponse } from "@/types/admin/withdraw";

// Badge colors for status
const getStatusStyles = (status: string) => {
  switch (status.toLowerCase()) {
    case "approved":
    case "accepted":
      return "bg-green-100 text-green-700 hover:bg-green-100 border-green-200";
    case "rejected":
      return "bg-red-100 text-red-700 hover:bg-red-100 border-red-200";
    case "pending":
      return "bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-yellow-200";
    default:
      return "bg-gray-100 text-gray-700 hover:bg-gray-100 border-gray-200";
  }
};

// Helper function to format wallet type
const getWalletTypeDisplay = (type: string) => {
  switch (type) {
    case "bank":
      return "Bank Account";
    case "paypal":
      return "PayPal";
    case "crypto":
      return "Cryptocurrency";
    default:
      return type.charAt(0).toUpperCase() + type.slice(1);
  }
};

const WithdrawTable: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [selectedInvoice, setSelectedInvoice] = useState<string>("");
  const [withdrawDetails, setWithdrawDetails] = useState<WithdrawDetailsResponse | null>(null);
  const [newStatus, setNewStatus] = useState<"approved" | "pending" | "rejected" | "">("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data, isLoading, isError } = useGetWithdrawQuery();
  const [getWithdrawDetails, { isLoading: loadingDetails }] = useLazyGetWithdrawDetailsQuery();
  const [updateWithdraw, { isLoading: loadingUpdate }] = useUpdateWithdrawMutation();
  
  const itemsPerPage = 10;

  if (isLoading) return <Loading />;
  if (isError) return <ErrorLoadingPage />;

  const invoices = data?.results || [];

  // Filter data based on status
  const filteredData =
    filterStatus === "All"
      ? invoices
      : invoices.filter((invoice) => invoice.status.toLowerCase() === filterStatus.toLowerCase());

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

  const handleViewDetails = async (id: string) => {
    try {
      setSelectedInvoice(id);
      setIsDialogOpen(true);
      const response = await getWithdrawDetails(id).unwrap();
      setWithdrawDetails(response);
      setNewStatus(response.status as "approved" | "pending" | "rejected");
    } catch (error) {
      toast.error("Failed to load withdrawal details");
      setIsDialogOpen(false);
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedInvoice("");
    setWithdrawDetails(null);
    setNewStatus("");
  };

  const confirmStatusChange = async () => {
    if (!newStatus || !selectedInvoice) return;

    try {
      const response = await updateWithdraw({
        id: selectedInvoice,
        status: newStatus,
      }).unwrap();
      
      if (response.msg) {
        toast.success("Status updated successfully");
        handleCloseDialog();
      } else {
        toast.error("Error while updating status");
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const isConfirmEnabled = newStatus && newStatus !== withdrawDetails?.status;

  return (
    <div className="w-full">
      <div className="mb-4 md:mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold font-montserrat">
            All Invoice History
          </h1>
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="text-[#F15A24] border-[#F15A24] w-[130px]">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
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
              <TableRow key={index}>
                <TableCell className="px-6 py-4">{startIndex + index + 1}</TableCell>
                <TableCell className="px-6 py-4">{item.teacher_name}</TableCell>
                <TableCell className="px-6 py-4">{item.transaction_id}</TableCell>
                <TableCell className="px-6 py-4">{item.location}</TableCell>
                <TableCell className="px-6 py-4">{item.date}</TableCell>
                <TableCell className="px-6 py-4">${item.amount}</TableCell>
                <TableCell className="px-6 py-4">
                  <Badge
                    variant="outline"
                    className={`${getStatusStyles(item.status)} border`}
                  >
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDetails(item.id)}
                    className="flex items-center gap-1 text-[#F15A24] border-[#F15A24] hover:bg-[#F15A24] hover:text-white"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-end mt-4 md:mt-8">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="size-9"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

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

      {/* Withdrawal Details Dialog */}
      <AlertDialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <AlertDialogContent className="max-w-2xl">
          <AlertDialogTitle>Withdrawal Details</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-4">
              {loadingDetails ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F15A24]"></div>
                </div>
              ) : withdrawDetails ? (
                <>
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Teacher Name</label>
                      <p className="text-sm text-gray-900">{withdrawDetails.teacher_name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Transaction ID</label>
                      <p className="text-sm text-gray-900">{withdrawDetails.transaction_id}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Amount</label>
                      <p className="text-sm text-gray-900">${withdrawDetails.amount}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Remaining Amount</label>
                      <p className="text-sm text-gray-900">${withdrawDetails.left_amount}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Date</label>
                      <p className="text-sm text-gray-900">{withdrawDetails.date}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Wallet Type</label>
                      <p className="text-sm text-gray-900">{getWalletTypeDisplay(withdrawDetails.wallet_type)}</p>
                    </div>
                  </div>

                  {/* Current Status */}
                  <div>
                    <label className="text-sm font-medium text-gray-600">Current Status</label>
                    <div className="mt-1">
                      <Badge
                        variant="outline"
                        className={`${getStatusStyles(withdrawDetails.status)} border`}
                      >
                        {withdrawDetails.status}
                      </Badge>
                    </div>
                  </div>

                  {/* Wallet Information */}
                  {withdrawDetails.wallet_info && (
                    <div className="border-t pt-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Wallet Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-medium text-gray-600">Full Name</label>
                          <p className="text-sm text-gray-900">{withdrawDetails.wallet_info.full_name}</p>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-600">Bank Name</label>
                          <p className="text-sm text-gray-900">{withdrawDetails.wallet_info.bank_name}</p>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-600">Account Number</label>
                          <p className="text-sm text-gray-900">{withdrawDetails.wallet_info.bank_acc_num}</p>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-600">Routing Number</label>
                          <p className="text-sm text-gray-900">{withdrawDetails.wallet_info.bank_routing_num}</p>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-600">Account Type</label>
                          <p className="text-sm text-gray-900">
                            {withdrawDetails.wallet_info.account_type.join(", ")}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Status Update Section */}
                  <div className="border-t pt-4">
                    <label className="text-sm font-medium text-gray-900 mb-2 block">
                      Update Status
                    </label>
                    <Select 
                      value={newStatus} 
                      onValueChange={(value: "approved" | "pending" | "rejected") => setNewStatus(value)}
                    >
                      <SelectTrigger className="text-[#F15A24] border-[#F15A24] w-full">
                        <SelectValue placeholder="Select new status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              ) : (
                <p className="text-center text-gray-500 py-4">Failed to load withdrawal details</p>
              )}
            </div>
          </AlertDialogDescription>
          <div className="flex justify-end gap-4 mt-6">
            <AlertDialogCancel onClick={handleCloseDialog}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmStatusChange}
              disabled={!isConfirmEnabled || loadingUpdate || loadingDetails}
              className={cn(
                !isConfirmEnabled && "opacity-50 cursor-not-allowed"
              )}
            >
              {loadingUpdate ? "Updating..." : "Confirm"}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default WithdrawTable;