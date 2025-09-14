'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  List,
  Tag,
  Button,
  Space,
  Input,
  Select,
  Row,
  Col,
  Empty,
  Spin,
  message,
  Modal,
  Typography,
  Divider,
  InputNumber,
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ClockCircleOutlined,
  UserOutlined,
  FilterOutlined,
} from '@ant-design/icons';
import { Recipe } from '@/lib/services/recipeService';

const { Search } = Input;
const { Option } = Select;
const { Text, Title } = Typography;

interface RecipeListProps {
  onEdit?: (recipe: Recipe) => void;
  onDelete?: (id: number) => void;
  refreshTrigger?: number; // 用于触发刷新
}

interface RecipeFilters {
  categories?: string[];
  difficulty?: string;
  cookTimeMax?: number;
  search?: string;
}

export default function RecipeList({ onEdit, onDelete, refreshTrigger }: RecipeListProps) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [filters, setFilters] = useState<RecipeFilters>({});
  const [showFilters, setShowFilters] = useState(false);

  // 获取菜品列表
  const fetchRecipes = async (currentFilters: RecipeFilters = {}) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      
      if (currentFilters.categories && currentFilters.categories.length > 0) {
        params.append('categories', currentFilters.categories.join(','));
      }
      if (currentFilters.difficulty) {
        params.append('difficulty', currentFilters.difficulty);
      }
      if (currentFilters.cookTimeMax) {
        params.append('cookTimeMax', currentFilters.cookTimeMax.toString());
      }
      if (currentFilters.search) {
        params.append('search', currentFilters.search);
      }

      const response = await fetch(`/api/recipes?${params.toString()}`);
      const data = await response.json();
      
      if (data.success) {
        setRecipes(data.data);
      } else {
        message.error(data.message || '获取菜品列表失败');
      }
    } catch (error) {
      message.error('获取菜品列表失败');
      console.error('获取菜品列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 获取品类标签
  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/recipes/categories');
      const data = await response.json();
      
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error('获取品类标签失败:', error);
    }
  };

  // 初始化数据
  useEffect(() => {
    fetchRecipes();
    fetchCategories();
  }, []);

  // 监听刷新触发器
  useEffect(() => {
    if (refreshTrigger) {
      fetchRecipes(filters);
    }
  }, [refreshTrigger]);

  // 搜索处理
  const handleSearch = (value: string) => {
    const newFilters = { ...filters, search: value };
    setFilters(newFilters);
    fetchRecipes(newFilters);
  };

  // 筛选处理
  const handleFilterChange = (key: keyof RecipeFilters, value: string[] | string | number | undefined) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    fetchRecipes(newFilters);
  };

  // 清除筛选
  const clearFilters = () => {
    setFilters({});
    fetchRecipes({});
  };

  // 删除确认
  const handleDeleteConfirm = (recipe: Recipe) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除菜品「${recipe.title}」吗？此操作不可恢复。`,
      okText: '确认删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        if (onDelete) {
          onDelete(recipe.id);
        }
      },
    });
  };

  // 格式化时间
  const formatCookTime = (minutes?: number | null) => {
    if (!minutes) return '未设置';
    if (minutes < 60) return `${minutes}分钟`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}小时${remainingMinutes}分钟` : `${hours}小时`;
  };

  return (
    <div className="w-full">
      {/* 搜索和筛选区域 */}
      <Card className="mb-4">
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={8}>
            <Search
              placeholder="搜索菜品名称"
              allowClear
              enterButton={<SearchOutlined />}
              onSearch={handleSearch}
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Button
              icon={<FilterOutlined />}
              onClick={() => setShowFilters(!showFilters)}
              type={showFilters ? 'primary' : 'default'}
            >
              高级筛选
            </Button>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <div className="text-right">
              <Text type="secondary">共 {recipes.length} 道菜品</Text>
            </div>
          </Col>
        </Row>

        {/* 高级筛选面板 */}
        {showFilters && (
          <>
            <Divider />
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={8}>
                <div className="mb-2">
                  <Text strong>品类筛选：</Text>
                </div>
                <Select
                  mode="multiple"
                  placeholder="选择品类"
                  style={{ width: '100%' }}
                  value={filters.categories}
                  onChange={(value) => handleFilterChange('categories', value)}
                  allowClear
                >
                  {categories.map(category => (
                    <Option key={category} value={category}>
                      {category}
                    </Option>
                  ))}
                </Select>
              </Col>
              <Col xs={24} sm={8}>
                <div className="mb-2">
                  <Text strong>难度筛选：</Text>
                </div>
                <Select
                  placeholder="选择难度"
                  style={{ width: '100%' }}
                  value={filters.difficulty}
                  onChange={(value) => handleFilterChange('difficulty', value)}
                  allowClear
                >
                  <Option value="简单">简单</Option>
                  <Option value="中等">中等</Option>
                  <Option value="困难">困难</Option>
                </Select>
              </Col>
              <Col xs={24} sm={8}>
                <div className="mb-2">
                  <Text strong>最大烹饪时间（分钟）：</Text>
                </div>
                <InputNumber
                  placeholder="最大时间"
                  style={{ width: '100%' }}
                  min={1}
                  max={999}
                  value={filters.cookTimeMax}
                  onChange={(value) => handleFilterChange('cookTimeMax', value || undefined)}
                />
              </Col>
            </Row>
            <div className="mt-4">
              <Button onClick={clearFilters}>清除筛选</Button>
            </div>
          </>
        )}
      </Card>

      {/* 菜品列表 */}
      <Spin spinning={loading}>
        {recipes.length === 0 && !loading ? (
          <Empty
            description="暂无菜品数据"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : (
          <List
            grid={{
              gutter: 16,
              xs: 1,
              sm: 1,
              md: 2,
              lg: 2,
              xl: 3,
              xxl: 4,
            }}
            dataSource={recipes}
            renderItem={(recipe) => (
              <List.Item>
                <Card
                  hoverable
                  actions={[
                    <Button
                      key="edit"
                      type="text"
                      icon={<EditOutlined />}
                      onClick={() => onEdit && onEdit(recipe)}
                    >
                      编辑
                    </Button>,
                    <Button
                      key="delete"
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => handleDeleteConfirm(recipe)}
                    >
                      删除
                    </Button>,
                  ]}
                >
                  <Card.Meta
                    title={
                      <div className="flex justify-between items-start">
                        <Title level={5} className="mb-0 flex-1">
                          {recipe.title}
                        </Title>
                        {recipe.difficulty && (
                          <Tag
                            color={
                              recipe.difficulty === '简单'
                                ? 'green'
                                : recipe.difficulty === '中等'
                                ? 'orange'
                                : 'red'
                            }
                          >
                            {recipe.difficulty}
                          </Tag>
                        )}
                      </div>
                    }
                    description={
                      <div className="space-y-2">
                        {recipe.description && (
                          <Text type="secondary" className="block">
                            {recipe.description.length > 60
                              ? `${recipe.description.substring(0, 60)}...`
                              : recipe.description}
                          </Text>
                        )}
                        
                        <div className="flex items-center space-x-4 text-sm">
                          {recipe.cookTime && (
                            <span className="flex items-center">
                              <ClockCircleOutlined className="mr-1" />
                              {formatCookTime(recipe.cookTime)}
                            </span>
                          )}
                          {recipe.servings && (
                            <span className="flex items-center">
                              <UserOutlined className="mr-1" />
                              {recipe.servings}人份
                            </span>
                          )}
                        </div>

                        {recipe.categories.length > 0 && (
                          <div className="mt-2">
                            {recipe.categories.slice(0, 3).map(category => (
                              <Tag key={category} className="mb-1">
                                {category}
                              </Tag>
                            ))}
                            {recipe.categories.length > 3 && (
                              <Tag className="mb-1">
                                +{recipe.categories.length - 3}
                              </Tag>
                            )}
                          </div>
                        )}

                        <div className="mt-2 text-xs text-gray-400">
                          食材 {recipe.ingredients.length} 种 · 步骤 {recipe.steps.length} 步
                        </div>
                      </div>
                    }
                  />
                </Card>
              </List.Item>
            )}
          />
        )}
      </Spin>
    </div>
  );
}