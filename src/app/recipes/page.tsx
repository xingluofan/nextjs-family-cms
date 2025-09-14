'use client';

import React, { useState } from 'react';
import { Tabs, message, Modal } from 'antd';
import { PlusOutlined, UnorderedListOutlined } from '@ant-design/icons';
import RecipeForm from '@/components/recipe/RecipeForm';
import RecipeList from '@/components/recipe/RecipeList';
import { CreateRecipeData, UpdateRecipeData, Recipe } from '@/lib/services/recipeService';

export default function RecipesPage() {
  const [activeTab, setActiveTab] = useState('list');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  // 创建菜品
  const handleCreateRecipe = async (data: CreateRecipeData) => {
    setFormLoading(true);
    try {
      const response = await fetch('/api/recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      
      if (result.success) {
        message.success('菜品创建成功！');
        setRefreshTrigger(prev => prev + 1);
        setActiveTab('list'); // 切换到列表页面
      } else {
        message.error(result.message || '创建失败');
      }
    } catch (error) {
      message.error('创建失败，请重试');
      console.error('创建菜品失败:', error);
    } finally {
      setFormLoading(false);
    }
  };

  // 更新菜品
  const handleUpdateRecipe = async (data: CreateRecipeData) => {
    if (!editingRecipe) return;
    
    setFormLoading(true);
    try {
      const updateData: UpdateRecipeData = {
        title: data.title,
        description: data.description,
        ingredients: data.ingredients,
        steps: data.steps,
        cookTime: data.cookTime,
        difficulty: data.difficulty,
        categories: data.categories,
        servings: data.servings,
      };

      const response = await fetch(`/api/recipes/${editingRecipe.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      const result = await response.json();
      
      if (result.success) {
        message.success('菜品更新成功！');
        setRefreshTrigger(prev => prev + 1);
        setIsEditModalVisible(false);
        setEditingRecipe(null);
      } else {
        message.error(result.message || '更新失败');
      }
    } catch (error) {
      message.error('更新失败，请重试');
      console.error('更新菜品失败:', error);
    } finally {
      setFormLoading(false);
    }
  };

  // 删除菜品
  const handleDeleteRecipe = async (id: number) => {
    try {
      const response = await fetch(`/api/recipes/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();
      
      if (result.success) {
        message.success('菜品删除成功！');
        setRefreshTrigger(prev => prev + 1);
      } else {
        message.error(result.message || '删除失败');
      }
    } catch (error) {
      message.error('删除失败，请重试');
      console.error('删除菜品失败:', error);
    }
  };

  // 编辑菜品
  const handleEditRecipe = (recipe: Recipe) => {
    setEditingRecipe(recipe);
    setIsEditModalVisible(true);
  };

  // 关闭编辑弹窗
  const handleCloseEditModal = () => {
    setIsEditModalVisible(false);
    setEditingRecipe(null);
  };

  const tabItems = [
    {
      key: 'list',
      label: (
        <span>
          <UnorderedListOutlined />
          菜品列表
        </span>
      ),
      children: (
        <RecipeList
          onEdit={handleEditRecipe}
          onDelete={handleDeleteRecipe}
          refreshTrigger={refreshTrigger}
        />
      ),
    },
    {
      key: 'add',
      label: (
        <span>
          <PlusOutlined />
          添加菜品
        </span>
      ),
      children: (
        <div className="max-w-4xl mx-auto">
          <RecipeForm
            onSubmit={handleCreateRecipe}
            loading={formLoading}
            submitText="创建菜品"
          />
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">菜单管理</h1>
        <p className="text-gray-600">管理您的菜品信息，包括食材、制作步骤和品类标签</p>
      </div>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        size="large"
        className="bg-white rounded-lg shadow-sm"
      />

      {/* 编辑菜品弹窗 */}
      <Modal
        title="编辑菜品"
        open={isEditModalVisible}
        onCancel={handleCloseEditModal}
        footer={null}
        width={800}
        destroyOnHidden
      >
        {editingRecipe && (
          <RecipeForm
            initialValues={editingRecipe}
            onSubmit={handleUpdateRecipe}
            loading={formLoading}
            submitText="更新菜品"
          />
        )}
      </Modal>
    </div>
  );
}