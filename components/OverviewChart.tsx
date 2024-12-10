import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { Appointment } from "../hooks/useAppointmentData"

export function OverviewChart({ appointments }: { appointments: Appointment[] }) {
  const data = appointments.reduce((acc, appointment) => {
    const hour = parseInt(appointment.startTime.split(':')[0])
    const timeSlot = hour < 12 ? 'Morning' : hour < 17 ? 'Afternoon' : 'Evening'
    const existingSlot = acc.find(d => d.name === timeSlot)
    if (existingSlot) {
      existingSlot.total += 1
    } else {
      acc.push({ name: timeSlot, total: 1 })
    }
    return acc
  }, [] as { name: string; total: number }[])

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="rounded-lg border bg-background p-2 shadow-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">
                        Time
                      </span>
                      <span className="font-bold text-muted-foreground">
                        {payload[0].payload.name}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">
                        Appointments
                      </span>
                      <span className="font-bold">
                        {payload[0].value}
                      </span>
                    </div>
                  </div>
                </div>
              )
            }
            return null
          }}
        />
        <Bar
          dataKey="total"
          fill="hsl(var(--primary))"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}

