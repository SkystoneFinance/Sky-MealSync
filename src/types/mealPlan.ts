// Weekly meal planning (next week's Mon–Fri menu).
// Dates are "YYYY-MM-DD"; timestamps are ISO strings.

export interface PlanOption {
  id: string;
  name: string;
  image: string;
  isActive?: boolean;
}

export interface PlanDay {
  date: string;
  closed: boolean;
  options: PlanOption[];
}

export interface DayChoice {
  date: string;
  foodOptionId?: string | null;
  noMeal?: boolean;
}

// ---------- staff ----------

export interface StaffMealPlan {
  week: {
    weekStart: string;
    deadline: string;
    isPublished: boolean;
    isOpen: boolean;
  };
  days: PlanDay[];
  selections: Required<DayChoice>[];
  submission: {
    submittedAt: string;
    updatedAt: string;
  } | null;
}

// ---------- chef / admin ----------

export interface ChefPlanStatus {
  weekStart: string;
  publishDueAt: string;
  deadline: string;
  hardClose: string;
  isPublished: boolean;
  publishedAt: string | null;
  showPublishReminder: boolean;
  isPublishOverdue: boolean;
  isConfirmed: boolean;
}

export interface MenuWeek {
  weekStart: string;
  publishDueAt: string;
  deadline: string;
  hardClose: string;
  isClosed: boolean;
  isPublished: boolean;
  publishedAt: string | null;
  publishedLate: boolean;
  days: PlanDay[];
}

export interface SummaryStaff {
  id: string;
  staffNumber: string;
  firstName: string;
  lastName: string;
  department: string;
}

export interface MealPrepSummary {
  weekStart: string;
  deadline: string;
  hardClose: string;
  isPublished: boolean;
  publishedAt: string | null;
  isConfirmed: boolean;
  totals: {
    activeStaff: number;
    submitted: number;
    notSubmitted: number;
  };
  days: {
    date: string;
    closed: boolean;
    options: {
      id: string;
      name: string;
      isActive: boolean;
      count: number;
    }[];
    mealsRequired: number;
    noMeal: number;
    notSubmitted: number;
  }[];
  submitted: (SummaryStaff & {
    submittedAt: string;
    updatedAt: string;
    edited: boolean;
  })[];
  notSubmitted: (SummaryStaff & {
    hasActivatedAccount: boolean;
  })[];
}
