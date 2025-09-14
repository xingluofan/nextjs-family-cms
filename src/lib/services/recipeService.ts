import { prisma } from '@/lib/database/prisma';

export interface Recipe {
  id: number;
  title: string;
  description?: string | null;
  ingredients: string[];
  steps: string[];
  cookTime?: number | null;
  difficulty?: string | null;
  categories: string[];
  servings?: number | null;
  createdBy: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateRecipeData {
  title: string;
  description?: string;
  ingredients: string[];
  steps: string[];
  cookTime?: number;
  difficulty?: string;
  categories: string[];
  servings?: number;
  createdBy: number;
}

export interface UpdateRecipeData {
  title?: string;
  description?: string;
  ingredients?: string[];
  steps?: string[];
  cookTime?: number;
  difficulty?: string;
  categories?: string[];
  servings?: number;
}

export interface RecipeFilters {
  categories?: string[];
  difficulty?: string;
  cookTimeMax?: number;
  search?: string;
}

export class RecipeService {
  // 创建菜品
  static async createRecipe(data: CreateRecipeData): Promise<Recipe> {
    try {
      const recipe = await prisma.recipe.create({
        data: {
          title: data.title,
          description: data.description,
          ingredients: data.ingredients,
          steps: data.steps,
          cookTime: data.cookTime,
          difficulty: data.difficulty,
          categories: data.categories,
          servings: data.servings,
          createdBy: data.createdBy,
        },
      });
      return recipe as Recipe;
    } catch (error) {
      console.error('创建菜品失败:', error);
      throw new Error('创建菜品失败');
    }
  }

  // 获取所有菜品（支持筛选）
  static async getRecipes(filters?: RecipeFilters): Promise<Recipe[]> {
    try {
      const where: Record<string, unknown> = {};

      // 按品类筛选
      if (filters?.categories && filters.categories.length > 0) {
        where.categories = {
          hasSome: filters.categories,
        };
      }

      // 按难度筛选
      if (filters?.difficulty) {
        where.difficulty = filters.difficulty;
      }

      // 按烹饪时间筛选
      if (filters?.cookTimeMax) {
        where.cookTime = {
          lte: filters.cookTimeMax,
        };
      }

      // 按标题搜索
      if (filters?.search) {
        where.title = {
          contains: filters.search,
          mode: 'insensitive',
        };
      }

      const recipes = await prisma.recipe.findMany({
        where,
        orderBy: {
          createdAt: 'desc',
        },
      });
      return recipes as Recipe[];
    } catch (error) {
      console.error('获取菜品列表失败:', error);
      throw new Error('获取菜品列表失败');
    }
  }

  // 根据ID获取单个菜品
  static async getRecipeById(id: number): Promise<Recipe | null> {
    try {
      const recipe = await prisma.recipe.findUnique({
        where: { id },
      });
      return recipe as Recipe | null;
    } catch (error) {
      console.error('获取菜品详情失败:', error);
      throw new Error('获取菜品详情失败');
    }
  }

  // 更新菜品
  static async updateRecipe(id: number, data: UpdateRecipeData): Promise<Recipe> {
    try {
      const recipe = await prisma.recipe.update({
        where: { id },
        data,
      });
      return recipe as Recipe;
    } catch (error) {
      console.error('更新菜品失败:', error);
      throw new Error('更新菜品失败');
    }
  }

  // 删除菜品
  static async deleteRecipe(id: number): Promise<void> {
    try {
      await prisma.recipe.delete({
        where: { id },
      });
    } catch (error) {
      console.error('删除菜品失败:', error);
      throw new Error('删除菜品失败');
    }
  }

  // 获取所有品类标签
  static async getAllCategories(): Promise<string[]> {
    try {
      const recipes = await prisma.recipe.findMany({
        select: {
          categories: true,
        },
      });
      
      const allCategories: string[] = recipes.flatMap((recipe: { categories: string[] }) => recipe.categories);
      const uniqueCategories = [...new Set(allCategories)];
      return uniqueCategories.sort();
    } catch (error) {
      console.error('获取品类标签失败:', error);
      throw new Error('获取品类标签失败');
    }
  }

  // 获取菜品统计信息
  static async getRecipeStats() {
    try {
      const totalCount = await prisma.recipe.count();
      const categories = await this.getAllCategories();
      
      const difficultyStats = await prisma.recipe.groupBy({
        by: ['difficulty'],
        _count: {
          difficulty: true,
        },
      });

      return {
        totalCount,
        categoriesCount: categories.length,
        categories,
        difficultyStats: difficultyStats.map((stat: { difficulty: string | null; _count: { difficulty: number } }) => ({
          difficulty: stat.difficulty,
          count: stat._count.difficulty,
        })),
      };
    } catch (error) {
      console.error('获取菜品统计失败:', error);
      throw new Error('获取菜品统计失败');
    }
  }
}