"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { authUtils } from "@/lib/auth"
import { storageUtils } from "@/lib/localStorage"
import { progressUtils } from "@/lib/progress"
import Header from "@/components/Header"
import ProgressRing from "@/components/ProgressRing"

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState(authUtils.getCurrentUser())
  const [sectionProgress, setSectionProgress] = useState<Record<number, { completed: number; total: number }>>({})
  const [overallProgress, setOverallProgress] = useState({ completed: 0, total: 0 })

  useEffect(() => {
    const currentUser = authUtils.getCurrentUser()
    if (!currentUser) {
      router.push("/auth/login")
      return
    }

    setUser(currentUser)

    // Calculate progress for all sections
    const progress: Record<number, { completed: number; total: number }> = {}
    for (let i = 1; i <= 3; i++) {
      progress[i] = progressUtils.getSectionProgress(currentUser.id, i)
    }
    setSectionProgress(progress)

    const overall = progressUtils.getOverallProgress(currentUser.id)
    setOverallProgress(overall)
  }, [router])

  const userProgress = user ? storageUtils.getProgress(user.id) : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white text-gray-900">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="animate-in fade-in duration-500">
          {/* Welcome Section */}
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
            Welcome, {user?.name}!
          </h1>
          <p className="text-gray-600 mb-10">
            Track your learning journey and unlock new IoT projects as you progress.
          </p>

          {/* Overall Progress Card */}
          <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition-all mb-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex-1">
                <h2 className="text-2xl font-semibold mb-2">Overall Progress</h2>
                <p className="text-gray-600 mb-4">
                  You’ve completed{" "}
                  <span className="font-semibold text-blue-600">{overallProgress.completed}</span> of{" "}
                  <span className="font-semibold text-blue-600">{overallProgress.total}</span> projects
                </p>

                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    style={{
                      width: `${(overallProgress.completed / overallProgress.total) * 100}%`,
                    }}
                    className="bg-gradient-to-r from-blue-600 to-orange-500 h-full transition-all duration-700"
                  />
                </div>
              </div>

              <ProgressRing completed={overallProgress.completed} total={overallProgress.total} />
            </div>
          </div>

          {/* Section Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((sectionNum) => {
              const difficulties = ["Easy", "Intermediate", "Advanced"]
              const isUnlocked = userProgress?.unlockedSections.has(sectionNum) || sectionNum === 1
              const progress = sectionProgress[sectionNum] || { completed: 0, total: 0 }

              return (
                <div
                  key={sectionNum}
                  className={`p-6 rounded-xl border transition-all shadow-sm hover:shadow-md ${
                    isUnlocked
                      ? "bg-white border-gray-200 cursor-pointer hover:border-blue-500"
                      : "bg-gray-100 border-gray-200 opacity-70"
                  }`}
                  style={{ animationDelay: `${sectionNum * 100}ms` }}
                  onClick={() => isUnlocked && router.push("/projects")}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">Section {sectionNum}</h3>
                      <p className="text-sm text-gray-500">{difficulties[sectionNum - 1]}</p>
                    </div>
                    {!isUnlocked && <span className="text-2xl">🔒</span>}
                  </div>

                  {isUnlocked ? (
                    <div>
                      <div className="text-sm text-gray-600 mb-2">
                        {progress.completed} of {progress.total} projects completed
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                          style={{
                            width: `${(progress.completed / progress.total) * 100}%`,
                          }}
                          className="bg-gradient-to-r from-blue-600 to-orange-500 h-full transition-all duration-700"
                        />
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">Complete Section {sectionNum - 1} to unlock</p>
                  )}
                </div>
              )
            })}
          </div>

          {/* Quick Actions */}
          <div className="mt-12 text-center">
            <button
              onClick={() => router.push("/projects")}
              className="bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600 text-white px-8 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-transform transform hover:scale-[1.03] active:scale-[0.98]"
            >
              View All Projects →
            </button>
          </div>
        </div>
      </main>

      {/* Decorative background glow */}
      <div className="absolute -z-10 top-32 left-10 w-72 h-72 bg-gradient-to-br from-blue-300 to-cyan-200 rounded-full blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute -z-10 bottom-10 right-10 w-80 h-80 bg-gradient-to-br from-orange-300 to-pink-200 rounded-full blur-3xl opacity-30 animate-pulse delay-700"></div>
    </div>
  )
}
