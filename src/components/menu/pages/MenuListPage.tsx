"use client"

import { useState, useEffect } from "react"
import { MenuItem } from "@/lib/types/menu"

export default function MenuListPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch("/api/menu")
        if (!response.ok) {
          throw new Error("Failed to fetch menu items")
        }
        const data = await response.json()
        setMenuItems(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchMenuItems()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">菜单列表</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div className="aspect-w-16 aspect-h-9">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{item.name}</h2>
              <p className="text-gray-600 mb-4 line-clamp-2">
                {item.description}
              </p>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>准备时间: {item.preparationTime}分钟</span>
                <span className="capitalize">
                  难度:{" "}
                  {
                    {
                      easy: "简单",
                      medium: "中等",
                      hard: "困难",
                    }[item.difficulty]
                  }
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
