"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Toggle } from "@/components/ui/toggle";
import { X, Plus, Clock, Calendar } from "lucide-react";
import {
  useCreateSessionMutation,
  useGetSessionQuery,
  useUpdateSessionMutation,
  useDeleteSessionMutation,
  CreateSessionRequest,
  SessionResult,
} from "@/store/Slices/apiSlices/trainerApiSlice";
import SessionForm from "./SessionForm";

const sessionSchema = z.object({
  price: z.string().min(1, "Price is required"),
  close_before: z.string().min(1, "Close before time is required"),
  available_days: z.array(
    z.object({
      day: z.string(),
      time_slots: z.array(
        z.object({
          start_time: z.string(),
          end_time: z.string(),
        })
      ),
    })
  ),
});

type SessionFormData = z.infer<typeof sessionSchema>;

export const DAYS_OF_WEEK = [
  "Saturday",
  "Sunday", 
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
];

export const CLOSE_BEFORE_OPTIONS = [
  { label: "1 hour", value: "01:00:00" },
  { label: "2 hours", value: "02:00:00" },
  { label: "4 hours", value: "04:00:00" },
  { label: "8 hours", value: "08:00:00" },
  { label: "12 hours", value: "12:00:00" },
  { label: "1 day", value: "24:00:00" },
];

export const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(":");
  const hour12 = parseInt(hours) > 12 ? parseInt(hours) - 12 : parseInt(hours);
  const ampm = parseInt(hours) >= 12 ? "PM" : "AM";
  return `${hour12 === 0 ? 12 : hour12}:${minutes} ${ampm}`;
};

const addOneHour = (time: string): string => {
  const [hours, minutes] = time.split(":");
  const nextHour = (parseInt(hours) + 1) % 24;
  return `${nextHour.toString().padStart(2, "0")}:${minutes}`;
};

