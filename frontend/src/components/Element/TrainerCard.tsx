import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import Image from "next/image";
import { Star } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";

interface TrainerCardProps {
  id: number;
  image: string;
  sports: string;
  name: string;
  rating: number;
  price: number;
}

function TrainerCard({ image, name, price, rating, sports, id }: TrainerCardProps) {
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
              {[...Array(5)].map((_, i) =>
                i < rating ? (
                  <Star key={i} fill="#FACC15" stroke="#FACC15" />
                ) : (
                  <Star key={i} stroke="#FACC15" />
                )
              )}
              <h1 className="text-[#585858] font-medium">{rating}</h1>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <h1 className="text-3xl font-medium mb-4">{name}</h1>
        <p className="text-2xl mb-6 font-semibold">${price}<span className="font-normal text-[#707070] text-sm">/Session</span></p>
        <CardFooter className="flex items-center justify-center gap-6">
            <Button className="w-1/2 py-3.5 px-12 " variant={"outline"}>View Profile</Button>
            <Link className="w-1/2" href={`/trainer/${id}`}>
            <Button className="w-full py-3.5 px-12 ">Book Now</Button>
            </Link>
        </CardFooter>
      </CardContent>
    </Card>
  );
}

export default TrainerCard;
