export interface MenuItem {
  id: string;
  name: string;
  description: string;
  ingredients: string[];
  cookingSteps: string[];
  imageUrl: string;
  preparationTime: number; // 单位：分钟
  difficulty: 'easy' | 'medium' | 'hard';
  createdAt: Date;
  updatedAt: Date;
}

export interface MenuFormData {
  name: string;
  description: string;
  ingredients: string[];
  cookingSteps: string[];
  image: File | null;
  preparationTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
}