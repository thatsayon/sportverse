"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Eye, EyeOff, CreditCard } from 'lucide-react';

// Credit Card validation schema
const creditCardSchema = z.object({
  cardHolderName: z.string().min(2, "Card holder name must be at least 2 characters"),
  cardNumber: z.string()
    .min(16, "Card number must be 16 digits")
    .max(19, "Card number is too long")
    .regex(/^[\d\s]+$/, "Card number can only contain digits and spaces"),
  password: z.string().min(4, "Password must be at least 4 characters"),
  expiryDate: z.string()
    .regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, "Please enter a valid expiry date (MM/YY)"),
  cvv: z.string()
    .min(3, "CVV must be 3 digits")
    .max(4, "CVV must be 3-4 digits")
    .regex(/^\d+$/, "CVV can only contain digits"),
});

// PayPal validation schema
const paypalSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  country: z.string().min(2, "Please enter your country"),
});

type CreditCardFormData = z.infer<typeof creditCardSchema>;
type PayPalFormData = z.infer<typeof paypalSchema>;

const AddWallet = () => {
  const [activeTab, setActiveTab] = useState("creditcard");
  const [showPassword, setShowPassword] = useState(false);

  // Credit Card form
  const creditCardForm = useForm<CreditCardFormData>({
    resolver: zodResolver(creditCardSchema),
    defaultValues: {
      cardHolderName: "",
      cardNumber: "",
      password: "",
      expiryDate: "",
      cvv: "",
    },
  });

  // PayPal form
  const paypalForm = useForm<PayPalFormData>({
    resolver: zodResolver(paypalSchema),
    defaultValues: {
      fullName: "",
      email: "",
      country: "",
    },
  });

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  // Format expiry date
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\D/g, '');
    if (v.length >= 3) {
      return `${v.slice(0, 2)}/${v.slice(2, 4)}`;
    }
    return v;
  };

  const onSubmitCreditCard = (data: CreditCardFormData) => {
    console.log('Credit Card Data:', data);
    // Handle credit card submission
  };

  const onSubmitPayPal = (data: PayPalFormData) => {
    console.log('PayPal Data:', data);
    // Handle PayPal submission
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <Card className="bg-white border-none shadow-none">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900 font-montserrat">
            {activeTab === "creditcard" ? "Card Details" : "Paypal Details"}
            <p className='text-base text-gray-300 font-normal mt-2'>Add you payment details for easy withdraw request</p>
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid max-w-lg mx-auto grid-cols-2 mb-8 bg-white h-24 p-2 rounded-lg">
              <TabsTrigger 
                value="creditcard" 
                className="flex items-center gap-2 px-6 py-3 rounded-md data-[state=active]:bg-orange-50 data-[state=active]:text-orange-600 data-[state=active]:border data-[state=active]:border-orange-200"
              >
                <CreditCard className="h-4 w-4" />
                Credit Card
              </TabsTrigger>
              <TabsTrigger 
                value="paypal" 
                className="flex items-center gap-2 px-6 py-3 rounded-md data-[state=active]:bg-orange-50 data-[state=active]:text-orange-600 data-[state=active]:border data-[state=active]:border-orange-200"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.25-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106h4.606a.641.641 0 0 0 .633-.74l.744-4.717c.082-.518.526-.9 1.05-.9h1.513c3.752 0 6.686-1.525 7.54-5.933.362-1.864.125-3.424-.931-4.222z"/>
                </svg>
                PayPal
              </TabsTrigger>
            </TabsList>

            <TabsContent value="creditcard" className="space-y-6">
              <Form {...creditCardForm}>
                <form onSubmit={creditCardForm.handleSubmit(onSubmitCreditCard)} className="space-y-6">
                  <FormField
                    control={creditCardForm.control}
                    name="cardHolderName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          Card holder name
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="John Doe" 
                            {...field}
                            className="h-12 bg-gray-50 border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={creditCardForm.control}
                    name="cardNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          Card Number
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="1234 5678 9012 3456" 
                            {...field}
                            onChange={(e) => {
                              const formatted = formatCardNumber(e.target.value);
                              field.onChange(formatted);
                            }}
                            maxLength={19}
                            className="h-12 bg-gray-50 border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={creditCardForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          Password
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter password"
                              {...field}
                              className="h-12 bg-gray-50 border-gray-200 focus:border-orange-500 focus:ring-orange-500 pr-12"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4 text-gray-400" />
                              ) : (
                                <Eye className="h-4 w-4 text-gray-400" />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={creditCardForm.control}
                      name="expiryDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">
                            Expiry Date
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="MM/YY" 
                              {...field}
                              onChange={(e) => {
                                const formatted = formatExpiryDate(e.target.value);
                                field.onChange(formatted);
                              }}
                              maxLength={5}
                              className="h-12 bg-gray-50 border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={creditCardForm.control}
                      name="cvv"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">
                            CVV
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="123" 
                              {...field}
                              maxLength={4}
                              className="h-12 bg-gray-50 border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg mt-8"
                  >
                    Add wallet
                  </Button>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="paypal" className="space-y-6">
              <Form {...paypalForm}>
                <form onSubmit={paypalForm.handleSubmit(onSubmitPayPal)} className="space-y-6">
                  <FormField
                    control={paypalForm.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          Full name
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="John Doe" 
                            {...field}
                            className="h-12 bg-gray-50 border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={paypalForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">
                            Email
                          </FormLabel>
                          <FormControl>
                            <Input 
                              type="email"
                              placeholder="john@example.com" 
                              {...field}
                              className="h-12 bg-gray-50 border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={paypalForm.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">
                            Country
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="United States" 
                              {...field}
                              className="h-12 bg-gray-50 border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg mt-8"
                  >
                    Add wallet
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