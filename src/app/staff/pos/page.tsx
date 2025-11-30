"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { ShoppingCart, Search, Plus, Minus, Trash2, CreditCard, X } from "lucide-react"
import Navigation from "@/components/navigation"

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
}

export default function POSPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [cart, setCart] = useState<CartItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [products] = useState([
    { id: "1", name: "Racing Session - 20 min", price: 500 },
    { id: "2", name: "Racing Session - 40 min", price: 900 },
    { id: "3", name: "Racing Session - 60 min", price: 1200 },
    { id: "4", name: "Extra Player", price: 200 },
    { id: "5", name: "Equipment Rental", price: 150 },
  ])

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    } else if (status === "authenticated" && (session?.user as { role?: string })?.role !== "STAFF") {
      router.push("/dashboard")
    }
  }, [status, session, router])

  const addToCart = (product: { id: string; name: string; price: number }) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id)
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev =>
      prev.map(item => {
        if (item.id === id) {
          const newQuantity = item.quantity + delta
          if (newQuantity <= 0) return null
          return { ...item, quantity: newQuantity }
        }
        return item
      }).filter(Boolean) as CartItem[]
    )
  }

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id))
  }

  const getTotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-black to-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-fury-orange"></div>
          <p className="mt-4 text-gray-300">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session || !session.user || (session.user as { role?: string }).role !== "STAFF") {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900">
      <Navigation />

      <div className="max-w-7xl mx-auto pt-20 py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <h1 className="text-xl sm:text-3xl font-bold text-white flex items-center">
              <ShoppingCart className="h-6 w-6 sm:h-8 sm:w-8 text-fury-orange mr-2 sm:mr-3" />
              Point of Sale
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-2">Process customer transactions</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Products Section */}
            <div className="lg:col-span-2">
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl">
                <div className="px-4 py-5 sm:p-6">
                  {/* Search */}
                  <div className="mb-6">
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-fury-orange/50 focus:border-fury-orange/50 text-white placeholder-gray-400 transition-all text-sm"
                      />
                    </div>
                  </div>

                  {/* Products Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {filteredProducts.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => addToCart(product)}
                        className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 hover:border-white/20 transition-all text-left"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-sm font-medium text-white">{product.name}</h3>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-base font-semibold text-fury-orange">₹{product.price}</span>
                          <Plus className="h-4 w-4 text-gray-400" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Cart Section */}
            <div className="lg:col-span-1">
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl sticky top-24">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-white flex items-center">
                      <ShoppingCart className="h-5 w-5 mr-2 text-fury-orange" />
                      Cart
                    </h2>
                    {cart.length > 0 && (
                      <button
                        onClick={() => setCart([])}
                        className="text-xs text-gray-400 hover:text-white transition-colors"
                      >
                        Clear All
                      </button>
                    )}
                  </div>

                  {cart.length === 0 ? (
                    <div className="text-center py-12">
                      <ShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-400">Cart is empty</p>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
                        {cart.map((item) => (
                          <div
                            key={item.id}
                            className="bg-white/5 border border-white/10 rounded-lg p-3"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex-1">
                                <h3 className="text-sm font-medium text-white">{item.name}</h3>
                                <p className="text-xs text-gray-400 mt-1">₹{item.price} each</p>
                              </div>
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="text-gray-400 hover:text-red-400 transition-colors"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => updateQuantity(item.id, -1)}
                                  className="w-7 h-7 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded border border-white/20 transition-all"
                                >
                                  <Minus className="h-3 w-3 text-white" />
                                </button>
                                <span className="text-sm font-medium text-white w-8 text-center">{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item.id, 1)}
                                  className="w-7 h-7 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded border border-white/20 transition-all"
                                >
                                  <Plus className="h-3 w-3 text-white" />
                                </button>
                              </div>
                              <span className="text-sm font-semibold text-white">
                                ₹{(item.price * item.quantity).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="border-t border-white/20 pt-4 space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-300">Subtotal</span>
                          <span className="text-base font-semibold text-white">₹{getTotal().toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-300">Tax (18%)</span>
                          <span className="text-base font-semibold text-white">₹{(getTotal() * 0.18).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-white/20">
                          <span className="text-base font-semibold text-white">Total</span>
                          <span className="text-xl font-bold text-fury-orange">₹{(getTotal() * 1.18).toLocaleString()}</span>
                        </div>

                        <button
                          disabled={cart.length === 0}
                          className="w-full bg-white/20 backdrop-blur-sm border border-white/30 text-white px-4 py-3 rounded-lg hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-fury-orange/50 transition-all text-sm font-medium flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <CreditCard className="h-4 w-4 mr-2" />
                          Process Payment
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

