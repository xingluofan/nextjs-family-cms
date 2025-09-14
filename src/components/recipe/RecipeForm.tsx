'use client';

import React, { useState } from 'react';
import {
  Form,
  Input,
  Button,
  Card,
  Space,
  Select,
  InputNumber,
  message,
  Tag,
  Divider,
  Row,
  Col,
} from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { CreateRecipeData, Recipe } from '@/lib/services/recipeService';

const { TextArea } = Input;
const { Option } = Select;

interface RecipeFormProps {
  initialValues?: Partial<Recipe>;
  onSubmit: (data: CreateRecipeData) => Promise<void>;
  loading?: boolean;
  submitText?: string;
}

// 预定义的品类标签
const PREDEFINED_CATEGORIES = [
  '川菜',
  '粤菜',
  '鲁菜',
  '苏菜',
  '浙菜',
  '闽菜',
  '湘菜',
  '徽菜',
  '东北菜',
  '西北菜',
  '凉菜',
  '热菜',
  '汤品',
  '甜品',
  '小食',
  '主食',
  '素食',
  '海鲜',
  '肉类',
  '蔬菜',
];

// 难度选项
const DIFFICULTY_OPTIONS = [
  { label: '简单', value: '简单' },
  { label: '中等', value: '中等' },
  { label: '困难', value: '困难' },
];

export default function RecipeForm({
  initialValues,
  onSubmit,
  loading = false,
  submitText = '创建菜品',
}: RecipeFormProps) {
  const [form] = Form.useForm();
  const [categories, setCategories] = useState<string[]>(
    initialValues?.categories || []
  );
  const [customCategory, setCustomCategory] = useState('');

  // 添加自定义品类
  const addCustomCategory = () => {
    if (customCategory && !categories.includes(customCategory)) {
      const newCategories = [...categories, customCategory];
      setCategories(newCategories);
      form.setFieldValue('categories', newCategories);
      setCustomCategory('');
    }
  };

  // 移除品类
  const removeCategory = (categoryToRemove: string) => {
    const newCategories = categories.filter(cat => cat !== categoryToRemove);
    setCategories(newCategories);
    form.setFieldValue('categories', newCategories);
  };

  // 选择预定义品类
  const selectCategory = (category: string) => {
    if (!categories.includes(category)) {
      const newCategories = [...categories, category];
      setCategories(newCategories);
      form.setFieldValue('categories', newCategories);
    }
  };

  // 表单提交
  const handleSubmit = async (values: {
    title: string;
    description?: string;
    ingredients: string[];
    steps: string[];
    cookTime?: number;
    difficulty?: string;
    servings?: number;
  }) => {
    try {
      const formData: CreateRecipeData = {
        title: values.title,
        description: values.description,
        ingredients: values.ingredients || [],
        steps: values.steps || [],
        cookTime: values.cookTime,
        difficulty: values.difficulty,
        categories: categories,
        servings: values.servings,
        createdBy: 1, // 临时使用固定用户ID，后续可以从用户会话获取
      };

      await onSubmit(formData);
      message.success('菜品保存成功！');
      
      // 如果不是编辑模式，重置表单
      if (!initialValues) {
        form.resetFields();
        setCategories([]);
      }
    } catch (error) {
      message.error('保存失败，请重试');
      if (process.env.NODE_ENV === 'development') {
        console.error('保存菜品失败:', error);
      }
    }
  };

  return (
    <Card title={initialValues ? '编辑菜品' : '添加新菜品'} className="w-full">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          title: initialValues?.title || '',
          description: initialValues?.description || '',
          ingredients: initialValues?.ingredients || [''],
          steps: initialValues?.steps || [''],
          cookTime: initialValues?.cookTime,
          difficulty: initialValues?.difficulty,
          servings: initialValues?.servings,
        }}
      >
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              label="菜品名称"
              name="title"
              rules={[{ required: true, message: '请输入菜品名称' }]}
            >
              <Input placeholder="请输入菜品名称" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="难度等级" name="difficulty">
              <Select placeholder="选择难度等级" allowClear>
                {DIFFICULTY_OPTIONS.map(option => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item label="烹饪时间（分钟）" name="cookTime">
              <InputNumber
                min={1}
                max={999}
                placeholder="烹饪时间"
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="份量（人份）" name="servings">
              <InputNumber
                min={1}
                max={20}
                placeholder="几人份"
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="菜品描述" name="description">
          <TextArea
            rows={3}
            placeholder="请输入菜品描述（可选）"
            showCount
            maxLength={500}
          />
        </Form.Item>

        {/* 品类标签 */}
        <Form.Item label="品类标签">
          <div className="mb-3">
            <div className="mb-2">
              <span className="text-sm text-gray-600">已选择的标签：</span>
            </div>
            <div className="mb-3">
              {categories.map(category => (
                <Tag
                  key={category}
                  closable
                  onClose={() => removeCategory(category)}
                  className="mb-1"
                >
                  {category}
                </Tag>
              ))}
            </div>
          </div>
          
          <div className="mb-3">
            <div className="mb-2">
              <span className="text-sm text-gray-600">选择预定义标签：</span>
            </div>
            <div>
              {PREDEFINED_CATEGORIES.map(category => (
                <Tag
                  key={category}
                  className={`mb-1 cursor-pointer ${
                    categories.includes(category)
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:bg-blue-50'
                  }`}
                  onClick={() => selectCategory(category)}
                  color={categories.includes(category) ? 'default' : 'blue'}
                >
                  {category}
                </Tag>
              ))}
            </div>
          </div>
          
          <div>
            <div className="mb-2">
              <span className="text-sm text-gray-600">添加自定义标签：</span>
            </div>
            <Space.Compact style={{ width: '100%' }}>
              <Input
                placeholder="输入自定义标签"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                onPressEnter={addCustomCategory}
              />
              <Button type="primary" onClick={addCustomCategory}>
                添加
              </Button>
            </Space.Compact>
          </div>
        </Form.Item>

        <Divider />

        {/* 食材列表 */}
        <Form.Item label="食材列表">
          <Form.List name="ingredients">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                    <Form.Item
                      {...restField}
                      name={name}
                      rules={[{ required: true, message: '请输入食材' }]}
                      style={{ flex: 1, marginBottom: 0 }}
                    >
                      <Input placeholder="请输入食材（如：猪肉 500g）" />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    添加食材
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form.Item>

        {/* 制作步骤 */}
        <Form.Item label="制作步骤">
          <Form.List name="steps">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }, index) => (
                  <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                    <span className="text-gray-500 min-w-[30px]">步骤{index + 1}:</span>
                    <Form.Item
                      {...restField}
                      name={name}
                      rules={[{ required: true, message: '请输入制作步骤' }]}
                      style={{ flex: 1, marginBottom: 0 }}
                    >
                      <TextArea
                        placeholder="请详细描述制作步骤"
                        autoSize={{ minRows: 2, maxRows: 4 }}
                      />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    添加步骤
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} size="large">
            {submitText}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}