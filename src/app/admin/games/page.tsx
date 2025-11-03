"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Plus, Edit, Trash2 } from "lucide-react"
import Link from "next/link"

const gameSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  duration: z.number().min(1, "Duration must be at least 1 minute"),
  price: z.number().min(0, "Price must be non-negative"),
  maxPlayers: z.number().min(1).max(4, "Max players must be between 1 and 4"),
})

type GameForm = z.infer<typeof gameSchema>

interface Game {
  id: string
  name: string
  description: string | null
  duration: number
  price: number
  maxPlayers: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export default function AdminGamesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingGame, setEditingGame] = useState<Game | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<GameForm>({
    resolver: zodResolver(gameSchema),
  })

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    } else if (status === "authenticated" && (session?.user as { role?: string })?.role !== "ADMIN") {
      router.push("/dashboard")
    } else if (status === "authenticated") {
      fetchGames()
    }
  }, [status, session, router])

  const fetchGames = async () => {
    try {
      const response = await fetch("/api/admin/games")
      if (response.ok) {
        const data = await response.json()
        setGames(data.games)
      }
    } catch (_error) {
      console.error("Error fetching games:", _error)
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: GameForm) => {
    setSubmitting(true)
    setError("")

    try {
      const url = editingGame ? `/api/admin/games/${editingGame.id}` : "/api/admin/games"
      const method = editingGame ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        await fetchGames()
        setShowForm(false)
        setEditingGame(null)
        reset()
      } else {
        const errorData = await response.json()
        setError(errorData.message || "Failed to save game")
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (game: Game) => {
    setEditingGame(game)
    reset({
      name: game.name,
      description: game.description || "",
      duration: game.duration,
      price: game.price,
      maxPlayers: game.maxPlayers,
    })
    setShowForm(true)
  }

  const handleDelete = async (gameId: string) => {
    if (!confirm("Are you sure you want to delete this game?")) return

    try {
      const response = await fetch(`/api/admin/games/${gameId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await fetchGames()
      } else {
        const errorData = await response.json()
        setError(errorData.message || "Failed to delete game")
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
    }
  }

  const handleToggleActive = async (gameId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/games/${gameId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive: !isActive }),
      })

      if (response.ok) {
        await fetchGames()
      } else {
        const errorData = await response.json()
        setError(errorData.message || "Failed to update game")
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session || !session.user || (session.user as { role?: string }).role !== "ADMIN") {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Fury Road RC Club - Admin</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/admin"
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                ← Back to Dashboard
              </Link>
              <span className="text-sm text-gray-700">Welcome, {session.user.name}</span>
              <button
                onClick={() => router.push("/api/auth/signout")}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto pt-20 py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Manage Games</h2>
            <button
              onClick={() => {
                setShowForm(true)
                setEditingGame(null)
                reset()
              }}
              className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-semibold rounded-lg text-white bg-fury-orange hover:bg-primary-600 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Game
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {showForm && (
            <div className="bg-white shadow rounded-lg mb-6">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {editingGame ? "Edit Game" : "Add New Game"}
                </h3>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Game Name
                      </label>
                      <input
                        {...register("name")}
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Enter game name"
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Duration (minutes)
                      </label>
                      <input
                        {...register("duration", { valueAsNumber: true })}
                        type="number"
                        min="1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="20"
                      />
                      {errors.duration && (
                        <p className="mt-1 text-sm text-red-600">{errors.duration.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price (₹)
                      </label>
                      <input
                        {...register("price", { valueAsNumber: true })}
                        type="number"
                        min="0"
                        step="0.01"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="500"
                      />
                      {errors.price && (
                        <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Max Players
                      </label>
                      <select
                        {...register("maxPlayers", { valueAsNumber: true })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value={1}>1 Player</option>
                        <option value={2}>2 Players</option>
                        <option value={3}>3 Players</option>
                        <option value={4}>4 Players</option>
                      </select>
                      {errors.maxPlayers && (
                        <p className="mt-1 text-sm text-red-600">{errors.maxPlayers.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      {...register("description")}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Enter game description"
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                    )}
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(false)
                        setEditingGame(null)
                        reset()
                      }}
                      className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-5 py-2.5 bg-fury-orange text-white rounded-lg text-sm font-semibold hover:bg-primary-600 disabled:opacity-50 transition-colors"
                    >
                      {submitting ? "Saving..." : editingGame ? "Update Game" : "Create Game"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Games List</h3>
              {games.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No games found</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Duration
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Max Players
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {games.map((game) => (
                        <tr key={game.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {game.name}
                              </div>
                              {game.description && (
                                <div className="text-sm text-gray-500">
                                  {game.description}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {game.duration} min
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ₹{game.price}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {game.maxPlayers}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              game.isActive 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {game.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            <button
                              onClick={() => handleEdit(game)}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleToggleActive(game.id, game.isActive)}
                              className="text-yellow-600 hover:text-yellow-900"
                            >
                              {game.isActive ? 'Deactivate' : 'Activate'}
                            </button>
                            <button
                              onClick={() => handleDelete(game.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
