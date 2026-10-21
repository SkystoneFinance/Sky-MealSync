export interface FoodOption {
  id: string;
  name: string;
  image: string;
  mealDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Today's dishes still needing our own photo + transition progress
export interface DishPhotoStatus {
  today: {
    id: string;
    name: string;
    image: string;
    hasOwnPhoto: boolean;
  }[];
  upcoming: {
    total: number;
    ownPhotos: number;
  };
}

export interface FoodOptionsResponse {
  success: boolean;
  data: FoodOption[];
}

export interface FoodOptionResponse {
  success: boolean;
  data: FoodOption;
}

export interface FoodOptionSummary {
  id: string;
  name: string;
  image: string;
  mealDate: string;
  isActive: boolean;
  selectionCount: number;
}

export interface FoodOptionSummaryResponse {
  success: boolean;
  data: {
    date: string;
    totalSelections: number;
    options: FoodOptionSummary[];
  };
}