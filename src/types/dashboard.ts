export interface DashboardStats {
  totalStaff: number;
  activeStaff: number;
  inactiveStaff: number;
  mealsServedToday: number;
  // Active staff not yet served today (activeStaff - mealsServedToday).
  remainingStaff: number;
}

export interface DepartmentSummary {
  department: string;
  total: number;
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
    qrImage: string;
  };
}