const SessionManagement: React.FC = () => {
  const [trainingType, setTrainingType] = useState<"virtual" | "in-person">("virtual");
  const [sessionType, setSessionType] = useState<"virtual" | "mindset" | "in-person">("virtual");
  const [timeSlots, setTimeSlots] = useState<Record<string, string[]>>({});
  const [editingSession, setEditingSession] = useState<SessionResult | null>(null);
  const [serviceEnabled, setServiceEnabled] = useState<Record<string, boolean>>({
    virtual: true,
    mindset: true,
    "in-person": true,
  });
  const [newTimeSlot, setNewTimeSlot] = useState<string>("");
  const [activeDay, setActiveDay] = useState<string>(""); // Track which day is active for adding time

  const { data: sessionsData } = useGetSessionQuery();
  const [createSession] = useCreateSessionMutation();
  const [updateSession] = useUpdateSessionMutation();
  const [deleteSession] = useDeleteSessionMutation();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<SessionFormData>({
    resolver: zodResolver(sessionSchema),
    defaultValues: {
      price: "",
      close_before: "01:00:00",
      available_days: [],
    },
  });

  const watchedCloseBeforeTime = watch("close_before");

  // Get days that actually have time slots (for display in time slots box)
  const daysWithTimeSlots = Object.keys(timeSlots).filter(day => timeSlots[day].length > 0);

  const handleTrainingTypeChange = (type: "virtual" | "in-person") => {
    setTrainingType(type);
    if (type === "virtual") {
      setSessionType("virtual");
    } else {
      setSessionType("in-person");
    }
    resetForm();
  };

  const handleServiceToggle = (sessionType: string, enabled: boolean) => {
    setServiceEnabled(prev => ({
      ...prev,
      [sessionType]: enabled,
    }));
    
    if (!enabled) {
      setTimeSlots({});
      setNewTimeSlot("");
      setActiveDay("");
      reset();
    }
  };

  // Modified to only set active day, not add to time slots
  const handleDayClick = (day: string) => {
    if (!serviceEnabled[sessionType]) return;
    
    const dayLower = day.toLowerCase();
    setActiveDay(dayLower);
    
    // Initialize empty array for this day if it doesn't exist
    if (!timeSlots[dayLower]) {
      setTimeSlots(prev => ({
        ...prev,
        [dayLower]: [],
      }));
    }
  };

  // Modified to add time slot to active day and ensure day appears in time slots box
  const addTimeSlot = (time: string) => {
    if (!time || !serviceEnabled[sessionType] || !activeDay) return;
    
    const endTime = addOneHour(time);
    const timeSlot = `${time}-${endTime}`;
    
    // Add to active day
    setTimeSlots(prev => ({
      ...prev,
      [activeDay]: [...(prev[activeDay] || []), timeSlot],
    }));
    
    // Clear the input
    setNewTimeSlot("");
  };

  const removeTimeSlot = (day: string, timeSlot: string) => {
    if (!serviceEnabled[sessionType]) return;
    
    const dayLower = day.toLowerCase();
    setTimeSlots(prev => {
      const newSlots = {
        ...prev,
        [dayLower]: prev[dayLower]?.filter(slot => slot !== timeSlot) || [],
      };
      
      // If day has no more time slots, remove it from the object
      if (newSlots[dayLower].length === 0) {
        delete newSlots[dayLower];
      }
      
      return newSlots;
    });
  };

  // Clear all time slots for a day (removes day from time slots box)
  const clearAllTimeSlotsForDay = (day: string) => {
    if (!serviceEnabled[sessionType]) return;
    
    const dayLower = day.toLowerCase();
    setTimeSlots(prev => {
      const newSlots = { ...prev };
      delete newSlots[dayLower];
      return newSlots;
    });
  };

  const resetForm = () => {
    reset();
    setTimeSlots({});
    setEditingSession(null);
    setNewTimeSlot("");
    setActiveDay("");
  };

  const onSubmit = async (data: SessionFormData) => {
    if (!serviceEnabled[sessionType]) return;
    
    try {
      const availableDays = daysWithTimeSlots.map(day => ({
        day,
        time_slots: (timeSlots[day] || []).map(slot => {
          const [start, end] = slot.split("-");
          return {
            start_time: `${start}:00`,
            end_time: `${end}:00`,
          };
        }),
      }));

      const sessionData: CreateSessionRequest = {
        training_type: sessionType,
        price: data.price,
        close_before: data.close_before,
        available_days: availableDays,
      };

      if (editingSession) {
        sessionData.id = editingSession.id;
        await updateSession(sessionData).unwrap();
      } else {
        await createSession(sessionData).unwrap();
      }

      resetForm();
    } catch (error) {
      console.error("Error saving session:", error);
    }
  };

  const isCurrentServiceEnabled = serviceEnabled[sessionType];

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Session Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Training Type Selection */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center space-x-2">
              <Button
                variant={trainingType === "virtual" ? "default" : "outline"}
                onClick={() => handleTrainingTypeChange("virtual")}
                className="flex-1 sm:flex-none"
              >
                Virtual Training
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant={trainingType === "in-person" ? "default" : "outline"}
                onClick={() => handleTrainingTypeChange("in-person")}
                className="flex-1 sm:flex-none"
              >
                In-person Training
              </Button>
            </div>
          </div>

          <Tabs value={trainingType} onValueChange={(value) => setTrainingType(value as "virtual" | "in-person")}>
            {/* Virtual Training Content */}
            <TabsContent value="virtual" className="space-y-6">
              <Tabs value={sessionType} onValueChange={(value) => setSessionType(value as "virtual" | "mindset")}>
                <TabsList className="grid w-full grid-cols-2 max-w-[222px]">
                  <TabsTrigger value="virtual">Virtual</TabsTrigger>
                  <TabsTrigger value="mindset">Mindset</TabsTrigger>
                </TabsList>

                <TabsContent value="virtual" className="space-y-4">
                  <SessionForm
                    sessionType="virtual"
                    register={register}
                    errors={errors}
                    daysWithTimeSlots={daysWithTimeSlots}
                    timeSlots={timeSlots}
                    onDayClick={handleDayClick}
                    onAddTimeSlot={addTimeSlot}
                    onRemoveTimeSlot={removeTimeSlot}
                    onClearAllTimeSlotsForDay={clearAllTimeSlotsForDay}
                    onSubmit={handleSubmit(onSubmit)}
                    watchedCloseBeforeTime={watchedCloseBeforeTime}
                    editingSession={editingSession}
                    onCancelEdit={resetForm}
                    serviceEnabled={isCurrentServiceEnabled}
                    onServiceToggle={(enabled) => handleServiceToggle("virtual", enabled)}
                    newTimeSlot={newTimeSlot}
                    setNewTimeSlot={setNewTimeSlot}
                    activeDay={activeDay}
                  />
                </TabsContent>

                <TabsContent value="mindset" className="space-y-4">
                  <SessionForm
                    sessionType="mindset"
                    register={register}
                    errors={errors}
                    daysWithTimeSlots={daysWithTimeSlots}
                    timeSlots={timeSlots}
                    onDayClick={handleDayClick}
                    onAddTimeSlot={addTimeSlot}
                    onRemoveTimeSlot={removeTimeSlot}
                    onClearAllTimeSlotsForDay={clearAllTimeSlotsForDay}
                    onSubmit={handleSubmit(onSubmit)}
                    watchedCloseBeforeTime={watchedCloseBeforeTime}
                    editingSession={editingSession}
                    onCancelEdit={resetForm}
                    serviceEnabled={serviceEnabled.mindset}
                    onServiceToggle={(enabled) => handleServiceToggle("mindset", enabled)}
                    newTimeSlot={newTimeSlot}
                    setNewTimeSlot={setNewTimeSlot}
                    activeDay={activeDay}
                  />
                </TabsContent>
              </Tabs>
            </TabsContent>

            {/* In-Person Training Content */}
            <TabsContent value="in-person" className="space-y-6">
              <Tabs value="in-person" onValueChange={() => setSessionType("in-person")}>
                <TabsList className="grid w-full grid-cols-1 max-w-[222px]">
                  <TabsTrigger value="in-person">In-person</TabsTrigger>
                </TabsList>

                <TabsContent value="in-person" className="space-y-4">
                  <SessionForm
                    sessionType="in-person"
                    register={register}
                    errors={errors}
                    daysWithTimeSlots={daysWithTimeSlots}
                    timeSlots={timeSlots}
                    onDayClick={handleDayClick}
                    onAddTimeSlot={addTimeSlot}
                    onRemoveTimeSlot={removeTimeSlot}
                    onClearAllTimeSlotsForDay={clearAllTimeSlotsForDay}
                    onSubmit={handleSubmit(onSubmit)}
                    watchedCloseBeforeTime={watchedCloseBeforeTime}
                    editingSession={editingSession}
                    onCancelEdit={resetForm}
                    serviceEnabled={serviceEnabled["in-person"]}
                    onServiceToggle={(enabled) => handleServiceToggle("in-person", enabled)}
                    newTimeSlot={newTimeSlot}
                    setNewTimeSlot={setNewTimeSlot}
                    activeDay={activeDay}
                  />
                </TabsContent>
              </Tabs>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default SessionManagement;