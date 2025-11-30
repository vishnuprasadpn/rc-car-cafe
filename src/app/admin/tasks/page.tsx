"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { CheckSquare, ArrowLeft, Plus, Filter, MoreVertical } from "lucide-react"
import Navigation from "@/components/navigation"

interface Task {
  id: string
  title: string
  description: string
  status: string
  priority: string
  assignedTo: string
  dueDate: string
  createdAt: string
}

export default function TasksPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    } else if (status === "authenticated" && (session?.user as { role?: string })?.role !== "ADMIN") {
      router.push("/dashboard")
    } else if (status === "authenticated") {
      fetchTasks()
    }
  }, [status, session, router, statusFilter, priorityFilter])

  const fetchTasks = async () => {
    try {
      // Simulate API call - replace with actual API endpoint
      setLoading(false)
      setTasks([])
    } catch (error) {
      console.error("Error fetching tasks:", error)
      setLoading(false)
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-black to-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-fury-orange"></div>
          <p className="mt-4 text-gray-300">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session || !session.user || (session.user as { role?: string }).role !== "ADMIN") {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900">
      <Navigation />

      <div className="max-w-7xl mx-auto pt-20 py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <Link
              href="/admin"
              className="inline-flex items-center text-gray-400 hover:text-fury-orange mb-4 transition-colors text-sm"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-xl sm:text-3xl font-bold text-white flex items-center">
                  <CheckSquare className="h-6 w-6 sm:h-8 sm:w-8 text-fury-orange mr-2 sm:mr-3" />
                  Tasks
                </h1>
                <p className="text-xs sm:text-sm text-gray-400 mt-2">Manage and track tasks</p>
              </div>
              <button className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-lg hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-fury-orange/50 transition-all text-sm font-medium">
                <Plus className="h-4 w-4 mr-2" />
                New Task
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl mb-6">
            <div className="px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                    <Filter className="h-4 w-4 mr-2 text-fury-orange" />
                    Status
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-fury-orange/50 focus:border-fury-orange/50 transition-all text-sm"
                  >
                    <option value="all" className="bg-gray-900">All Status</option>
                    <option value="pending" className="bg-gray-900">Pending</option>
                    <option value="in-progress" className="bg-gray-900">In Progress</option>
                    <option value="completed" className="bg-gray-900">Completed</option>
                    <option value="cancelled" className="bg-gray-900">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                    <Filter className="h-4 w-4 mr-2 text-fury-orange" />
                    Priority
                  </label>
                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-fury-orange/50 focus:border-fury-orange/50 transition-all text-sm"
                  >
                    <option value="all" className="bg-gray-900">All Priorities</option>
                    <option value="low" className="bg-gray-900">Low</option>
                    <option value="medium" className="bg-gray-900">Medium</option>
                    <option value="high" className="bg-gray-900">High</option>
                    <option value="urgent" className="bg-gray-900">Urgent</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={fetchTasks}
                    className="w-full bg-white/20 backdrop-blur-sm border border-white/30 text-white px-4 py-2.5 rounded-lg hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-fury-orange/50 transition-all text-sm font-medium"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Tasks List */}
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl">
            <div className="px-4 py-5 sm:p-6">
              {tasks.length === 0 ? (
                <div className="text-center py-12">
                  <CheckSquare className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-300">No tasks found</h3>
                  <p className="mt-1 text-sm text-gray-500">Create your first task to get started</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-base font-medium text-white">{task.title}</h3>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              task.priority === 'urgent' 
                                ? 'bg-red-500/20 text-red-400'
                                : task.priority === 'high'
                                ? 'bg-orange-500/20 text-orange-400'
                                : task.priority === 'medium'
                                ? 'bg-yellow-500/20 text-yellow-400'
                                : 'bg-blue-500/20 text-blue-400'
                            }`}>
                              {task.priority}
                            </span>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              task.status === 'completed' 
                                ? 'bg-green-500/20 text-green-400'
                                : task.status === 'in-progress'
                                ? 'bg-blue-500/20 text-blue-400'
                                : 'bg-gray-500/20 text-gray-400'
                            }`}>
                              {task.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-300 mb-2">{task.description}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-400">
                            <span>Assigned to: {task.assignedTo}</span>
                            <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all">
                            <MoreVertical className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

