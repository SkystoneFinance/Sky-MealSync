export interface FoodOption {
  id: string;
  name: string;
  image: string;
  mealDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FoodOptionsResponse {
  success: boolean;
  data: FoodOption[];
}

export interface FoodOptionResponse {
  success: boolean;
  data: FoodOption;
}