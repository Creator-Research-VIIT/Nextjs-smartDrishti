"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { authUtils } from "@/lib/auth"
import Header from "@/components/Header"

export default function SettingsPage() {
  const router = useRouter()
  const [user, setUser] = useState(authUtils.getCurrentUser())

  useEffect(() => {
    const currentUser = authUtils.getCurrentUser()
    if (!currentUser) {
      router.push("/auth/login")
      return
    }
    setUser(currentUser)
  }, [router])

  const handleLogout = () => {
    authUtils.logout()
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-10">
        <div className="animate-in fade-in duration-500">
          <h1 className="text-4xl font-bold mb-10">Settings</h1>

          <div className="bg-slate-900 p-8 rounded-lg border border-slate-800">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Profile Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <input
                    type="text"
                    value={user?.name || ""}
                    disabled
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 text-slate-400 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 text-slate-400 rounded-lg"
                  />
                </div>
                {user?.isAdmin && (
                  <div className="pt-4 border-t border-slate-700">
                    <p className="text-sm text-orange-500 font-semibold">Admin Account</p>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-8 border-t border-slate-700">
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-semibold transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
