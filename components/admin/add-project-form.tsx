"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import type { Project } from "@/lib/types"
import { Plus } from "lucide-react"

interface AddProjectFormProps {
  onAdd: (project: Project) => void
}

export default function AddProjectForm({ onAdd }: AddProjectFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState<Partial<Project>>({
    name: "",
    description: "",
    difficulty: "Easy",
    section: 1,
    sectionName: "Basics",
    deviceId: "",
    hidden: false,
    objectives: [],
  })

  const handleSubmit = () => {
    if (!formData.name || !formData.description) {
      alert("Please fill in all required fields")
      return
    }

    const newProject: Project = {
      id: `proj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: formData.name,
      description: formData.description,
      difficulty: formData.difficulty as "Easy" | "Intermediate" | "Advanced",
      section: formData.section || 1,
      sectionName: formData.sectionName || "Basics",
      deviceId: formData.deviceId || "",
      hidden: formData.hidden || false,
      objectives: formData.objectives || [],
      apiKey: undefined,
      apiKeyVisible: false,
    }

    onAdd(newProject)
    setFormData({
      name: "",
      description: "",
      difficulty: "Easy",
      section: 1,
      sectionName: "Basics",
      deviceId: "",
      hidden: false,
      objectives: [],
    })
    setIsOpen(false)
  }

  return (
    <>
      <Button onClick={() => setIsOpen(!isOpen)} className="bg-blue-600 hover:bg-blue-700 text-white gap-2 mb-4">
        <Plus size={18} />
        Add New Project
      </Button>

      {isOpen && (
        <Card className="p-6 bg-white border-gray-200 mb-4">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Create New Project</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Project Name *</label>
              <Input
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Temperature Sensor Reading"
                className="bg-gray-50 border-gray-300"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Description *</label>
              <Input
                value={formData.description || ""}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Project description"
                className="bg-gray-50 border-gray-300"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Difficulty</label>
                <select
                  value={formData.difficulty || "Easy"}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>Easy</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Section</label>
                <select
                  value={formData.section || 1}
                  onChange={(e) => setFormData({ ...formData, section: Number.parseInt(e.target.value) })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={1}>Section 1</option>
                  <option value={2}>Section 2</option>
                  <option value={3}>Section 3</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Device ID</label>
              <Input
                value={formData.deviceId || ""}
                onChange={(e) => setFormData({ ...formData, deviceId: e.target.value })}
                placeholder="e.g., DHT22_01"
                className="bg-gray-50 border-gray-300"
              />
            </div>

            <div className="flex gap-3">
              <Button onClick={handleSubmit} className="bg-emerald-600 hover:bg-emerald-700 text-white flex-1">
                Create Project
              </Button>
              <Button
                onClick={() => setIsOpen(false)}
                variant="outline"
                className="border-gray-300 text-gray-700 flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  )
}
