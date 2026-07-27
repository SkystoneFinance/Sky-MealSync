export interface DashboardStats {
  totalStaff: number;
  mealsServed: number;
  attendance: number;
}

export interface Staff {
  id: string;
  name: string;
  department: string;
  avatar: string;
  hasEaten: boolean;
  weeklyMeals: number;
}

export interface Activity {
  id: string;
  staffName: string;
  action: string;
  time: string;
}

export interface DashboardResponse {
  stats: DashboardStats;
  staff: Staff[];
  recentActivity: Activity[];
  meals: Meal[];
}

export interface Meal {
  id: string;
  name: string
  image: string;
  totalStaff: number;
  served: number;
  meal: Meal;
}