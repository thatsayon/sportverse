import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function page() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-md border-none shadow-lg">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-red-100 p-4">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Payment Failed
          </CardTitle>
        </CardHeader>

        <CardContent className="text-center space-y-6">
          <p className="text-gray-600">
            Unfortunately, your payment could not be processed. Please try again
            or contact support if the problem persists.
          </p>

          <Link href="/student">
            <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium h-12">
              Back to Home
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
export default page;
