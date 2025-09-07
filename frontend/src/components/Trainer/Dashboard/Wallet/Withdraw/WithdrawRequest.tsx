"use client";

import React, { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';

// Static balance for now
const CURRENT_BALANCE = 1500;

// Validation schema
const withdrawSchema = z.object({
  walletType: z.enum(['card', 'paypal'], {
    required_error: "Please select a wallet type",
  }),
  amount: z.string()
    .min(1, "Amount is required")
    .refine((val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num > 0;
    }, "Amount must be a valid positive number")
    .refine((val) => {
      const num = parseFloat(val);
      return num <= CURRENT_BALANCE;
    }, `Amount cannot exceed current balance of $${CURRENT_BALANCE.toLocaleString()}`),
});

type WithdrawFormData = z.infer<typeof withdrawSchema>;

interface WithdrawRequestProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

function WithdrawRequest({ open, setOpen }: WithdrawRequestProps) {
  const form = useForm<WithdrawFormData>({
    resolver: zodResolver(withdrawSchema),
    defaultValues: {
      walletType: undefined,
      amount: "",
    },
  });

  const watchedAmount = form.watch("amount");

  // Calculate balances based on entered amount
  const balanceCalculations = useMemo(() => {
    const enteredAmount = parseFloat(watchedAmount) || 0;
    const withdrawBalance = Math.min(enteredAmount, CURRENT_BALANCE);
    const remainingBalance = Math.max(CURRENT_BALANCE - enteredAmount, 0);

    return {
      currentBalance: CURRENT_BALANCE,
      withdrawBalance,
      remainingBalance,
    };
  }, [watchedAmount]);

  const onSubmit = (data: WithdrawFormData) => {
    console.log('Withdraw Request:', {
      ...data,
      amount: parseFloat(data.amount),
      balances: balanceCalculations,
    });
    
    // Handle withdraw request submission here
    // Reset form and close dialog
    form.reset();
    setOpen(false);
  };

  const handleClose = () => {
    form.reset();
    setOpen(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader className="text-center pb-4">
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Withdraw
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Wallet Type Selection */}
            <FormField
              control={form.control}
              name="walletType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Wallet Type
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="py-6 w-full bg-gray-50 border-gray-200 focus:border-orange-500 focus:ring-orange-500">
                        <SelectValue placeholder="Select wallet type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="card">Card</SelectItem>
                      <SelectItem value="paypal">PayPal</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Amount Input */}
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
                      max={CURRENT_BALANCE}
                      step="0.01"
                      className="h-12 bg-gray-50 border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Balance Information */}
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
                  className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg"
                  disabled={!form.formState.isValid}
                >
                  Add request
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="w-full h-12 border-gray-200 text-gray-600 hover:bg-gray-50 font-medium rounded-lg"
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