"use client"

import type { Project } from "@/lib/types"
import ProjectCard from "./ProjectCard"

interface SectionCardProps {
  sectionNum: number
  projects: Project[]
  isUnlocked: boolean
}

const difficulties = ["Easy", "Intermediate", "Advanced"]

export default function SectionCard({ sectionNum, projects, isUnlocked }: SectionCardProps) {
  return (
    <div className="mb-12 animate-in fade-in duration-500" style={{ animationDelay: `${sectionNum * 100}ms` }}>
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-2xl font-bold">
          Section {sectionNum}: {difficulties[sectionNum - 1]}
        </h2>
        {!isUnlocked && <span className="text-2xl">🔒</span>}
      </div>

      {isUnlocked ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, idx) => (
            <ProjectCard key={project.id} project={project} index={idx} />
          ))}
        </div>
      ) : (
        <div className="bg-slate-900 p-12 rounded-lg border border-slate-800 text-center">
          <p className="text-slate-400">Complete all projects in Section {sectionNum - 1} to unlock this section.</p>
        </div>
      )}
    </div>
  )
}
