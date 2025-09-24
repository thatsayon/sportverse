"use client";

import React, { useMemo, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Building } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

// 👇 Country list package
import countryList from "react-select-country-list";
import {
  useCreateTrainerBankMutation,
  useCreateTrainerPaypalMutation,
  useGetTrainerBankQuery,
  useGetTrainerPaypalQuery,
  useUpdateTrainerBankMutation,
  useUpdateTrainerPaypalMutation,
} from "@/store/Slices/apiSlices/trainerApiSlice";
import {
  TrainerBankResponse,
  TrainerPaypalResponse,
  TrainerBankRequest,
  TrainerPaypalRequest,
} from "@/types/teacher/wallet";

// ✅ Bank validation schema
const bankSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  bankName: z.string().min(2, "Bank name must be at least 2 characters"),
  bankAccNum: z
    .number()
    .min(100000, "Account number must be at least 6 digits"),
  bankRoutingNum: z
    .number()
    .min(100, "Routing number must be at least 3 digits"),
  accountType: z.enum(["checking", "saving"]),
});

// ✅ PayPal schema
const paypalSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.email("Please enter a valid email address"),
  country: z.string().min(2, "Please select your country"),
});

type BankFormData = z.infer<typeof bankSchema>;
type PayPalFormData = z.infer<typeof paypalSchema>;

