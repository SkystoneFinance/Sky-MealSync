export interface DashboardStats {
  totalStaff: number;
  activeStaff: number;
  inactiveStaff: number;
  mealsServedToday: number;
  // Active staff not yet served today (activeStaff - mealsServedToday).
  remainingStaff: number;
}

export interface RecentAttendance {
  id: string;
  mealDate: string;
  scannedAt: string;

  staff: {
    id: string;
    staffNumber: string;
    firstName: string;
    lastName: string;
    department: string;
  };

  // The dish served (their selection for the day), if any
  meal: { id: string; name: string; image: string } | null;
}
