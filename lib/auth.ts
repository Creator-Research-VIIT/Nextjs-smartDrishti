import type { User } from "./types"
import { storageUtils } from "./localStorage"

const SEEDED_USERS: User[] = [
  {
    id: "admin-001",
    email: "admin@example.com",
    name: "Admin User",
    isAdmin: true,
  },
  {
    id: "student-001",
    email: "student@example.com",
    name: "Student",
    isAdmin: false,
  },
]

const SEEDED_PASSWORDS: Record<string, string> = {
  "admin@example.com": "Admin123!",
  "student@example.com": "Student123!",
}

export const authUtils = {
  initializeUsers: () => {
    if (!storageUtils.isInitialized()) {
      storageUtils.setUsers(SEEDED_USERS)
      storageUtils.setInitialized()
    }
  },

  login: (email: string, password: string): User | null => {
    authUtils.initializeUsers()
    const users = storageUtils.getUsers()
    const user = users.find((u) => u.email === email)

    if (user && SEEDED_PASSWORDS[email] === password) {
      storageUtils.setCurrentUser(user)
      return user
    }

    return null
  },

  logout: () => {
    storageUtils.setCurrentUser(null)
  },

  getCurrentUser: (): User | null => {
    return storageUtils.getCurrentUser()
  },

  isAuthenticated: (): boolean => {
    return storageUtils.getCurrentUser() !== null
  },

  isAdmin: (): boolean => {
    const user = storageUtils.getCurrentUser()
    return user?.isAdmin === true
  },
}
