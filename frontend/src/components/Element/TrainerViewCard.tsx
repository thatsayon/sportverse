import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import Image from "next/image";
import { Star } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";

interface TrainerviewCardProps {
  image: string;
  sports: string;
  name: string;
  rating: number;
  price: number;
  description: string;
  totalReview: number;
}

function TrainerviewCard({
  image,
  name,
  price,
  rating,
  sports,
  description,
  totalReview,
}: TrainerviewCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="w-full h-[185px] lg:h-[340px] relative overflow-hidden mb-6">
          <Image
            src={image}
            alt="trainer Image"
            width={381}
            height={260}
            className="object-cover  w-full h-auto"
          />
        </div>
        <CardTitle>
          <div className="flex items-center justify-between">
            <h1 className="w-fit py-1.5 px-3 text-xs lg:text-base text-[#F15A24] rounded-full bg-[#FFF1EC] font-medium">
              {sports}
            </h1>
            <div className="flex items-center justify-center gap-1">
              <Star stroke="#FACC15" fill="#FACC15" />
              <h1 className="text-[#585858] font-medium">{rating}</h1>
              <p className="text-[#585858]">({totalReview})</p>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="-mt-4 lg:mt-0">
        <h1 className="text-2xl lg:text-3xl font-medium mb-2 lg:mb-4">{name}</h1>
        <p className="md:text-sm lg:text-base text-[#878787]">
          {description.length > 0 && description.slice(0, 90)}...
        </p>
        <CardFooter className="flex items-center justify-between gap-6 mt-4 px-0">
          <Link href={'/trainer/profile'}>
          <Button className="text-base lg:text-lg font-semibold">
            View Profile
          </Button>
          </Link>
        </CardFooter>
      </CardContent>
    </Card>
  );
}

export default TrainerviewCard;
