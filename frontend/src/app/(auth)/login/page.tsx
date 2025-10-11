import { LoginForm } from "@/components/auth/LoginForm";
import Image from "next/image";

export default function LoginPage() {

  return (
    <div className=" max-h-screen flex items-center justify-center p-6 md:p-10 lg:p-20 gap-20">
      <div className="hidden lg:block">
        <Image
        src={"https://res.cloudinary.com/dn4ygnsfg/image/upload/v1760122862/signup_z0oifq.jpg"}
        alt="login Image"
        width={720}
        height={820}
        className="object-cover"
        />
      </div>
      <LoginForm/>
    </div>
  );
}
