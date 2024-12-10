'use client'

import { useState } from 'react'
import { Appointment } from '../hooks/useAppointmentData'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { toast } from '@/hooks/use-toast'

interface ManageAppointmentsProps {
  appointments: Appointment[]
  updateAppointment: (appointment: Appointment) => Promise<Appointment>
  deleteAppointment: (id: string) => Promise<void>
  cancelAppointment: (id: string) => Promise<Appointment>
}

export function ManageAppointments({
  appointments,
  updateAppointment,
  deleteAppointment,
  cancelAppointment,
}: ManageAppointmentsProps) {
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null)

  const handleEdit = (appointment: Appointment) => {
    setEditingAppointment({...appointment})
  }

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (editingAppointment) {
      try {
        await updateAppointment(editingAppointment)
        setEditingAppointment(null)
        toast({
          title: "Appointment updated",
          description: "The appointment has been successfully updated.",
        })
      } catch (error) {
        toast({
          title: "Update Failed",
          description: "Unable to update the appointment. Please try again.",
          variant: "destructive"
        })
      }
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteAppointment(id)
      toast({
        title: "Appointment deleted",
        description: "The appointment has been successfully deleted.",
      })
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: "Unable to delete the appointment. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleCancel = async (id: string) => {
    try {
      await cancelAppointment(id)
      toast({
        title: "Appointment cancelled",
        description: "The appointment has been successfully cancelled.",
      })
    } catch (error) {
      toast({
        title: "Cancel Failed",
        description: "Unable to cancel the appointment. Please try again.",
        variant: "destructive"
      })
    }
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Client Name</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Time Slot</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.map((appointment) => (
            <TableRow key={appointment._id}>
              <TableCell>{appointment.clientName}</TableCell>
              <TableCell>{appointment.date}</TableCell>
              <TableCell>{`${appointment.startTime} - ${appointment.endTime}`}</TableCell>
              <TableCell>{appointment.status}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => handleEdit(appointment)}>Edit</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Edit Appointment</DialogTitle>
                        <DialogDescription>
                          Make changes to the appointment here. Click save when you're done.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleUpdate}>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                              Name
                            </Label>
                            <Input
                              id="name"
                              value={editingAppointment?.clientName}
                              onChange={(e) =>
                                setEditingAppointment(prev =>
                                  prev ? { ...prev, clientName: e.target.value } : null
                                )
                              }
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="date" className="text-right">
                              Date
                            </Label>
                            <Input
                              id="date"
                              type="date"
                              value={editingAppointment?.date}
                              onChange={(e) =>
                                setEditingAppointment(prev =>
                                  prev ? { ...prev, date: e.target.value } : null
                                )
                              }
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="startTime" className="text-right">
                              Start Time
                            </Label>
                            <Input
                              id="startTime"
                              type="time"
                              value={editingAppointment?.startTime}
                              onChange={(e) =>
                                setEditingAppointment(prev =>
                                  prev ? { ...prev, startTime: e.target.value } : null
                                )
                              }
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="endTime" className="text-right">
                              End Time
                            </Label>
                            <Input
                              id="endTime"
                              type="time"
                              value={editingAppointment?.endTime}
                              onChange={(e) =>
                                setEditingAppointment(prev =>
                                  prev ? { ...prev, endTime: e.target.value } : null
                                )
                              }
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="status" className="text-right">
                              Status
                            </Label>
                            <Select
                              value={editingAppointment?.status}
                              onValueChange={(value: 'scheduled' | 'completed' | 'cancelled') =>
                                setEditingAppointment(prev =>
                                  prev ? { ...prev, status: value } : null
                                )
                              }
                            >
                              <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select a status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="scheduled">Scheduled</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="submit">Save changes</Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleCancel(appointment._id || '')}
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => handleDelete(appointment._id || '')}
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}