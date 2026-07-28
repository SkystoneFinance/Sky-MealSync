import axios from "../lib/axios";

import type {
  DashboardStats,
  RecentAttendance,
  DepartmentSummary,
} from "../types/dashboard";


export const dashboardService = {

  async getDashboard(){

    const response =
      await axios.get<DashboardStats>(
        "/dashboard"
      );

    return response.data;

  },


  async getRecentAttendance(){

    const response =
      await axios.get<RecentAttendance[]>(
        "/dashboard/recent-attendance"
      );

    return response.data;

  },


  async getDepartmentSummary(){

    const response =
      await axios.get<DepartmentSummary[]>(
        "/dashboard/department-summary"
      );


    return response.data;

  }

};