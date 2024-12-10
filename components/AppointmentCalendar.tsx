'use client'
import { Calendar } from "@/components/ui/calendar"
import { Appointment } from "../hooks/useAppointmentData"
import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format, parseISO } from "date-fns"

export function AppointmentCalendar({ appointments }: { appointments: Appointment[] }) {
  const [date, setDate] = useState<Date | undefined>(new Date())
  
  // Memoized appointments by date to improve performance
  const appointmentsByDate = useMemo(() => {
    return appointments.reduce((acc, appointment) => {
      // Ensure the date is converted to a consistent string format
      const dateKey = appointment.date 
        ? format(parseISO(appointment.date), 'yyyy-MM-dd') 
        : 'unknown'
      
      if (!acc[dateKey]) {
        acc[dateKey] = []
      }
      acc[dateKey].push(appointment)
      return acc
    }, {} as Record<string, Appointment[]>)
  }, [appointments])

  // Consistent date formatting for selected date appointments
  const selectedDateAppointments = useMemo(() => {
    if (!date) return []
    
    const formattedDate = format(date, 'yyyy-MM-dd')
    return appointmentsByDate[formattedDate] || []
  }, [date, appointmentsByDate])

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md border"
        components={{
          DayContent: (props: any) => {
            const dateString = format(props.date, 'yyyy-MM-dd')
            const hasAppointments = appointmentsByDate[dateString]
            
            return (
              <div className="relative w-full h-full flex items-center justify-center">
                <div className={`w-8 h-8 flex items-center justify-center rounded-full 
                  ${hasAppointments 
                    ? 'bg-primary/10 text-primary-foreground' 
                    : 'text-foreground'
                  } 
                  hover:bg-primary/20 transition-colors`}>
                  <span className="text-sm font-medium">{props.label}</span>
                </div>
                {hasAppointments && (
                  <div 
                    className="absolute bottom-1 right-1 w-2 h-2 bg-primary rounded-full" 
                    title="Appointments available"
                  />
                )}
              </div>
            )
          }
        }}
      />
      <Card className="flex-1">
        <CardHeader>
          <CardTitle>
            {date 
              ? format(date, 'PPPP') // Full descriptive date
              : 'Select a date'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedDateAppointments.length > 0 ? (
            <div className="space-y-4">
              {selectedDateAppointments.map((appointment) => (
                <div 
                  key={appointment._id} 
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{appointment.clientName}</p>
                    <p className="text-sm text-muted-foreground">
                      {appointment.startTime} - {appointment.endTime}
                    </p>
                  </div>
                  <Badge
                    variant={
                      appointment.status === 'completed' ? 'default' :
                      appointment.status === 'scheduled' ? 'secondary' : 'destructive'
                    }
                  >
                    {appointment.status}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">
              No appointments for this date.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}