"use client";
import React, { ReactNode, useState } from "react";
import { Mail, Calendar, Clock } from "lucide-react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import BookingPage from "./BookingPage";
import Link from "next/link";
import ManageSubscriptionPopUp from "../Element/ManageSubscriptionPopUp";

interface StatCard {
  id: number;
  value: string | number;
  label: string;
  icon: ReactNode;
  bgColor: string;
}

const stats: StatCard[] = [
  {
    id: 1,
    value: 47,
    label: "Training Sessions",
    icon: <Calendar className="w-6 h-6 text-blue-600" />,
    bgColor: "bg-blue-100",
  },
  {
    id: 2,
    value: 8,
    label: "Coaches Booked",
    icon: (
      <svg
        className="w-6 h-6 text-green-600"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 4.5C14.4 4.2 13.6 4.2 13 4.5L7 7V9H21ZM21 10H3V15H21V10Z" />
      </svg>
    ),
    bgColor: "bg-green-100",
  },
  {
    id: 3,
    value: 156,
    label: "Hours Trained",
    icon: <Clock className="w-6 h-6 text-purple-600" />,
    bgColor: "bg-purple-100",
  },
];

const Profile = () => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <div className=" bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="px-0 md:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              My Profile
            </h1>
            <p className="text-gray-600">
              Manage your account details & preferences
            </p>
          </div>
          <Link href={"/student/profile/edit"}>
          <Button className="mt-4 sm:mt-0 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium">
            Update
          </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="relative inline-block mb-4">
                    <Avatar className="w-36 h-36">
                      <AvatarImage
                        src="/api/placeholder/120/120"
                        alt="Alex Johnson"
                      />
                      <AvatarFallback className="text-2xl font-semibold">
                        AJ
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <h2 className="text-3xl font-semibold text-gray-900 mb-1">
                    Alex Johnson
                  </h2>
                  <p className="text-gray-500 mb-4 text-lg">@alex.k2024</p>

                  <div className="flex items-center justify-center text-gray-600 mb-6">
                    <Mail className="w-4 h-4 mr-2" />
                    <span className="text-sm">alex.johnson@gmail.com</span>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-3">
                      Sport Interests
                    </h3>
                    <div className="flex flex-wrap gap-2 justify-center">
                      <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                        Football
                      </span>
                      <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                        Basketball
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Subscription Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-center">Subscriptions Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Current Plan</span>
                  <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Pro
                  </span>
                </div>

                <div className="flex justify-between items-center mb-10">
                  <span className="text-gray-600">Renewal Date</span>
                  <span className="text-gray-900 font-medium">
                    March 15, 2025
                  </span>
                </div>

                <Button 
                onClick={() => setOpen(true)}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                  Manage Subscription
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Main Content */}
          <div className="lg:col-span-2 space-y-4">
            {/* About Me */}
            <Card>
              <CardContent>
                <h3 className="text-xl font-semibold mb-2">About Me</h3>
                <p className="w-full text-gray-500">
                  Passionate about improving my athletic performance and mental
                  strength. Love connecting with coaches who can help me reach
                  my potential. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sed, reiciendis!
                </p>
              </CardContent>
            </Card>

            {/* Activity Overview - Individual Cards */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Activity Overview
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
                {/* Training Sessions Card */}
                {stats.map((stat) => (
                  <Card key={stat.id}>
                    <CardContent className="text-center">
                      <div
                        className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center mx-auto mb-3`}
                      >
                        {stat.icon}
                      </div>
                      <div className="text-2xl font-bold text-gray-900 mb-1">
                        {stat.value}
                      </div>
                      <div className="text-gray-600 text-sm">{stat.label}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div>
                <BookingPage sliceNumber={3} isHeader={false}/>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ManageSubscriptionPopUp open={open} setOpen={setOpen}/>
    </div>
  );
};

export default Profile;
