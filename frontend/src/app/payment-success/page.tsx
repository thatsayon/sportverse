import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PaymentSuccessButton from "@/components/Element/PaymentSuccessButton";
import PaymentSuccessText from "@/components/Element/PaymentSuccessText";

function page() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-md border-none shadow-lg">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-orange-100 p-4">
              <CheckCircle className="h-8 w-8 text-orange-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Payment Successful!
          </CardTitle>
        </CardHeader>

        <CardContent className="text-center space-y-6">
          <div>
            <p className="text-gray-600 mb-2">Welcome to Pro! 🎉</p>
            <PaymentSuccessText/>
          </div>

          <div className="flex items-center justify-between gap-6">
            <PaymentSuccessButton/>

            <Link href="/student" className="w-full">
              <Button
                variant="outline"
                className="w-full h-12 border-gray-200 text-gray-600 hover:bg-gray-50 font-medium"
              >
                Back to Home
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
export default page;
