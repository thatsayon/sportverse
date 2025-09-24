import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, ChevronDown } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TrainingInfo } from "@/types/student/trainerList";

/**
 * UX goals addressed
 * - Trainers can offer multiple session types (e.g., Mindset, Virtual) with different prices.
 * - Show prices clearly and attractively.
 * - Keep a single primary CTA. If multiple sessions exist:
 *   → User picks a session from the dropdown (no navigation yet).
 *   → Main button text updates to reflect the selected session.
 *   → Clicking the main button performs the navigation with ?sessionId=...
 * - If only one session exists, show it explicitly below the Starts at price, selected by default,
 *   and the CTA label uses that session name.
 */

interface SessionType {
  id: string;
  training_type: string; // e.g., "Mindset", "Virtual"
  price: string; // keep as string from API, we will parse for math and format
}

interface TrainerCardProps {
  id: number;
  image: string;
  name: string;
  rating: number; // 0..5
  price: number; // legacy base price fallback
  sessionType: SessionType[];
  institute_name: string | null;
  sports: string;
}

function formatCurrency(n: number) {
  // You can swap locale/currency as needed
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

export default function TrainerCard({
  image,
  name,
  price,
  rating,
  id,
  sessionType = [],
  institute_name,
  sports,
}: TrainerCardProps) {

  const parsedSessions = (sessionType || []).map((s) => ({
    ...s,
    priceNum: Number.parseFloat(String(s.price).replace(/[^0-9.]/g, "")) || 0,
  }));

  const hasSessions = parsedSessions.length > 0;
  const hasMultiple = parsedSessions.length > 1;

  const lowest = hasSessions
    ? parsedSessions.reduce(
        (min, s) => (s.priceNum < min.priceNum ? s : min),
        parsedSessions[0]
      )
    : ({
        id: "base",
        training_type: "Session",
        price: String(price),
        priceNum: price,
      } as any);

  // State: which session is currently selected for booking
  const [selected, setSelected] = React.useState<TrainingInfo>(lowest);

  console.log("Session type checking:", selected)


  // Build a booking URL with a session id, so backend knows exactly which one
  const buildBookingHref = (selected: TrainingInfo) => `/student/session-booking/${selected.id}`;

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100">
      <CardContent>
        <div className="w-full h-[185px] lg:h-[300px] xl:h-[340px] relative overflow-hidden mb-6 rounded-xl border-2">
          <Image
            src={image}
            alt={`${name} profile image`}
            width={768}
            height={512}
            className="object-cover w-full h-full scale-100 hover:scale-105 transition-transform duration-500"
          />
        </div>
        <span className="px-2.5 mb-4 py-1 text-xs font-medium rounded-full bg-white/90 backdrop-blur border border-gray-200">
          {sports}
        </span>
        <div className="flex mt-4 items-start justify-between">
          <div className="">
            <h2 className="text-xl lg:text-2xl font-semibold text-gray-900">
              {name}
            </h2>
            <p className="mt-2 font-semibold text-gray-900 flex items-center gap-2">
              Institute: <span className="text-gray-500">{institute_name}</span>
            </p>
          </div>
          {/* Rating chip */}
          <div className="flex w-fit items-center gap-1 rounded-full bg-white/90 backdrop-blur px-2.5 py-1 border border-gray-200">
            {[...Array(1)].map((_, i) => (
              <Star
                key={i}
                size={14}
                className={
                  i < Math.round(rating)
                    ? "fill-yellow-400 stroke-yellow-400"
                    : "stroke-yellow-400"
                }
              />
            ))}
            <span className="text-xs font-semibold text-gray-700 ml-1">
              {rating.toFixed(1)}
            </span>
          </div>
        </div>
        {/* Pricing block */}
        <div className="mb-5">
          {hasMultiple ? (
            <div>
              <div className="text-sm text-gray-600 mb-2">Starts at</div>
              <div className="text-3xl font-bold text-gray-900">
                {formatCurrency(lowest.priceNum)}
                <span className="text-sm font-normal text-gray-500 ml-2">
                  / session
                </span>
              </div>
              {/* Grid of per-session prices */}
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {parsedSessions.map((s) => (
                  <div
                    key={s.id}
                    className={`flex items-center justify-between rounded-lg border ${
                      selected.id === s.id
                        ? "border-orange-300 bg-orange-50"
                        : "border-gray-100 bg-gray-50"
                    } px-3 py-2`}
                  >
                    <span className="text-sm font-medium text-gray-700">
                      {s.training_type}
                    </span>
                    <span className="text-base font-semibold text-orange-600">
                      {formatCurrency(s.priceNum)}
                      <span className="text-xs text-gray-500 ml-1">
                        /session
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <div className="text-sm text-gray-600 mb-2">Starts at</div>
              <div className="text-3xl font-bold text-gray-900">
                {formatCurrency(lowest.priceNum)}
                <span className="text-sm font-normal text-gray-500 ml-2">
                  / session
                </span>
              </div>
              {/* Single session row, shown selected to match CTA */}
              {hasSessions && (
                <div className="mt-3 grid grid-cols-1 gap-2">
                  <div className="flex items-center justify-between rounded-lg border border-orange-300 bg-orange-50 px-3 py-2">
                    <span className="text-sm font-medium text-gray-700">
                      {parsedSessions[0].training_type}
                    </span>
                    <span className="text-base font-semibold text-orange-600">
                      {formatCurrency(parsedSessions[0].priceNum)}
                      <span className="text-xs text-gray-500 ml-1">
                        /session
                      </span>
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <div className="flex items-center gap-3 w-full">
          <Link className="flex-1" href={`/student/trainer-profile`}>
            <Button className="w-full" variant="outline">
              View Profile
            </Button>
          </Link>

          {/* Primary CTA: choose first, navigate on click */}
          {hasMultiple ? (
            <div className="flex-1 flex">
              {/* Main action: uses currently selected session */}
              <Link href={buildBookingHref(selected)} className="flex-1">
                <Button className="w-full rounded-r-none">
                  Book: {selected.training_type}
                </Button>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    aria-label="Choose session"
                    className="rounded-l-none px-3"
                    variant="default"
                  >
                    <ChevronDown size={18} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {parsedSessions.map((s) => (
                    <DropdownMenuItem
                      key={s.id}
                      onClick={() => setSelected(s)}
                      className="cursor-pointer flex items-center justify-between"
                    >
                      <span>{s.training_type}</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {formatCurrency(s.priceNum)}
                      </span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <Link className="flex-1" href={buildBookingHref(selected)}>
              <Button className="w-full">Book: {selected.training_type}</Button>
            </Link>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
