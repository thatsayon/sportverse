import { SignUpForm } from "@/components/auth/SignUpForm";
import Image from "next/image";

export default function SignupPage() {
  return (
    <div className=" max-h-screen flex items-center justify-center p-6 md:p-10 lg:p-20 gap-20">
      <SignUpForm />
      <div className="hidden lg:block">
        <Image
          src={"https://res.cloudinary.com/dn4ygnsfg/image/upload/v1760122861/loginImage_pwsn1o.jpg"}
          alt="login Image"
          width={700}
          height={620}
          className="object-cover"
        />
      </div>
    </div>
  );
}
