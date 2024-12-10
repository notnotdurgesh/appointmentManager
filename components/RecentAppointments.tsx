import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Appointment } from "../hooks/useAppointmentData"
import { Badge } from "@/components/ui/badge"

export function RecentAppointments({ appointments }: { appointments: Appointment[] }) {
  return (
    <div className="space-y-8">
      {appointments.map((appointment) => (
        <div key={appointment._id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarFallback>{appointment.clientName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{appointment.clientName}</p>
            <p className="text-sm text-muted-foreground">
              {new Date(appointment.date).toLocaleDateString()} | {appointment.startTime} - {appointment.endTime}
            </p>
          </div>
          <div className="ml-auto font-medium">
            <Badge
              variant={
                appointment.status === 'completed' ? 'default' :
                appointment.status === 'scheduled' ? 'secondary' : 'destructive'
              }
            >
              {appointment.status}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  )
}