const AddWallet = () => {
  const [activeTab, setActiveTab] = React.useState("bank");
  const { data: bankData } = useGetTrainerBankQuery();
  const { data: paypalData } = useGetTrainerPaypalQuery();
  
  // new functions.
  const [createBank, { isLoading: isCreatingBank }] = useCreateTrainerBankMutation();
  const [updateBank, { isLoading: isUpdatingBank }] = useUpdateTrainerBankMutation();
  const [createPaypal, { isLoading: isCreatingPaypal }] = useCreateTrainerPaypalMutation();
  const [updatePaypal, { isLoading: isUpdatingPaypal }] = useUpdateTrainerPaypalMutation();

  // State to track if forms have been modified
  const [isBankModified, setIsBankModified] = useState(false);
  const [isPaypalModified, setIsPaypalModified] = useState(false);

  // Check if data exists (not an error response)
  const bankExists = bankData && !("detail" in bankData);
  const paypalExists = paypalData && !("detail" in paypalData);

  // ✅ Bank form
  const bankForm = useForm<BankFormData>({
    resolver: zodResolver(bankSchema),
    defaultValues: {
      fullName: "",
      bankName: "",
      bankAccNum: "" as unknown as number,
      bankRoutingNum: "" as unknown as number,
      accountType: undefined,
    },
  });

  // ✅ PayPal form
  const paypalForm = useForm<PayPalFormData>({
    resolver: zodResolver(paypalSchema),
    defaultValues: {
      fullName: "",
      email: "",
      country: "",
    },
  });

  // ✅ Get all countries once
  const countries = useMemo(() => countryList().getData(), []);

  // ✅ Helper function to find country by name (case-insensitive)
  const findCountryByName = (countryName: string) => {
    if (!countryName) return undefined;
    
    return countries.find(
      (country) => 
        country?.label?.toLowerCase() === countryName.toLowerCase()
    );
  };

  // ✅ Effect to populate bank form when data is available
  useEffect(() => {
    if (bankExists) {
      const bank = bankData as TrainerBankResponse;
      
      // ✅ Handle empty account_type array
      const accountType = bank.account_type && bank.account_type.length > 0 
        ? bank.account_type[0] as "checking" | "saving"
        : undefined;
      
      const formValues = {
        fullName: bank.full_name || "",
        bankName: bank.bank_name || "",
        bankAccNum: bank.bank_acc_num ? Number(bank.bank_acc_num) : "" as unknown as number,
        bankRoutingNum: bank.bank_routing_num ? Number(bank.bank_routing_num) : "" as unknown as number,
        accountType: accountType,
      };
      
      bankForm.reset(formValues);
      setIsBankModified(false); // Reset modification state
    } else {
      // Reset to empty values if no data exists
      bankForm.reset({
        fullName: "",
        bankName: "",
        bankAccNum: "" as unknown as number,
        bankRoutingNum: "" as unknown as number,
        accountType: undefined,
      });
      setIsBankModified(false);
    }
  }, [bankData, bankExists, bankForm]);

  // ✅ Effect to populate PayPal form when data is available
  useEffect(() => {
    if (paypalExists) {
      const paypal = paypalData as TrainerPaypalResponse;

      // Find the matching country to get the correct label
      const matchedCountry = findCountryByName(paypal.country);

      const formValues = {
        fullName: paypal.full_name || "",
        email: paypal.email || "",
        country: matchedCountry ? matchedCountry.label : paypal.country || "",
      };
      paypalForm.reset(formValues);
      setIsPaypalModified(false); // Reset modification state
    } else {
      // Reset to empty values if no data exists
      paypalForm.reset({
        fullName: "",
        email: "",
        country: "",
      });
      setIsPaypalModified(false);
    }
  }, [paypalData, paypalExists, paypalForm, countries]);

  const onSubmitBank = async (data: BankFormData) => {
    console.log("Bank data", bankExists);

    if (bankExists && !isBankModified) {
      toast.error("Please make changes to update your bank details.");
      return;
    }

    try {
      const bankPayload: TrainerBankRequest = {
        full_name: data.fullName,
        bank_name: data.bankName,
        bank_acc_num: data.bankAccNum,
        bank_routing_num: data.bankRoutingNum,
        account_type: [data.accountType],
      };

      if (bankExists) {
        // Update existing bank details
        await updateBank(bankPayload).unwrap();
        toast.success("Bank details updated successfully!");
      } else {
        // Create new bank details
        await createBank(bankPayload).unwrap();
        toast.success("Bank details added successfully!");
      }
      setIsBankModified(false);
    } catch (error: unknown) {
      const err = error as Error
      toast.error(err?.message || "Failed to save bank details");
    }
  };

  const onSubmitPayPal = async (data: PayPalFormData) => {
    if (paypalExists && !isPaypalModified) {
      toast.error("Please make changes to update your PayPal details.");
      return;
    }

    try {
      const paypalPayload: TrainerPaypalRequest = {
        full_name: data.fullName,
        email: data.email,
        country: data.country,
      };

      if (paypalExists) {
        // Update existing PayPal details
        await updatePaypal(paypalPayload).unwrap();
        toast.success("PayPal details updated successfully!");
      } else {
        // Create new PayPal details
        await createPaypal(paypalPayload).unwrap();
        toast.success("PayPal details added successfully!");
      }
      setIsPaypalModified(false);
    } catch (error) {
      const err = error as Error
      toast.error(err?.message || "Failed to save PayPal details");
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <Card className="bg-white border-none shadow-none">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900 font-montserrat">
            {activeTab === "bank" ? "Bank Details" : "Paypal Details"}
            <p className="text-base text-gray-300 font-normal mt-2">
              Add your payment details for easy withdraw request
            </p>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid max-w-lg mx-auto grid-cols-2 mb-8 bg-white h-24 p-2 rounded-lg">
              <TabsTrigger
                value="bank"
                className="flex items-center gap-2 px-6 py-3 rounded-md data-[state=active]:bg-orange-50 data-[state=active]:text-orange-600 data-[state=active]:border data-[state=active]:border-orange-200"
              >
                <Building className="h-4 w-4" />
                Bank
              </TabsTrigger>
              <TabsTrigger
                value="paypal"
                className="flex items-center gap-2 px-6 py-3 rounded-md data-[state=active]:bg-orange-50 data-[state=active]:text-orange-600 data-[state=active]:border data-[state=active]:border-orange-200"
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.25-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106h4.606a.641.641 0 0 0 .633-.74l.744-4.717c.082-.518.526-.9 1.05-.9h1.513c3.752 0 6.686-1.525 7.54-5.933.362-1.864.125-3.424-.931-4.222z" />
                </svg>
                PayPal
              </TabsTrigger>
            </TabsList>

            <TabsContent value="bank" className="space-y-6">
              <Form {...bankForm}>
                <form
                  onSubmit={bankForm.handleSubmit(onSubmitBank)}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between gap-5">
                    <FormField
                      control={bankForm.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Full name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="John Doe"
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                                setIsBankModified(true);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={bankForm.control}
                      name="bankName"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Bank name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Brac Bank"
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                                setIsBankModified(true);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex items-center justify-between gap-5">
                    <FormField
                      control={bankForm.control}
                      name="bankAccNum"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Bank account number</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="12345678"
                              {...field}
                              onChange={(e) => {
                                field.onChange(Number(e.target.value));
                                setIsBankModified(true);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={bankForm.control}
                      name="bankRoutingNum"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Bank routing number</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="123"
                              {...field}
                              onChange={(e) => {
                                field.onChange(Number(e.target.value));
                                setIsBankModified(true);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex items-center justify-between gap-5">
                    <FormField
                      control={bankForm.control}
                      name="accountType"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Account type</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={(value) => {
                                field.onChange(value);
                                setIsBankModified(true);
                              }}
                              value={field.value}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select account type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="checking">
                                  Checking
                                </SelectItem>
                                <SelectItem value="saving">Saving</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="w-full" />
                  </div>

                  <Button
                    type="submit"
                    disabled={
                      (bankExists && !isBankModified) || 
                      isCreatingBank || 
                      isUpdatingBank
                    }
                    className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg mt-8 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    {isCreatingBank || isUpdatingBank
                      ? "Processing..." 
                      : bankExists 
                        ? "Update wallet" 
                        : "Add wallet"
                    }
                  </Button>
                </form>
              </Form>
            </TabsContent>

            {/* ✅ Paypal Form with Country Select - FIXED */}
            <TabsContent value="paypal" className="space-y-6">
              <Form {...paypalForm}>
                <form
                  onSubmit={paypalForm.handleSubmit(onSubmitPayPal)}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between gap-5">
                    <FormField
                      control={paypalForm.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Full name</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="John Doe" 
                              {...field} 
                              onChange={(e) => {
                                field.onChange(e);
                                setIsPaypalModified(true);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={paypalForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="john@example.com"
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                                setIsPaypalModified(true);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* ✅ Fixed Country Dropdown */}
                  <FormField
                    control={paypalForm.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value);
                              setIsPaypalModified(true);
                            }}
                            value={field.value}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select a country" />
                            </SelectTrigger>
                            <SelectContent>
                              {countries.map((country) => (
                                <SelectItem
                                  key={country.value}
                                  value={country.label}
                                >
                                  {country.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={
                      (paypalExists && !isPaypalModified) || 
                      isCreatingPaypal || 
                      isUpdatingPaypal
                    }
                    className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg mt-8 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    {isCreatingPaypal || isUpdatingPaypal
                      ? "Processing..." 
                      : paypalExists 
                        ? "Update wallet" 
                        : "Add wallet"
                    }
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddWallet;