"use client"

import { useEffect, useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface SensorData {
  time: string
  temperature: number
  humidity: number
  co2: number
}

interface SensorChartProps {
  deviceId: string
}

export default function SensorChart({ deviceId }: SensorChartProps) {
  const [data, setData] = useState<SensorData[]>([])

  useEffect(() => {
    // Simulate real-time sensor data
    const generateData = () => {
      const now = new Date()
      const newData: SensorData[] = []

      for (let i = 23; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 60 * 1000)
        newData.push({
          time: time.toLocaleTimeString(),
          temperature: 20 + Math.random() * 10,
          humidity: 40 + Math.random() * 30,
          co2: 300 + Math.random() * 200,
        })
      }

      setData(newData)
    }

    generateData()

    const interval = setInterval(() => {
      setData((prev) => {
        const newEntry: SensorData = {
          time: new Date().toLocaleTimeString(),
          temperature: 20 + Math.random() * 10,
          humidity: 40 + Math.random() * 30,
          co2: 300 + Math.random() * 200,
        }
        return [...prev.slice(1), newEntry]
      })
    }, 10000)

    return () => clearInterval(interval)
  }, [deviceId])

  return (
    <div className="bg-[var(--color-surface)] p-8 rounded-lg border border-[var(--color-border)] mb-8 animate-in fade-in duration-500">
      <h2 className="text-2xl font-bold mb-6">Live Sensor Data - {deviceId}</h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid stroke="var(--color-border)" />
          <XAxis dataKey="time" stroke="var(--color-muted)" />
          <YAxis stroke="var(--color-muted)" />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              borderRadius: "8px",
            }}
          />
          <Line
            type="monotone"
            dataKey="temperature"
            stroke="var(--color-primary)"
            dot={false}
            animationDuration={300}
          />
          <Line
            type="monotone"
            dataKey="humidity"
            stroke="var(--color-secondary)"
            dot={false}
            animationDuration={300}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
