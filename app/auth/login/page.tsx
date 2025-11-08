"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { authUtils } from "@/lib/auth"
import Header from "@/components/Header"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const user = authUtils.login(email, password)

    if (user) {
      router.push("/dashboard")
    } else {
      setError("Invalid email or password")
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white text-gray-900 flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4">
        <div className="animate-in fade-in zoom-in duration-500 w-full max-w-md">
          <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition-all">
            <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
              Welcome Back 👋
            </h1>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  required
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600 text-white py-2.5 rounded-lg font-semibold transition-transform transform hover:scale-[1.02] active:scale-[0.98] shadow-md"
              >
                {isLoading ? "Logging in..." : "Login"}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-3 text-center">Demo Credentials:</p>
              <div className="space-y-2 text-sm">
                <div className="font-mono text-xs bg-gray-100 border border-gray-200 p-2 rounded-lg">
                  Admin: <span className="font-semibold">admin@example.com / Admin123!</span>
                </div>
                <div className="font-mono text-xs bg-gray-100 border border-gray-200 p-2 rounded-lg">
                  Student: <span className="font-semibold">student@example.com / Student123!</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Floating decorative gradient blobs */}
      <div className="absolute -z-10 top-20 left-10 w-72 h-72 bg-gradient-to-br from-blue-300 to-cyan-200 rounded-full blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute -z-10 bottom-10 right-10 w-80 h-80 bg-gradient-to-br from-orange-300 to-pink-200 rounded-full blur-3xl opacity-30 animate-pulse delay-700"></div>
    </div>
  )
}
