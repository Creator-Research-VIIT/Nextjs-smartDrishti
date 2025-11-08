import type { User, UserProgress, Project, SectionData } from "./types"

// LocalStorage keys schema documentation
const KEYS = {
  USERS: "iot:users",
  CURRENT_USER: "iot:currentUser",
  PROGRESS: (userId: string) => `iot:progress:${userId}`,
  SETTINGS: (userId: string) => `iot:settings:${userId}`,
  PROJECTS: "iot:projects",
  SECTIONS: "iot:sections",
  INITIALIZED: "iot:initialized",
} as const

export const storageUtils = {
  // Users
  getUsers: (): User[] => {
    if (typeof window === "undefined") return []
    const users = localStorage.getItem(KEYS.USERS)
    return users ? JSON.parse(users) : []
  },

  setUsers: (users: User[]) => {
    if (typeof window === "undefined") return
    localStorage.setItem(KEYS.USERS, JSON.stringify(users))
  },

  getCurrentUser: (): User | null => {
    if (typeof window === "undefined") return null
    const user = localStorage.getItem(KEYS.CURRENT_USER)
    return user ? JSON.parse(user) : null
  },

  setCurrentUser: (user: User | null) => {
    if (typeof window === "undefined") return
    if (user) {
      localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user))
    } else {
      localStorage.removeItem(KEYS.CURRENT_USER)
    }
  },

  // Progress
  getProgress: (userId: string): UserProgress => {
    if (typeof window === "undefined")
      return { userId, completedProjects: new Set(), unlockedSections: new Set(), theme: "dark" }
    const progress = localStorage.getItem(KEYS.PROGRESS(userId))
    if (!progress) {
      return { userId, completedProjects: new Set(), unlockedSections: new Set([1]), theme: "dark" }
    }
    const data = JSON.parse(progress)
    return {
      userId,
      completedProjects: new Set(data.completedProjects || []),
      unlockedSections: new Set(data.unlockedSections || [1]),
      theme: data.theme || "dark",
    }
  },

  setProgress: (userId: string, progress: UserProgress) => {
    if (typeof window === "undefined") return
    localStorage.setItem(
      KEYS.PROGRESS(userId),
      JSON.stringify({
        completedProjects: Array.from(progress.completedProjects),
        unlockedSections: Array.from(progress.unlockedSections),
        theme: progress.theme,
      }),
    )
  },

  // Projects
  getProjects: (): Project[] => {
    if (typeof window === "undefined") return []
    const projects = localStorage.getItem(KEYS.PROJECTS)
    return projects ? JSON.parse(projects) : []
  },

  setProjects: (projects: Project[]) => {
    if (typeof window === "undefined") return
    localStorage.setItem(KEYS.PROJECTS, JSON.stringify(projects))
  },

  // Sections
  getSections: (): SectionData[] => {
    if (typeof window === "undefined") return []
    const sections = localStorage.getItem(KEYS.SECTIONS)
    return sections ? JSON.parse(sections) : []
  },

  setSections: (sections: SectionData[]) => {
    if (typeof window === "undefined") return
    localStorage.setItem(KEYS.SECTIONS, JSON.stringify(sections))
  },

  isInitialized: (): boolean => {
    if (typeof window === "undefined") return false
    return localStorage.getItem(KEYS.INITIALIZED) === "true"
  },

  setInitialized: () => {
    if (typeof window === "undefined") return
    localStorage.setItem(KEYS.INITIALIZED, "true")
  },

  // Clear all data
  clearAll: () => {
    if (typeof window === "undefined") return
    localStorage.clear()
  },
}
