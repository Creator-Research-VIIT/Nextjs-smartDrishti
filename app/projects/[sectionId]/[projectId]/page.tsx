"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { authUtils } from "@/lib/auth"
import { storageUtils } from "@/lib/localStorage"
import { progressUtils } from "@/lib/progress"
import type { Project } from "@/lib/types"
import Header from "@/components/Header"
import SensorChart from "@/components/SensorChart"

export default function ProjectDetailPage() {
  const router = useRouter()
  const params = useParams()
  const projectId = params.projectId as string
  const [project, setProject] = useState<Project | null>(null)
  const [isComplete, setIsComplete] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const user = authUtils.getCurrentUser()
    if (!user) {
      router.push("/auth/login")
      return
    }

    const projects = storageUtils.getProjects()
    const foundProject = projects.find((p) => p.id === projectId)

    if (foundProject) {
      setProject(foundProject)
      setIsComplete(progressUtils.isProjectComplete(user.id, projectId))
    }

    setIsLoading(false)
  }, [projectId, router])

  const handleComplete = () => {
    const user = authUtils.getCurrentUser()
    if (!user || !project) return

    if (!isComplete) {
      const unlockedSection = progressUtils.completeProject(user.id, project.id)
      setIsComplete(true)

      if (unlockedSection) {
        alert(`🎉 Section ${unlockedSection} unlocked!`)
      }
    }
  }

  if (isLoading || !project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white flex items-center justify-center">
        <div className="h-12 w-12 border-4 border-t-transparent border-orange-500 rounded-full animate-spin"></div>
      </div>
    )
  }

  const difficultyColors = {
    Easy: "bg-green-100 text-green-700 border border-green-300",
    Intermediate: "bg-yellow-100 text-yellow-700 border border-yellow-300",
    Advanced: "bg-red-100 text-red-700 border border-red-300",
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white text-gray-900">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="animate-in fade-in duration-500">
          <button
            onClick={() => router.back()}
            className="text-blue-600 hover:text-orange-500 mb-6 font-semibold transition"
          >
            ← Back
          </button>

          {/* Project Card */}
          <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition mb-10">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div
                  className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mb-4 ${difficultyColors[project.difficulty]}`}
                >
                  {project.difficulty}
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent mb-3">
                  {project.name}
                </h1>
                <p className="text-gray-600 text-lg leading-relaxed">{project.description}</p>
              </div>
              {isComplete && (
                <span className="text-4xl text-green-500" title="Project Completed">
                  ✓
                </span>
              )}
            </div>

            {/* Learning Objectives */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Learning Objectives</h2>
              <ul className="space-y-2">
                {project.objectives.map((obj, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-gray-700">
                    <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                    {obj}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Live Sensor Chart */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-md p-6 mb-10">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Live Sensor Data</h2>
            <SensorChart deviceId={project.deviceId} />
          </div>

          {/* Complete Button */}
          <button
            onClick={handleComplete}
            disabled={isComplete}
            className={`w-full py-4 rounded-lg font-bold text-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-md ${
              isComplete
                ? "bg-green-100 text-green-600 cursor-default border border-green-300"
                : "bg-gradient-to-r from-orange-500 to-blue-600 hover:from-orange-600 hover:to-blue-700 text-white"
            }`}
          >
            {isComplete ? "✓ Project Completed" : "Mark as Complete"}
          </button>
        </div>
      </main>

      {/* Decorative glowing background accents */}
      <div className="absolute -z-10 top-1/3 left-10 w-72 h-72 bg-gradient-to-br from-blue-300 to-cyan-200 rounded-full blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute -z-10 bottom-10 right-10 w-80 h-80 bg-gradient-to-br from-orange-300 to-pink-200 rounded-full blur-3xl opacity-30 animate-pulse delay-700"></div>
    </div>
  )
}
