export interface ReportSummary {
  totalStaff: number;
  served: number;
  remaining: number;
  attendanceRate: number;
}

export interface StaffMealSummary {
  staffId: string;
  staffNumber: string;
  name: string;
  department: string;
  mealCount: number;
  lastMeal: string | null;
}