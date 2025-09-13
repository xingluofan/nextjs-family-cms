"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MenuFormData } from "@/lib/types/menu"

export default function MenuUploadPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<MenuFormData>({
    name: "",
    description: "",
    ingredients: [""],
    cookingSteps: [""],
    image: null,
    preparationTime: 30,
    difficulty: "medium",
  })

  const handleIngredientChange = (index: number, value: string) => {
    const newIngredients = [...formData.ingredients]
    newIngredients[index] = value
    setFormData({ ...formData, ingredients: newIngredients })
  }

  const handleStepChange = (index: number, value: string) => {
    const newSteps = [...formData.cookingSteps]
    newSteps[index] = value
    setFormData({ ...formData, cookingSteps: newSteps })
  }

  const addIngredient = () => {
    setFormData({
      ...formData,
      ingredients: [...formData.ingredients, ""],
    })
  }

  const addStep = () => {
    setFormData({
      ...formData,
      cookingSteps: [...formData.cookingSteps, ""],
    })
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData({ ...formData, image: file })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formDataToSend = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "ingredients" || key === "cookingSteps") {
          formDataToSend.append(key, JSON.stringify(value))
        } else if (key === "image" && value) {
          formDataToSend.append(key, value)
        } else {
          formDataToSend.append(key, String(value))
        }
      })

      const response = await fetch("/api/menu", {
        method: "POST",
        body: formDataToSend,
      })

      if (!response.ok) {
        throw new Error("Failed to upload menu")
      }

      router.push("/menu/list")
    } catch (error) {
      console.error("Error uploading menu:", error)
      alert("上传失败，请重试")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">上传新菜单</h1>
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            菜品名称
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            描述
          </label>
          <textarea
            required
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            食材
          </label>
          {formData.ingredients.map((ingredient, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                required
                value={ingredient}
                onChange={(e) => handleIngredientChange(index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={`食材 ${index + 1}`}
              />
            </div>
          ))}
          <button
            type="button"
            onClick={addIngredient}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            + 添加食材
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            烹饪步骤
          </label>
          {formData.cookingSteps.map((step, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                required
                value={step}
                onChange={(e) => handleStepChange(index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={`步骤 ${index + 1}`}
              />
            </div>
          ))}
          <button
            type="button"
            onClick={addStep}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            + 添加步骤
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            图片
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            准备时间（分钟）
          </label>
          <input
            type="number"
            required
            min="1"
            value={formData.preparationTime}
            onChange={(e) =>
              setFormData({
                ...formData,
                preparationTime: parseInt(e.target.value),
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            难度
          </label>
          <select
            value={formData.difficulty}
            onChange={(e) =>
              setFormData({
                ...formData,
                difficulty: e.target.value as "easy" | "medium" | "hard",
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="easy">简单</option>
            <option value="medium">中等</option>
            <option value="hard">困难</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "上传中..." : "上传菜单"}
        </button>
      </form>
    </div>
  )
}
