"use client"

import { useRouter } from "next/navigation"
import type { Project } from "@/lib/types"

interface ProjectCardProps {
  project: Project
  index: number
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  const router = useRouter()

  const difficultyColors = {
    Easy: "bg-green-500/10 text-green-400",
    Intermediate: "bg-yellow-500/10 text-yellow-400",
    Advanced: "bg-red-500/10 text-red-400",
  }

  return (
    <div
      className="bg-slate-900 p-6 rounded-lg border border-slate-800 hover:border-orange-500 cursor-pointer transition hover:shadow-lg hover:scale-105 animate-in fade-in duration-500"
      style={{ animationDelay: `${index * 50}ms` }}
      onClick={() => router.push(`/projects/${project.section}/${project.id}`)}
    >
      <div
        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 ${difficultyColors[project.difficulty]}`}
      >
        {project.difficulty}
      </div>

      <h3 className="text-lg font-bold mb-2">{project.name}</h3>
      <p className="text-sm text-slate-400 mb-4">{project.description}</p>

      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-400">Section {project.section}</span>
        <span className="text-orange-500">→</span>
      </div>
    </div>
  )
}
