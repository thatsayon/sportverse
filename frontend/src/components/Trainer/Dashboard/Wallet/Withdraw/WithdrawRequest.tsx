"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import {
  useCreateTrainerWithdrawRequestMutation,
} from "@/store/Slices/apiSlices/trainerApiSlice";
import { toast } from "sonner";

export interface TrainerWalletTransactionRequest {
  wallet_type: string;
  amount: number;
}

interface WithdrawRequestProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  currentBalance: number;
}

function WithdrawRequest({ open, setOpen, currentBalance }: WithdrawRequestProps) {
  const [createRequest, { isLoading }] =
    useCreateTrainerWithdrawRequestMutation();

  // Define schema inline each render (cheap, no need for memoization)
  const withdrawSchema = z.object({
    walletType: z.enum(["bank", "paypal"]),
    amount: z
      .string()
      .min(1, "Amount is required")
      .refine((val) => {
        const num = parseFloat(val);
        return !isNaN(num) && num > 0;
      }, "Amount must be a valid positive number")
      .refine((val) => {
        const num = parseFloat(val);
        return num <= currentBalance;
      }, `Amount cannot exceed current balance of ${currentBalance.toLocaleString()}`),
  });

  type WithdrawFormData = z.infer<typeof withdrawSchema>;

  const form = useForm<WithdrawFormData>({
    resolver: zodResolver(withdrawSchema),
    defaultValues: {
      walletType: undefined,
      amount: "",
    },
  });

  const watchedAmount = form.watch("amount");

  // Just compute directly
  const enteredAmount = parseFloat(watchedAmount) || 0;
  const withdrawBalance = Math.min(enteredAmount, currentBalance);
  const remainingBalance = Math.max(currentBalance - enteredAmount, 0);

  const balanceCalculations = {
    currentBalance,
    withdrawBalance,
    remainingBalance,
  };

  const onSubmit = async (data: WithdrawFormData) => {
    try {
      const loadingToast = toast.loading("Processing withdrawal request...");

      const requestData: TrainerWalletTransactionRequest = {
        wallet_type: data.walletType,
        amount: parseFloat(data.amount),
      };

      const result = await createRequest(requestData).unwrap();
      toast.dismiss(loadingToast);

      toast.success("Withdrawal request created successfully!", {
        description: `Your request for $${parseFloat(
          data.amount
        ).toLocaleString()} has been submitted and is being processed.`,
        duration: 5000,
      });

      form.reset();
      setOpen(false);
    } catch (error: any) {
      toast.error("Failed to create withdrawal request", {
        description:
          error?.data?.message ||
          error?.message ||
          "An unexpected error occurred. Please try again.",
        duration: 5000,
      });
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      form.reset();
      setOpen(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Dialog open={open} onOpenChange={!isLoading ? setOpen : undefined}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader className="text-center pb-4">
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Withdraw
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="walletType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Wallet Type
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger className="py-6 w-full bg-gray-50 border-gray-200 focus:border-orange-500 focus:ring-orange-500">
                        <SelectValue placeholder="Select wallet type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="bank">Bank</SelectItem>
                      <SelectItem value="paypal">PayPal</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Amount
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter amount"
                      {...field}
                      min="0"
                      max={currentBalance}
                      step="0.01"
                      disabled={isLoading}
                      className="h-12 bg-gray-50 border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-3 py-4">
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">
                  Current Balance:
                </span>
                <span className="text-sm font-semibold text-gray-900">
                  {formatCurrency(balanceCalculations.currentBalance)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">
                  Withdraw Balance:
                </span>
                <span className="text-sm font-semibold text-orange-600">
                  {formatCurrency(balanceCalculations.withdrawBalance)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">
                  Remaining Balance:
                </span>
                <span className="text-sm font-semibold text-green-600">
                  {formatCurrency(balanceCalculations.remainingBalance)}
                </span>
              </div>
            </div>

            <DialogFooter className="pt-6">
              <div className="flex flex-col w-full gap-3">
                <Button
                  type="submit"
                  className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!form.formState.isValid || isLoading}
                >
                  {isLoading ? "Processing..." : "Add request"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isLoading}
                  className="w-full h-12 border-gray-200 text-gray-600 hover:bg-gray-50 font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default WithdrawRequest;
