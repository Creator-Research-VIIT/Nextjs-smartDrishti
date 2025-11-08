export interface User {
  id: string
  email: string
  name: string
  isAdmin: boolean
}

export interface Project {
  id: string
  name: string
  description: string
  difficulty: "Easy" | "Intermediate" | "Advanced"
  section: number
  sectionName: string
  deviceId: string
  hidden: boolean
  objectives: string[]
  apiKey?: string
  apiKeyVisible?: boolean
  apiEndpoint?: string
  apiConfig?: {
    rateLimit: number
    timeout: number
    retries: number
  }
}

export interface SectionData {
  id: number
  name: string
  difficulty: "Easy" | "Intermediate" | "Advanced"
  isUnlocked: boolean
  projects: Project[]
}

export interface UserProgress {
  userId: string
  completedProjects: Set<string>
  unlockedSections: Set<number>
  theme: "light" | "dark"
}

export interface SensorReading {
  timestamp: number
  temperature: number
  humidity: number
  deviceId: string
  value: number
}
