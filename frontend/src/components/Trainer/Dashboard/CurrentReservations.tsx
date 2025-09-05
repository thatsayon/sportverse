import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit } from 'lucide-react';
import { Reservation } from '@/types/Trainerdashboard';

interface CurrentReservationsProps {
  reservations: Reservation[];
  onViewAll: () => void;
  onEdit: (id: string) => void;
}

export const CurrentReservations: React.FC<CurrentReservationsProps> = ({
  reservations,
  onViewAll,
  onEdit
}) => {
  return (
    <Card className="bg-white border border-gray-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-semibold">Current reservation</CardTitle>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onViewAll}
          className="text-gray-600 hover:text-gray-900"
        >
          View all
        </Button>
      </CardHeader>
      <CardContent className="space-y-3 overflow-auto">
        {reservations.map((reservation) => (
          <div key={reservation.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {reservation.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <span className="font-medium text-gray-900">{reservation.name}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">{reservation.time}</span>
              <span className="text-sm text-gray-600">{reservation.table}</span>
              <Badge 
                variant="secondary" 
                className="bg-green-50 text-green-700 border-green-200"
              >
                {reservation.status}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(reservation.id)}
                className="text-gray-500 hover:text-gray-700 flex items-center gap-1"
              >
                <Edit className="h-4 w-4" />
                Edit
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};