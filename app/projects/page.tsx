"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { authUtils } from "@/lib/auth"
import { storageUtils } from "@/lib/localStorage"
import type { Project } from "@/lib/types"
import Header from "@/components/Header"
import SectionCard from "@/components/SectionCard"

export default function ProjectsPage() {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [unlockedSections, setUnlockedSections] = useState<Set<number>>(new Set())

  useEffect(() => {
    const user = authUtils.getCurrentUser()
    if (!user) {
      router.push("/auth/login")
      return
    }

    const allProjects = storageUtils.getProjects().filter((p) => !p.hidden)
    setProjects(allProjects)

    const progress = storageUtils.getProgress(user.id)
    setUnlockedSections(progress.unlockedSections)
  }, [router])

  const groupedBySection = projects.reduce(
    (acc, project) => {
      const section = project.section
      if (!acc[section]) {
        acc[section] = []
      }
      acc[section].push(project)
      return acc
    },
    {} as Record<number, Project[]>,
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white text-gray-900">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="animate-in fade-in duration-500">
          {/* Title Section */}
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
            All Projects
          </h1>
          <p className="text-gray-600 mb-10">
            Complete projects in each section to unlock new learning levels and challenges.
          </p>

          {/* Section Cards */}
          <div className="space-y-10">
            {[1, 2, 3].map((sectionNum) => (
              <div
                key={sectionNum}
                className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all p-6"
              >
                <SectionCard
                  sectionNum={sectionNum}
                  projects={groupedBySection[sectionNum] || []}
                  isUnlocked={unlockedSections.has(sectionNum)}
                />
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Decorative gradient glows */}
      <div className="absolute -z-10 top-1/3 left-10 w-72 h-72 bg-gradient-to-br from-blue-300 to-cyan-200 rounded-full blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute -z-10 bottom-10 right-10 w-80 h-80 bg-gradient-to-br from-orange-300 to-pink-200 rounded-full blur-3xl opacity-30 animate-pulse delay-700"></div>
    </div>
  )
}
