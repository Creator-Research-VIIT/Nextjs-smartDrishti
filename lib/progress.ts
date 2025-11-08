import { storageUtils } from "./localStorage"

export const progressUtils = {
  completeProject: (userId: string, projectId: string) => {
    const progress = storageUtils.getProgress(userId)
    progress.completedProjects.add(projectId)
    storageUtils.setProgress(userId, progress)
    return progressUtils.checkSectionCompletion(userId)
  },

  isProjectComplete: (userId: string, projectId: string): boolean => {
    const progress = storageUtils.getProgress(userId)
    return progress.completedProjects.has(projectId)
  },

  checkSectionCompletion: (userId: string): number | null => {
    const progress = storageUtils.getProgress(userId)
    const projects = storageUtils.getProjects()

    // Get all sections ordered by difficulty
    const sections = new Map<number, { difficulty: string; projects: string[] }>()
    projects.forEach((p) => {
      if (!sections.has(p.section)) {
        sections.set(p.section, { difficulty: p.difficulty, projects: [] })
      }
      sections.get(p.section)!.projects.push(p.id)
    })

    // Check if any new section should be unlocked
    for (let sectionNum = 1; sectionNum <= 3; sectionNum++) {
      if (progress.unlockedSections.has(sectionNum) || sectionNum === 1) continue

      // Check if previous section is complete
      const prevSection = sections.get(sectionNum - 1)
      if (prevSection) {
        const allComplete = prevSection.projects.every((pid) => progress.completedProjects.has(pid))

        if (allComplete) {
          progress.unlockedSections.add(sectionNum)
          storageUtils.setProgress(userId, progress)
          return sectionNum
        }
      }
    }

    return null
  },

  getSectionProgress: (userId: string, sectionNum: number): { completed: number; total: number } => {
    const progress = storageUtils.getProgress(userId)
    const projects = storageUtils.getProjects().filter((p) => p.section === sectionNum && !p.hidden)
    const completed = projects.filter((p) => progress.completedProjects.has(p.id)).length

    return { completed, total: projects.length }
  },

  getOverallProgress: (userId: string): { completed: number; total: number } => {
    const progress = storageUtils.getProgress(userId)
    const projects = storageUtils.getProjects().filter((p) => !p.hidden)
    const completed = projects.filter((p) => progress.completedProjects.has(p.id)).length

    return { completed, total: projects.length }
  },

  resetProgress: (userId: string) => {
    const progress = storageUtils.getProgress(userId)
    progress.completedProjects.clear()
    progress.unlockedSections.clear()
    progress.unlockedSections.add(1)
    storageUtils.setProgress(userId, progress)
  },
}
