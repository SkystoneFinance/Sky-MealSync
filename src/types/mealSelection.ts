import type { FoodOption } from "./foodOption";

export interface MealSelection {
  id: string;
  staffId: string;
  foodOptionId: string;
  mealDate: string;
  createdAt: string;
  updatedAt: string;
  foodOption: FoodOption;
}

export interface MealSelectionsResponse {
  success: boolean;
  data: MealSelection[];
}

export interface MealSelectionResponse {
  success: boolean;
  message: string;
  data: MealSelection;
}