import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TopStudent } from '@/types/Trainerdashboard';

interface TopStudentsProps {
  students: TopStudent[];
  onViewAll: () => void;
}

export const TopStudents: React.FC<TopStudentsProps> = ({
  students,
  onViewAll
}) => {
  return (
    <Card className="bg-white border border-gray-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-semibold">Top student</CardTitle>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onViewAll}
          className="text-gray-600 hover:text-gray-900"
        >
          View all
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {students.map((student) => (
          <div key={student.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {student.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <span className="font-medium text-gray-900">{student.name}</span>
            </div>
            <span className="text-sm text-gray-600">{student.hours}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};