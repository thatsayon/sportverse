// components/dashboard/TraineesTable.tsx
'use client'

import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Edit } from 'lucide-react'

interface Trainee {
  id: string
  name: string
  state: string
  tags: string
  status: 'Confirmed' | 'Pending' | 'Reject'
  avatar?: string
}

const traineesData: Trainee[] = [
  {
    id: '1',
    name: 'Iva Ryan',
    state: 'CA',
    tags: 'K-1',
    status: 'Confirmed',
    avatar: '/avatars/iva.jpg',
  },
  {
    id: '2',
    name: 'Lorri Warf',
    state: 'NC',
    tags: 'L-8',
    status: 'Pending',
    avatar: '/avatars/lorri.jpg',
  },
  {
    id: '3',
    name: 'James Hall',
    state: 'SC',
    tags: 'J-2',
    status: 'Reject',
    avatar: '/avatars/james.jpg',
  },
  {
    id: '4',
    name: 'Joshua Jones',
    state: 'GA',
    tags: 'I-2',
    status: 'Confirmed',
    avatar: '/avatars/joshua.jpg',
  },
  {
    id: '5',
    name: 'Lorri Warf',
    state: 'TN',
    tags: 'L-8',
    status: 'Confirmed',
    avatar: '/avatars/lorri2.jpg',
  },
  {
    id: '6',
    name: 'James Hall',
    state: 'VA',
    tags: 'J-2',
    status: 'Pending',
    avatar: '/avatars/james2.jpg',
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Confirmed':
      return 'bg-green-100 text-green-800 hover:bg-green-100'
    case 'Pending':
      return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
    case 'Reject':
      return 'bg-red-100 text-red-800 hover:bg-red-100'
    default:
      return 'bg-gray-100 text-gray-800 hover:bg-gray-100'
  }
}

const TraineesTable: React.FC = () => {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">Total trainee</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            className="text-[#808080] hover:text-[#F15A24]"
          >
            View all
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b">
                <TableHead className="px-6 py-4 text-left text-[#808080] font-medium">
                  Name
                </TableHead>
                <TableHead className="px-6 py-4 text-left text-[#808080] font-medium">
                  State
                </TableHead>
                <TableHead className="px-6 py-4 text-left text-[#808080] font-medium">
                  Tags
                </TableHead>
                <TableHead className="px-6 py-4 text-left text-[#808080] font-medium">
                  Status
                </TableHead>
                <TableHead className="px-6 py-4 text-right text-[#808080] font-medium">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {traineesData.map((trainee) => (
                <TableRow key={trainee.id} className="border-b">
                  {/* Name with avatar */}
                  <TableCell className="px-6 py-4 flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={trainee.avatar} alt={trainee.name} />
                      <AvatarFallback>
                        {trainee.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{trainee.name}</span>
                  </TableCell>

                  {/* State */}
                  <TableCell className="px-6 py-4 text-[#333]">
                    {trainee.state}
                  </TableCell>

                  {/* Tags */}
                  <TableCell className="px-6 py-4">
                    <Badge variant="outline">{trainee.tags}</Badge>
                  </TableCell>

                  {/* Status */}
                  <TableCell className="px-6 py-4">
                    <Badge className={getStatusColor(trainee.status)}>
                      {trainee.status}
                    </Badge>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="px-6 py-4 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-[#808080] hover:text-[#F15A24] flex items-center gap-1"
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

export default TraineesTable
