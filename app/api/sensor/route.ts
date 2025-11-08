export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const deviceId = searchParams.get("deviceId") || "device-001"
  const points = Number.parseInt(searchParams.get("points") || "20")

  // Generate mock sensor data
  const now = Date.now()
  const data = Array.from({ length: points }, (_, i) => {
    const timestamp = new Date(now - (points - i) * 3000).toLocaleTimeString()
    return {
      timestamp,
      temperature: Math.round((20 + Math.sin(i * 0.5) * 5 + Math.random() * 3) * 100) / 100,
      humidity: Math.round((50 + Math.cos(i * 0.5) * 15 + Math.random() * 5) * 100) / 100,
      deviceId,
      value: Math.random() * 100,
    }
  })

  return Response.json(data, {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
    },
  })
}
