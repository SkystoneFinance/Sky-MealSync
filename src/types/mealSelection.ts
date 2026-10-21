import type { FoodOption } from "./foodOption";

export interface MealSelection {
  id: string;
  staffId: string;
  // null when the staff member chose "No meal required"
  foodOptionId: string | null;
  noMeal: boolean;
  mealDate: string;
  createdAt: string;
  updatedAt: string;
  foodOption: FoodOption | null;
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