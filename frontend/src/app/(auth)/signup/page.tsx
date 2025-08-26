import { SignUpForm } from "@/components/auth/SignUpForm";
import Image from "next/image";

export default function SignupPage() {
  return (
    <div className=" max-h-screen flex items-center justify-center p-6 md:p-10 lg:p-20 gap-20">
      <SignUpForm />
      <div className="hidden lg:block">
        <Image
          src={"/auth/loginImage.png"}
          alt="login Image"
          width={720}
          height={820}
          className="object-cover"
        />
      </div>
    </div>
  );
}
