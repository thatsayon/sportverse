"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

import SessionForm from "./SessionForm";
import { CreateSessionRequest, SessionResult, TimeCheckRequest, TimeSlot } from "@/types/teacher/session";
import { toast } from "sonner";
import { 
  useCreateSessionMutation, 
  useDeleteTimeSlotMutation, 
  useGetSessionQuery, 
  useTimeCheckMutation, 
  useUpdateSessionMutation 
} from "@/store/Slices/apiSlices/trainerApiSlice";

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
  const [trainingType, setTrainingType] = useState<"virtual" | "in_person">("virtual");
  const [sessionType, setSessionType] = useState<"virtual" | "mindset" | "in_person">("virtual");
  const [timeSlots, setTimeSlots] = useState<Record<string, TimeSlot[]>>({});
  const [editingSession, setEditingSession] = useState<SessionResult | null>(null);
  const [serviceEnabled, setServiceEnabled] = useState<Record<string, boolean>>({
    virtual: true,
    mindset: true,
    "in_person": true,
  });
  const [newTimeSlot, setNewTimeSlot] = useState<string>("");
  const [activeDay, setActiveDay] = useState<string>("");

  const { data: sessionsData, isLoading, refetch } = useGetSessionQuery();
  const [createSession] = useCreateSessionMutation();
  const [updateSession] = useUpdateSessionMutation();
  const [deleteTimeSlot] = useDeleteTimeSlotMutation();
  const [timeCheck] = useTimeCheckMutation();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
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

  // Get current sessions based on session type
  const currentSessions = sessionsData?.results?.filter(
    session => session.training_type === sessionType
  ) || [];

  // Get the existing session for current type (assuming only one session per type)
  const existingSession = currentSessions[0] || null;

  // Get days that actually have time slots (for display in time slots box)
  const daysWithTimeSlots = Object.keys(timeSlots).filter(day => timeSlots[day].length > 0);

  // Load existing session data into form when sessionType changes
  useEffect(() => {
    console.log("SessionsData:", sessionsData); // Debug log
    console.log("Current session type:", sessionType);
    console.log("Existing session:", existingSession);
    
    if (existingSession && !editingSession) {
      // Set form values
      setValue("price", existingSession.price);
      setValue("close_before", existingSession.close_before);
      
      // Convert existing session days to timeSlots format with proper TimeSlot structure
      const newTimeSlots: Record<string, TimeSlot[]> = {};
      
      // Handle both possible response structures: 'days' or 'available_days'
      const sessionDays = existingSession.available_days || existingSession.days || [];
      
      sessionDays.forEach(day => {
        const dayKey = day.day.toLowerCase();
        console.log(`Processing day: ${dayKey}`, day); // Debug log
        
        // The API response uses 'time_slots', not 'slots'
        const daySlots = day.time_slots || [];
        
        newTimeSlots[dayKey] = daySlots.map(slot => {
          console.log(`Processing slot:`, slot); // Debug log
          return {
            id: slot.id,
            start_time: slot.start_time.slice(0, 5), // Convert "HH:MM:SS" to "HH:MM"
            end_time: slot.end_time.slice(0, 5), // Convert "HH:MM:SS" to "HH:MM"
            isExisting: true, // Mark as existing slot
          };
        });
      });
      
      console.log("Converted time slots:", newTimeSlots); // Debug log
      setTimeSlots(newTimeSlots);
    } else if (!existingSession && !editingSession) {
      // Clear form when no existing session
      console.log("No existing session found, resetting form");
      resetForm();
    }
  }, [sessionType, existingSession, editingSession, setValue, sessionsData]);

  const handleTrainingTypeChange = (type: "virtual" | "in_person") => {
    setTrainingType(type);
    if (type === "virtual") {
      setSessionType("virtual");
    } else {
      setSessionType("in_person");
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

  const handleDayClick = (day: string) => {
    if (!serviceEnabled[sessionType]) return;
    
    const dayLower = day.toLowerCase();
    setActiveDay(dayLower);
    
    if (!timeSlots[dayLower]) {
      setTimeSlots(prev => ({
        ...prev,
        [dayLower]: [],
      }));
    }
  };

  const addTimeSlot = async (time: string) => {
    if (!time || !serviceEnabled[sessionType] || !activeDay) return;
    
    const endTime = addOneHour(time);
    
    // Check if this time slot already exists for this day
    const existingSlots = timeSlots[activeDay] || [];
    const isDuplicate = existingSlots.some(slot => 
      slot.start_time === time && slot.end_time === endTime
    );
    
    if (isDuplicate) {
      toast.error("This time slot already exists for the selected day");
      setNewTimeSlot("");
      return;
    }
    
    try {
      // Check time availability
      const timeCheckData: TimeCheckRequest = {
        day: activeDay,
        start_time: `${time}:00`,
        end_time: `${endTime}:00`,
        session_id: existingSession?.id, // Include session ID if updating existing session
      };
      
      const response = await timeCheck(timeCheckData).unwrap();
      
      if (response.available) {
        // Add new time slot without ID (backend will assign ID)
        const newSlot: TimeSlot = {
          start_time: time,
          end_time: endTime,
          isExisting: false, // Mark as new slot
        };
        
        setTimeSlots(prev => ({
          ...prev,
          [activeDay]: [...(prev[activeDay] || []), newSlot],
        }));
        toast.success("Time slot added successfully");
      } else {
        toast.error(response.message || "This time slot is not available");
      }
    } catch (error) {
      const err = error as Error
      const errorMessage = err?.message || "Error checking time availability";
      toast.error(`${errorMessage}. Please try again.`);
      
      if (typeof window !== 'undefined' && window.console) {
        window.console.log("Time check error:", errorMessage);
      }
    }
    
    setNewTimeSlot("");
  };

  const removeTimeSlot = async (day: string, slotIndex: number) => {
    if (!serviceEnabled[sessionType]) return;
    
    const dayLower = day.toLowerCase();
    const slot = timeSlots[dayLower]?.[slotIndex];
    
    if (!slot) return;
    
    // If slot has an ID, it exists in the database and needs to be deleted via API
    if (slot.id) {
      try {
        await deleteTimeSlot({ slot_id: slot.id }).unwrap();
        toast.success("Time slot deleted successfully");
        
        // Remove from local state after successful API call
        setTimeSlots(prev => {
          const newSlots = {
            ...prev,
            [dayLower]: prev[dayLower]?.filter((_, index) => index !== slotIndex) || [],
          };
          
          if (newSlots[dayLower].length === 0) {
            delete newSlots[dayLower];
          }
          
          return newSlots;
        });
        
        // Refetch sessions to update the UI with latest data
        refetch();
      } catch (error) {
        const err = error as Error
        const errorMessage = err?.message || "Error deleting time slot";
        toast.error(`${errorMessage}. Please try again.`);
        
        if (typeof window !== 'undefined' && window.console) {
          window.console.log("Delete time slot error:", errorMessage);
        }
      }
    } else {
      // If no ID, it's a new slot that only exists locally
      setTimeSlots(prev => {
        const newSlots = {
          ...prev,
          [dayLower]: prev[dayLower]?.filter((_, index) => index !== slotIndex) || [],
        };
        
        if (newSlots[dayLower].length === 0) {
          delete newSlots[dayLower];
        }
        
        return newSlots;
      });
      toast.success("Time slot removed");
    }
  };

  const clearAllTimeSlotsForDay = async (day: string) => {
    if (!serviceEnabled[sessionType]) return;
    
    const dayLower = day.toLowerCase();
    const slotsForDay = timeSlots[dayLower] || [];
    
    // Separate existing slots (with IDs) and new slots (without IDs)
    const existingSlots = slotsForDay.filter(slot => slot.id);
    const newSlots = slotsForDay.filter(slot => !slot.id);
    
    try {
      // Delete existing slots via API
      if (existingSlots.length > 0) {
        await Promise.all(
          existingSlots.map(slot => 
            deleteTimeSlot({ slot_id: slot.id! }).unwrap()
          )
        );
        toast.success(`${existingSlots.length} existing time slot(s) deleted from database`);
      }
      
      // Remove all slots from local state
      setTimeSlots(prev => {
        const newSlots = { ...prev };
        delete newSlots[dayLower];
        return newSlots;
      });
      
      if (newSlots.length > 0) {
        toast.success(`${newSlots.length} pending time slot(s) removed locally`);
      }
      
      // Refetch sessions to update the UI
      if (existingSlots.length > 0) {
        refetch();
      }
    } catch (error) {
      const err = error as Error
      const errorMessage = err?.message || "Error clearing time slots";
      toast.error(`${errorMessage}. Please try again.`);
      
      if (typeof window !== 'undefined' && window.console) {
        window.console.log("Clear time slots error:", errorMessage);
      }
    }
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
      const availableDays = daysWithTimeSlots.map(day => {
        // Find the existing day data to get the day ID
        const existingDay = existingSession?.available_days?.find(
          existingDay => existingDay.day.toLowerCase() === day.toLowerCase()
        );
        
        return {
          id: existingDay?.id, // Include day ID if it exists
          day,
          time_slots: (timeSlots[day] || []).map(slot => ({
            id: slot.id, // Include slot ID if it exists (for existing slots)
            start_time: `${slot.start_time}:00`,
            end_time: `${slot.end_time}:00`,
          })),
        };
      });

      const sessionData: CreateSessionRequest = {
        training_type: sessionType,
        price: data.price,
        close_before: data.close_before,
        available_days: availableDays,
      };

      // If editing or if session exists for this type, use update
      if (editingSession || existingSession) {
        const sessionId = editingSession?.id || existingSession?.id;
        if (sessionId) {
          sessionData.id = sessionId;
          await updateSession(sessionData).unwrap();
          toast.success("Session updated successfully");
        }
      } else {
        // Create new session
        await createSession(sessionData).unwrap();
        toast.success("Session created successfully");
      }

      setEditingSession(null); // Clear editing mode but keep form data
      refetch();
    } catch (error) {
      const err = error as Error
      const errorMessage = err?.message || "Error saving session";
      toast.error(`${errorMessage}. Please try again.`);
      
      if (typeof window !== 'undefined' && window.console) {
        window.console.log("Save session error:", errorMessage);
      }
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
                variant={trainingType === "in_person" ? "default" : "outline"}
                onClick={() => handleTrainingTypeChange("in_person")}
                className="flex-1 sm:flex-none"
              >
                In-person Training
              </Button>
            </div>
          </div>

          <Tabs value={trainingType} onValueChange={(value) => setTrainingType(value as "virtual" | "in_person")}>
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
            <TabsContent value="in_person" className="space-y-6">
              <Tabs value="in_person" onValueChange={() => setSessionType("in_person")}>
                <TabsList className="grid w-full grid-cols-1 max-w-[222px]">
                  <TabsTrigger value="in_person">In-person</TabsTrigger>
                </TabsList>

                <TabsContent value="in_person" className="space-y-4">
                  <SessionForm
                    sessionType="in_person"
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
                    serviceEnabled={serviceEnabled["in_person"]}
                    onServiceToggle={(enabled) => handleServiceToggle("in_person", enabled)}
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