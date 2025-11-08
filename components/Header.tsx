"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { authUtils } from "@/lib/auth"
import { storageUtils } from "@/lib/localStorage"
import type { User } from "@/lib/types"

export default function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null)
  const [theme, setTheme] = useState<"light" | "dark">("light")

  useEffect(() => {
    setUser(authUtils.getCurrentUser())
    const savedTheme = storageUtils.getCurrentUser()
      ? storageUtils.getProgress(authUtils.getCurrentUser()!.id).theme
      : "light"
    setTheme(savedTheme)
    document.documentElement.setAttribute("data-theme", savedTheme)
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    document.documentElement.setAttribute("data-theme", newTheme)

    if (user) {
      const progress = storageUtils.getProgress(user.id)
      progress.theme = newTheme
      storageUtils.setProgress(user.id, progress)
    }
  }

  const handleLogout = () => {
    authUtils.logout()
    router.push("/")
  }

  const isActive = (path: string) => pathname === path

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm sticky top-0 z-50 transition-all">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand */}
        <Link
          href="/"
          className="font-extrabold text-2xl bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent hover:opacity-90 transition"
        >
          IoT Lab
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-6 text-sm md:text-base">
          {user && (
            <>
              <Link
                href="/dashboard"
                className={`transition font-medium ${
                  isActive("/dashboard")
                    ? "text-blue-600"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                Dashboard
              </Link>

              <Link
                href="/projects"
                className={`transition font-medium ${
                  isActive("/projects")
                    ? "text-blue-600"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                Projects
              </Link>

              {authUtils.isAdmin() && (
                <Link
                  href="/admin"
                  className={`transition font-medium ${
                    isActive("/admin")
                      ? "text-blue-600"
                      : "text-gray-600 hover:text-blue-600"
                  }`}
                >
                  Admin
                </Link>
              )}

              <Link
                href="/settings"
                className={`transition font-medium ${
                  isActive("/settings")
                    ? "text-blue-600"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                Settings
              </Link>
            </>
          )}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-100 transition-all"
            aria-label="Toggle theme"
            title="Toggle light/dark mode"
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>

          {/* Auth Button */}
          {user ? (
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white rounded-lg font-semibold shadow-sm hover:shadow-md transition-all"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => router.push("/auth/login")}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-lg font-semibold shadow-sm hover:shadow-md transition-all"
            >
              Login
            </button>
          )}
        </nav>
      </div>
    </header>
  )
}
