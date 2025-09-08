import Image from "next/image";
import Link from "next/link";
import React from "react";

function Logo({href}:{href: string;}) {
  return (
    <div className="flex items-center space-x-2 mb-8">
      <Link href={href} className="flex items-center space-x-2">
        <Image
          src={"/image/logo.png"}
          alt="logo image"
          width={48}
          height={48}
          className="rounded-sm"
        />
        <span className="text-3xl font-bold bg-gradient-to-r from-[#FF7442] to-[#994628] bg-clip-text text-transparent">
          SportVerse
        </span>
      </Link>
    </div>
  );
}

export default Logo;
