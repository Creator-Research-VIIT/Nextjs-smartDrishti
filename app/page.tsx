"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { authUtils } from "@/lib/auth"
import { storageUtils } from "@/lib/localStorage"
import { SAMPLE_PROJECTS } from "@/lib/seed-data"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

export default function Home() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    authUtils.initializeUsers()
    if (storageUtils.getProjects().length === 0) {
      storageUtils.setProjects(SAMPLE_PROJECTS)
    }
    setIsLoading(false)

    if (authUtils.isAuthenticated()) {
      router.push("/dashboard")
    }
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white flex items-center justify-center">
        <div className="h-14 w-14 border-4 border-t-transparent border-orange-500 rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white text-gray-900 flex flex-col overflow-hidden">
      <Header />

      {/* Main Section */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-6xl mx-auto text-center py-24">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-orange-500 via-pink-500 to-blue-500 bg-clip-text text-transparent leading-tight drop-shadow-[0_0_20px_rgba(255,115,0,0.2)]">
              Learn IoT Development the Smart Way
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              Build your IoT skills through hands-on projects — from basic sensors to connected smart systems.
            </p>
          </motion.div>

          {/* Call to Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="flex flex-col sm:flex-row gap-5 justify-center mb-20"
          >
            <button
              onClick={() => router.push("/auth/login")}
              className="relative group px-8 py-3 font-semibold rounded-lg text-lg overflow-hidden transition-all duration-300 
              bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
            >
              <span className="relative z-10">🚀 Get Started</span>
              <span className="absolute inset-0 bg-gradient-to-r from-pink-600 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </button>

            <button
              onClick={() => router.push("/projects")}
              className="relative group px-8 py-3 font-semibold rounded-lg text-lg border-2 border-blue-500 text-blue-600 hover:text-white transition-all hover:scale-105 hover:shadow-md overflow-hidden"
            >
              <span className="relative z-10">📁 View Projects</span>
              <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </button>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12"
          >
            {[
              { number: "50+", label: "Hands-on Projects" },
              { number: "3", label: "Skill Levels" },
              { number: "∞", label: "Learning Potential" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="relative bg-white/80 backdrop-blur-md p-8 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-all"></div>
                <div className="text-4xl font-bold text-orange-500 mb-2">{stat.number}</div>
                <div className="text-gray-700 text-lg">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </main>

      {/* Floating Light Gradients */}
      <div className="absolute -z-10 top-1/3 left-10 w-72 h-72 bg-gradient-to-br from-blue-300 to-cyan-200 rounded-full blur-3xl opacity-40 animate-pulse"></div>
      <div className="absolute -z-10 bottom-10 right-10 w-80 h-80 bg-gradient-to-br from-orange-300 to-pink-200 rounded-full blur-3xl opacity-40 animate-pulse delay-700"></div>

      <Footer />
    </div>
  )
}
