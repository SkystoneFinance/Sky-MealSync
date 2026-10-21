import axios from "../lib/axios";

import type {
  CreateStaffPayload,
  ImportStaffResult,
  Staff,
  UpdateStaffPayload,
} from "../types/staff";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const staffService = {
  async getAll() {
    const response = await axios.get<ApiResponse<Staff[]>>("/staff");
    return response.data.data;
  },

  async create(data: CreateStaffPayload) {
    const response = await axios.post<ApiResponse<Staff>>("/staff", data);
    return response.data.data;
  },

  async update(id: string, data: UpdateStaffPayload) {
    const response = await axios.patch<ApiResponse<Staff>>(
      `/staff/${id}`,
      data
    );
    return response.data.data;
  },

  async importStaff(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post<ApiResponse<ImportStaffResult>>(
      "/staff/import",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    return response.data.data;
  },

  async delete(id: string) {
    const response = await axios.delete<ApiResponse<null>>(`/staff/${id}`);
    return response.data;
  },
};
