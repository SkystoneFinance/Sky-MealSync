import axios from "../lib/axios";

import type {
  CreateStaffPayload,
  ImportStaffResult,
  Staff,
  UpdateStaffPayload,
  PinResetRequest,
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

  // Clears the PIN; the staff member re-activates with a new one
  async resetPin(id: string) {
    const response = await axios.post<{ success: boolean; message: string }>(
      `/staff/${id}/reset-pin`
    );
    return response.data;
  },

  async getPinResetRequests() {
    const response = await axios.get<ApiResponse<PinResetRequest[]>>(
      "/staff/pin-reset-requests"
    );
    return response.data.data;
  },

  async dismissPinResetRequest(id: string) {
    const response = await axios.post<{ success: boolean; message: string }>(
      `/staff/pin-reset-requests/${id}/dismiss`
    );
    return response.data;
  },

  async delete(id: string) {
    const response = await axios.delete<ApiResponse<null>>(`/staff/${id}`);
    return response.data;
  },
};
