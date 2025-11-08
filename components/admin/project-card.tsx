"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import type { Project } from "@/lib/types"
import { Copy, Eye, EyeOff, Trash2, Edit2, CheckCircle, XCircle } from "lucide-react"

interface ProjectCardProps {
  project: Project
  onUpdate: (project: Project) => void
  onDelete: (projectId: string) => void
}

export default function ProjectCard({ project, onUpdate, onDelete }: ProjectCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState(project)
  const [copiedKey, setCopiedKey] = useState(false)

  const handleCopyApiKey = () => {
    if (editData.apiKey) {
      navigator.clipboard.writeText(editData.apiKey)
      setCopiedKey(true)
      setTimeout(() => setCopiedKey(false), 2000)
    }
  }

  const handleSave = () => {
    onUpdate(editData)
    setIsEditing(false)
  }

  const generateApiKey = () => {
    const key = `sk_${Math.random().toString(36).substring(2, 15)}_${Math.random().toString(36).substring(2, 15)}`
    setEditData({ ...editData, apiKey: key })
  }

  const difficultyColors = {
    Easy: "bg-emerald-500/10 border-emerald-500/30 text-emerald-600",
    Intermediate: "bg-amber-500/10 border-amber-500/30 text-amber-600",
    Advanced: "bg-red-500/10 border-red-500/30 text-red-600",
  }

  return (
    <Card className="p-6 bg-white border-gray-200 hover:shadow-md transition-shadow">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {isEditing ? (
              <Input
                value={editData.name}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                placeholder="Project name"
                className="text-lg font-bold mb-2 bg-gray-50 border-gray-300"
              />
            ) : (
              <h3 className="text-lg font-bold text-gray-900">{project.name}</h3>
            )}
            <div className="flex gap-2 items-center mt-2">
              <span
                className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${difficultyColors[project.difficulty]}`}
              >
                {project.difficulty}
              </span>
              <span className="text-xs text-gray-500">Section {project.section}</span>
            </div>
          </div>
          <button
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            className={`p-2 rounded-lg transition ${isEditing ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
          >
            {isEditing ? <CheckCircle size={18} /> : <Edit2 size={18} />}
          </button>
        </div>

        {/* Description */}
        {isEditing ? (
          <Input
            value={editData.description}
            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
            placeholder="Project description"
            className="text-sm bg-gray-50 border-gray-300"
          />
        ) : (
          <p className="text-sm text-gray-600">{project.description}</p>
        )}

        {/* API Key Section */}
        <div className="border-t pt-4 border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-semibold text-gray-700">API Key</label>
            <button
              onClick={() => setEditData({ ...editData, apiKeyVisible: !editData.apiKeyVisible })}
              className="p-1 hover:bg-gray-100 rounded transition"
            >
              {editData.apiKeyVisible ? (
                <Eye size={16} className="text-gray-600" />
              ) : (
                <EyeOff size={16} className="text-gray-600" />
              )}
            </button>
          </div>

          {isEditing ? (
            <div className="space-y-2">
              <div className="flex gap-2">
                {editData.apiKey ? (
                  <Input
                    value={editData.apiKeyVisible ? editData.apiKey : `${"•".repeat(editData.apiKey.length)}`}
                    readOnly
                    className="text-xs font-mono bg-gray-50 border-gray-300"
                  />
                ) : (
                  <span className="text-sm text-gray-500">No API key generated</span>
                )}
                <Button
                  onClick={handleCopyApiKey}
                  variant="outline"
                  size="sm"
                  className="border-gray-300 bg-transparent"
                >
                  <Copy size={14} />
                </Button>
              </div>
              <Button
                onClick={generateApiKey}
                variant="outline"
                size="sm"
                className="w-full border-gray-300 text-gray-700 bg-transparent"
              >
                {editData.apiKey ? "Regenerate" : "Generate"} API Key
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded border border-gray-200">
              <code className="text-xs font-mono text-gray-600 flex-1">
                {editData.apiKey
                  ? editData.apiKeyVisible
                    ? editData.apiKey
                    : `${"•".repeat(editData.apiKey.length)}`
                  : "No API key"}
              </code>
              {editData.apiKey && (
                <Copy
                  size={14}
                  className="text-gray-400 cursor-pointer hover:text-gray-600"
                  onClick={handleCopyApiKey}
                />
              )}
            </div>
          )}
        </div>

        {/* API Endpoint Section */}
        <div className="border-t pt-4 border-gray-200">
          <label className="text-sm font-semibold text-gray-700 mb-2 block">API Endpoint</label>
          {isEditing ? (
            <Input
              value={editData.apiEndpoint || ""}
              onChange={(e) => setEditData({ ...editData, apiEndpoint: e.target.value })}
              placeholder="https://api.example.com/v1"
              className="text-sm bg-gray-50 border-gray-300"
            />
          ) : (
            <p className="text-sm text-gray-600 font-mono">{editData.apiEndpoint || "Not configured"}</p>
          )}
        </div>

        {/* API Config Section */}
        {isEditing && (
          <div className="border-t pt-4 border-gray-200 space-y-3">
            <label className="text-sm font-semibold text-gray-700 block">API Configuration</label>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-gray-600 block mb-1">Rate Limit</label>
                <Input
                  type="number"
                  value={editData.apiConfig?.rateLimit || 100}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      apiConfig: {
                        ...editData.apiConfig,
                        rateLimit: Number.parseInt(e.target.value),
                        timeout: editData.apiConfig?.timeout || 30,
                        retries: editData.apiConfig?.retries || 3,
                      },
                    })
                  }
                  className="text-sm bg-gray-50 border-gray-300"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 block mb-1">Timeout (ms)</label>
                <Input
                  type="number"
                  value={editData.apiConfig?.timeout || 30}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      apiConfig: {
                        ...editData.apiConfig,
                        timeout: Number.parseInt(e.target.value),
                        rateLimit: editData.apiConfig?.rateLimit || 100,
                        retries: editData.apiConfig?.retries || 3,
                      },
                    })
                  }
                  className="text-sm bg-gray-50 border-gray-300"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 block mb-1">Retries</label>
                <Input
                  type="number"
                  value={editData.apiConfig?.retries || 3}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      apiConfig: {
                        ...editData.apiConfig,
                        retries: Number.parseInt(e.target.value),
                        rateLimit: editData.apiConfig?.rateLimit || 100,
                        timeout: editData.apiConfig?.timeout || 30,
                      },
                    })
                  }
                  className="text-sm bg-gray-50 border-gray-300"
                />
              </div>
            </div>
          </div>
        )}

        {/* Status & Actions */}
        <div className="border-t pt-4 border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {project.hidden ? (
              <XCircle size={16} className="text-gray-400" />
            ) : (
              <CheckCircle size={16} className="text-emerald-500" />
            )}
            <span className="text-xs text-gray-600">{project.hidden ? "Hidden" : "Visible"}</span>
          </div>
          <div className="flex gap-2">
            {isEditing && (
              <Button
                onClick={() => setIsEditing(false)}
                variant="outline"
                size="sm"
                className="border-gray-300 text-gray-700"
              >
                <XCircle size={14} />
                Cancel
              </Button>
            )}
            <Button
              onClick={() => onDelete(project.id)}
              variant="destructive"
              size="sm"
              className="bg-red-500 hover:bg-red-600"
            >
              <Trash2 size={14} />
              Delete
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
