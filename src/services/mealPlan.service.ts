import api from "../lib/axios";

import type {
  ChefPlanStatus,
  DayChoice,
  MealPrepSummary,
  MenuWeek,
  StaffMealPlan,
} from "../types/mealPlan";

interface Envelope<T> {
  success: boolean;
  message?: string;
  data: T;
}

export const mealPlanService = {
  // ==========================================
  // STAFF
  // ==========================================

  async getMine() {
    const res =
      await api.get<Envelope<StaffMealPlan>>("/meal-plan");

    return res.data.data;
  },

  async submit(data: {
    weekStart: string;
    selections: DayChoice[];
  }) {
    const res = await api.put<
      Envelope<StaffMealPlan["submission"]>
    >("/meal-plan", data);

    return res.data;
  },

  // ==========================================
  // CHEF / ADMIN
  // ==========================================

  async getStatus() {
    const res = await api.get<Envelope<ChefPlanStatus>>(
      "/menu-weeks/status"
    );

    return res.data.data;
  },

  async getWeek(weekStart: string) {
    const res = await api.get<Envelope<MenuWeek>>(
      `/menu-weeks/${weekStart}`
    );

    return res.data.data;
  },

  async setClosedDays(weekStart: string, dates: string[]) {
    const res = await api.put<Envelope<MenuWeek>>(
      `/menu-weeks/${weekStart}/closed-days`,
      { dates }
    );

    return res.data.data;
  },

  async publish(weekStart: string) {
    const res = await api.post<Envelope<MenuWeek>>(
      `/menu-weeks/${weekStart}/publish`
    );

    return res.data;
  },

  async getSummary(weekStart: string) {
    const res = await api.get<Envelope<MealPrepSummary>>(
      `/menu-weeks/${weekStart}/summary`
    );

    return res.data.data;
  },

  async exportSummary(weekStart: string) {
    const res = await api.get<Blob>(
      `/menu-weeks/${weekStart}/summary/export`,
      { responseType: "blob" }
    );

    return res.data;
  },
};
