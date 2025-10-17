import Link from "next/link";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SubscriptionAlertProps{
    title?: string;
    subtitle?: string;
    href?: string;
}


export default function SubscriptionAlert({
    href="/student/pricing",
    subtitle="To access our premium video content in the video library, you need to upgrade to the Pro plan. Unlock exclusive educational resources and take your learning to the next level.",
    title="Premium Content Locked"

}:SubscriptionAlertProps) {
  return (
    <Card className="w-full border-amber-200 bg-amber-50 shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-amber-100 p-2">
            <Lock className="h-5 w-5 text-amber-600" />
          </div>
          <CardTitle className="text-lg font-semibold text-amber-900">
            {title}
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-amber-800">
          {subtitle}
        </p>

        <Link href={href}>
          <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium h-10">
            Upgrade to Pro
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}