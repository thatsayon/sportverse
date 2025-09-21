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
import Link from 'next/link'
import { Student } from '@/types/admin/dashboard'

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

interface TraineesTableProps {
  data: Student[]
}

const TraineesTable: React.FC<TraineesTableProps> = ({data}) => {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">Total trainee</CardTitle>
          <Link href={"/dashboard/trainees"}>
          <Button
            variant="ghost"
            size="sm"
            className="text-[#808080] hover:text-[#F15A24]"
          >
            View all
          </Button>
          </Link>
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
                Username
                </TableHead>
                <TableHead className="px-6 py-4 text-left text-[#808080] font-medium">
                  Sport
                </TableHead>
                <TableHead className="px-6 py-4 text-left text-[#808080] font-medium">
                  Subscription
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((trainee) => (
                <TableRow key={trainee.id} className="border-b">
                  {/* Name with avatar */}
                  <TableCell className="px-6 py-4 flex items-center gap-3">
                    {/* <Avatar className="h-8 w-8">
                      <AvatarImage src={trainee.avatar} alt={trainee.name} />
                      <AvatarFallback>
                        {trainee.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar> */}
                    <span className="font-medium">{trainee.full_name}</span>
                  </TableCell>

                  {/* Last Trainer */}
                  <TableCell className="px-6 py-4 text-[#333]">
                    {trainee.username}
                  </TableCell>

                  {/* Sports */}
                  <TableCell className="px-6 py-4">
                    {
                      trainee.favorite_sports.length > 0 ? (
                        <Badge variant="outline">{trainee.favorite_sports[0]}</Badge>
                      ):(
                        <span>No Sports Selected</span>
                      )
                    }
                  </TableCell>

                  {/* Status */}
                  <TableCell className="px-6 py-4">
                    <Badge className={getStatusColor(trainee.account_type)}>
                      {trainee.account_type}
                    </Badge>
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
