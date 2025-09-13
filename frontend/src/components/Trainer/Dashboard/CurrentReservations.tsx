import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Edit } from 'lucide-react';
import Link from 'next/link';
import { Reservation } from '@/types/Trainerdashboard';


// Updated Reservation interface

// Extended interface to include the new fields
interface ExtendedReservation extends Reservation {
  sessionType: 'Virtual' | 'Mindset' | 'In-Person';
  price: string;
  status: 'Complete' | 'On Going' | 'Up Coming';
}

interface CurrentReservationsProps {
  reservations: ExtendedReservation[];
  onViewAll: () => void;
  onEdit: (id: string) => void;
}

export const CurrentReservations: React.FC<CurrentReservationsProps> = ({
  reservations,
  onViewAll,
  onEdit
}) => {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Complete':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'On Going':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Up Coming':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getSessionTypeVariant = (sessionType: string) => {
    switch (sessionType) {
      case 'Virtual':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Mindset':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'In-Person':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <Card className="bg-white border border-gray-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-semibold">Current Bookings</CardTitle>
        <Link href={"/dashboard/trainer-bookings"}>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onViewAll}
            className="text-gray-600 hover:text-gray-900"
          >
            View all
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">No</TableHead>
              <TableHead>Student Name</TableHead>
              <TableHead>Session Type</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reservations.map((reservation, index) => (
              <TableRow key={reservation.id} className="hover:bg-gray-50">
                <TableCell className="font-medium text-gray-600">
                  {String(index + 1).padStart(2, '0')}
                </TableCell>
                
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                      <span className="text-white font-semibold text-xs">
                        {reservation.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <span className="font-medium text-gray-900">{reservation.name}</span>
                  </div>
                </TableCell>
                
                <TableCell>
                  <Badge 
                    variant="outline" 
                    className={getSessionTypeVariant(reservation.sessionType)}
                  >
                    {reservation.sessionType}
                  </Badge>
                </TableCell>
                
                <TableCell className="font-semibold text-gray-900">
                  {reservation.price}
                </TableCell>
                
                <TableCell>
                  <Badge 
                    variant="outline" 
                    className={getStatusVariant(reservation.status)}
                  >
                    {reservation.status}
                  </Badge>
                </TableCell>
                
                <TableCell className="text-right">
                  <Link href={"/video"}>
                  <Button
                    size="sm"
                    variant={reservation.status === 'On Going' ? 'default' : 'ghost'}
                    disabled={reservation.status !== 'On Going'}
                    // onClick={() => onEdit(reservation.id)}
                    className='py-2'
                  >
                    {reservation.status === 'On Going' ? 'Join Session' : `${reservation.status}`}
                  </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
            
            {reservations.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  No bookings found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};