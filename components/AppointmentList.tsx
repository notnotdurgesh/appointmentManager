'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Appointment } from "../hooks/useAppointmentData"
import { Badge } from "@/components/ui/badge"

export function AppointmentList({ appointments }: { appointments: Appointment[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Client Name</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Time Slot</TableHead>
          <TableHead>Duration</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {appointments.map((appointment) => (
          <TableRow key={appointment._id}>
            <TableCell className="font-medium">{appointment.clientName}</TableCell>
            <TableCell>{new Date(appointment.date).toLocaleDateString()}</TableCell>
            <TableCell>{appointment.startTime} - {appointment.endTime}</TableCell>
            <TableCell>{(appointment.duration / 60).toFixed(1)} hours</TableCell>
            <TableCell>
              <Badge
                variant={
                  appointment.status === 'completed' ? 'default' :
                  appointment.status === 'scheduled' ? 'secondary' : 'destructive'
                }
              >
                {appointment.status}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

