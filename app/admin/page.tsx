"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { authUtils } from "@/lib/auth"
import { storageUtils } from "@/lib/localStorage"
import { progressUtils } from "@/lib/progress"
import type { Project, User } from "@/lib/types"
import Header from "@/components/Header"
import ProjectCard from "@/components/admin/project-card"
import AddProjectForm from "@/components/admin/add-project-form"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Settings, Package, BarChart3 } from "lucide-react"

export default function AdminPage() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedUserId, setSelectedUserId] = useState<string>("")
  const [activeTab, setActiveTab] = useState("projects")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    if (!authUtils.isAdmin()) {
      router.push("/dashboard")
      return
    }

    authUtils.initializeUsers()
    const allUsers = storageUtils.getUsers()
    const allProjects = storageUtils.getProjects()

    setUsers(allUsers)
    setProjects(allProjects)
    if (allUsers.length > 0) {
      setSelectedUserId(allUsers[0].id)
    }
  }, [router])

  const handleAddProject = (newProject: Project) => {
    const updated = [...projects, newProject]
    setProjects(updated)
    storageUtils.setProjects(updated)
  }

  const handleUpdateProject = (updatedProject: Project) => {
    const updated = projects.map((p) => (p.id === updatedProject.id ? updatedProject : p))
    setProjects(updated)
    storageUtils.setProjects(updated)
  }

  const handleDeleteProject = (projectId: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      const updated = projects.filter((p) => p.id !== projectId)
      setProjects(updated)
      storageUtils.setProjects(updated)
    }
  }

  const toggleProjectHidden = (projectId: string) => {
    const updated = projects.map((p) => (p.id === projectId ? { ...p, hidden: !p.hidden } : p))
    setProjects(updated)
    storageUtils.setProjects(updated)
  }

  const forceUnlockSection = (userId: string, sectionNum: number) => {
    const progress = storageUtils.getProgress(userId)
    progress.unlockedSections.add(sectionNum)
    storageUtils.setProgress(userId, progress)
  }

  const resetUserProgress = (userId: string) => {
    progressUtils.resetProgress(userId)
  }

  const filteredProjects = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const stats = {
    totalProjects: projects.length,
    totalUsers: users.length,
    hiddenProjects: projects.filter((p) => p.hidden).length,
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-10">
        <div className="animate-in fade-in duration-500 space-y-6">
          {/* Header Section */}
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Manage projects, users, and system configuration</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-6 bg-white border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Projects</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalProjects}</p>
                </div>
                <Package size={32} className="text-blue-500" />
              </div>
            </Card>

            <Card className="p-6 bg-white border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Users</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
                </div>
                <Users size={32} className="text-emerald-500" />
              </div>
            </Card>

            <Card className="p-6 bg-white border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Hidden Projects</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.hiddenProjects}</p>
                </div>
                <Settings size={32} className="text-amber-500" />
              </div>
            </Card>
          </div>

          {/* Tabs Section */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="border border-gray-200 rounded-lg bg-white">
            <TabsList className="border-b border-gray-200 bg-gray-50 p-0 h-auto rounded-none">
              <TabsTrigger
                value="projects"
                className="data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none px-6 py-4 text-gray-700 data-[state=active]:text-blue-600 border-0"
              >
                <Package size={18} className="mr-2" />
                Projects
              </TabsTrigger>
              <TabsTrigger
                value="users"
                className="data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none px-6 py-4 text-gray-700 data-[state=active]:text-blue-600 border-0"
              >
                <Users size={18} className="mr-2" />
                Users
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className="data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none px-6 py-4 text-gray-700 data-[state=active]:text-blue-600 border-0"
              >
                <BarChart3 size={18} className="mr-2" />
                Analytics
              </TabsTrigger>
            </TabsList>

            {/* Projects Tab */}
            <TabsContent value="projects" className="p-6 space-y-6">
              <AddProjectForm onAdd={handleAddProject} />

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Search Projects</label>
                <Input
                  type="text"
                  placeholder="Search by name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-md bg-gray-50 border-gray-300"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filteredProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onUpdate={handleUpdateProject}
                    onDelete={handleDeleteProject}
                  />
                ))}
              </div>

              {filteredProjects.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">No projects found</p>
                </div>
              )}
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users" className="p-6 space-y-6">
              <Card className="p-6 bg-white border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-6">User Progress Management</h2>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Select User</label>
                    <select
                      value={selectedUserId}
                      onChange={(e) => setSelectedUserId(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {users.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.name} ({user.email})
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedUserId && (
                    <>
                      <div className="pt-4 border-t border-gray-200">
                        <p className="text-sm font-medium text-gray-700 mb-3">Force Unlock Section</p>
                        <div className="grid grid-cols-3 gap-2">
                          {[1, 2, 3].map((section) => (
                            <Button
                              key={section}
                              onClick={() => forceUnlockSection(selectedUserId, section)}
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              Unlock S{section}
                            </Button>
                          ))}
                        </div>
                      </div>

                      <Button
                        onClick={() => resetUserProgress(selectedUserId)}
                        className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white"
                      >
                        Reset All Progress
                      </Button>
                    </>
                  )}
                </div>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="p-6 space-y-6">
              <Card className="p-6 bg-white border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-6">System Overview</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-4">Projects by Difficulty</h3>
                    <div className="space-y-2">
                      {["Easy", "Intermediate", "Advanced"].map((diff) => {
                        const count = projects.filter((p) => p.difficulty === diff).length
                        return (
                          <div key={diff} className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">{diff}</span>
                            <span className="text-sm font-bold text-gray-900">{count}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-4">Projects by Section</h3>
                    <div className="space-y-2">
                      {[1, 2, 3].map((section) => {
                        const count = projects.filter((p) => p.section === section).length
                        return (
                          <div key={section} className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Section {section}</span>
                            <span className="text-sm font-bold text-gray-900">{count}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
