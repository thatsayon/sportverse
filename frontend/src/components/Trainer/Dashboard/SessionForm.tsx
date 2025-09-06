"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Toggle } from "@/components/ui/toggle";
import { X, Clock, Calendar, Plus } from "lucide-react";
import { SessionResult } from "@/store/Slices/apiSlices/trainerApiSlice";
import { CLOSE_BEFORE_OPTIONS, DAYS_OF_WEEK, formatTime } from "./SessionManagment";


interface SessionFormProps {
  sessionType: string;
  register: any;
  errors: any;
  selectedDays: string[];
  timeSlots: Record<string, string[]>;
  onDayToggle: (day: string) => void;
  onAddTimeSlot: (time: string) => void;
  onRemoveTimeSlot: (day: string, timeSlot: string) => void;
  onSubmit: () => void;
  watchedCloseBeforeTime: string;
  editingSession: SessionResult | null;
  onCancelEdit: () => void;
  serviceEnabled: boolean;
  onServiceToggle: (enabled: boolean) => void;
  newTimeSlot: string;
  setNewTimeSlot: (time: string) => void;
}

const SessionForm: React.FC<SessionFormProps> = ({
  sessionType,
  register,
  errors,
  selectedDays,
  timeSlots,
  onDayToggle,
  onAddTimeSlot,
  onRemoveTimeSlot,
  onSubmit,
  editingSession,
  onCancelEdit,
  serviceEnabled,
  onServiceToggle,
  newTimeSlot,
  setNewTimeSlot,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="capitalize flex items-center justify-between">
          <div className="flex items-center gap-2">
            {sessionType} Session
            {editingSession && <Badge variant="secondary">Editing</Badge>}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-normal">Service:</span>
            <Toggle
              pressed={serviceEnabled}
              onPressedChange={onServiceToggle}
              aria-label={`Toggle ${sessionType} service`}
              className={`${!serviceEnabled ? "bg-gray-200":"bg-[#F15A24] text-white hover:text-white hover:bg-[#c95227]"}`}
            >
              {serviceEnabled ? "ON" : "OFF"}
            </Toggle>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={onSubmit} className="space-y-6">
          {/* Available Days */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Available Days</Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {DAYS_OF_WEEK.map((day) => (
                <Button
                  key={day}
                  type="button"
                  variant={selectedDays.includes(day.toLowerCase()) ? "default" : "outline"}
                  onClick={() => onDayToggle(day)}
                  className="w-full"
                  disabled={!serviceEnabled}
                >
                  {day}
                </Button>
              ))}
            </div>
          </div>

          {/* Add Time Slot */}
          {selectedDays.length > 0 && (
            <div className="space-y-3">
              <Label className="text-base font-semibold">Add Time Slot</Label>
              <div className="flex gap-2 w-fit">
                <Input
                  type="time"
                  value={newTimeSlot}
                  onChange={(e) => setNewTimeSlot(e.target.value)}
                  className="flex-1 py-5"
                  disabled={!serviceEnabled}
                />
                <Button
                  type="button"
                  onClick={() => onAddTimeSlot(newTimeSlot)}
                  disabled={!newTimeSlot || !serviceEnabled}
                  className="bg-[#FFD7BC] text-[#F15A24] hover:text-white transition-colors duration-300"
                >
                  Add
                  <Plus/>
                </Button>
              </div>
            </div>
          )}

          {/* Time Slots Display */}
          {selectedDays.length > 0 && (
            <div className="space-y-4">
              <Label className="text-base font-semibold">Time Slots</Label>
              <Card className="p-4">
                <div className="space-y-4">
                  {selectedDays.map((day) => (
                    <div key={day} className="space-y-2">
                      <h4 className="font-medium capitalize flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {day}
                        {timeSlots[day]?.length > 0 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              // Clear all time slots for this day
                              timeSlots[day]?.forEach(slot => onRemoveTimeSlot(day, slot));
                            }}
                            className="text-orange-500 hover:text-orange-600 h-auto p-1 text-xs"
                            disabled={!serviceEnabled}
                          >
                            Cancel all
                          </Button>
                        )}
                      </h4>
                      
                      <div className="flex flex-wrap gap-2">
                        {(timeSlots[day] || []).map((slot, index) => {
                          const [start, end] = slot.split("-");
                          return (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="flex items-center gap-2 px-3 py-1"
                            >
                              <Clock className="h-3 w-3" />
                              {formatTime(start)} - {formatTime(end)}
                              <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                onClick={() => onRemoveTimeSlot(day, slot)}
                                className="h-4 w-4 p-0 hover:bg-red-100"
                                disabled={!serviceEnabled}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {/* Price and Close Before - Below Time Slots */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price (USD)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                placeholder="0.00"
                {...register("price")}
                disabled={!serviceEnabled}
              />
              {errors.price && (
                <p className="text-sm text-red-500">{errors.price.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="close_before">Closes Before</Label>
              <select
                id="close_before"
                {...register("close_before")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!serviceEnabled}
              >
                {CLOSE_BEFORE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              className="flex-1 sm:flex-none"
              disabled={selectedDays.length === 0 || !serviceEnabled}
            >
              {editingSession ? "Update Session" : "Save Session"}
            </Button>
            {editingSession && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancelEdit}
                className="flex-1 sm:flex-none"
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default SessionForm;