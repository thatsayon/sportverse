import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import Link from 'next/link';

// Interface for subscription data
interface SubscriptionData {
  id: number;
  subscriptionType: 'Pro' | 'Basic';
  month: string;
  price: number | 'Free';
}

// Props interface for the component
interface ManageSubscriptionPopUpProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

// Dummy data
const subscriptionData: SubscriptionData[] = [
  { id: 1, subscriptionType: 'Pro', month: 'June', price: 60 },
  { id: 2, subscriptionType: 'Pro', month: 'July', price: 60 },
  { id: 3, subscriptionType: 'Basic', month: 'August', price: 'Free' },
  { id: 4, subscriptionType: 'Pro', month: 'September', price: 60 },
  { id: 5, subscriptionType: 'Basic', month: 'October', price: 'Free' },
  { id: 6, subscriptionType: 'Pro', month: 'November', price: 60 },
];

const ManageSubscriptionPopUp: React.FC<ManageSubscriptionPopUpProps> = ({
  open,
  setOpen,
}) => {
  const formatPrice = (price: number | 'Free'): string => {
    return price === 'Free' ? 'Free' : `$${price}`;
  };

  const getBadgeVariant = (type: 'Pro' | 'Basic') => {
    return type === 'Pro' ? 'destructive' : 'secondary';
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="text-xl font-semibold">
            Subscription management
          </DialogTitle>
        </DialogHeader>

        {/* Table Container */}
        <div className="flex-1 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">No</TableHead>
                <TableHead>Subscription Type</TableHead>
                <TableHead>Month</TableHead>
                <TableHead className="text-right">Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscriptionData.map((subscription, index) => (
                <TableRow key={subscription.id}>
                  <TableCell className="font-medium">
                    {String(index + 1).padStart(2, '0')}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getBadgeVariant(subscription.subscriptionType)}>
                      {subscription.subscriptionType}
                    </Badge>
                  </TableCell>
                  <TableCell>{subscription.month}</TableCell>
                  <TableCell className="text-right font-medium">
                    {formatPrice(subscription.price)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Footer */}
        <div className="pt-4 flex justify-center">
          <Link href={"/student/pricing"}>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8">
            Upgrade plan
          </Button>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ManageSubscriptionPopUp;