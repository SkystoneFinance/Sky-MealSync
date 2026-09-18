import api from "../lib/axios";

import type {
  StaffProfile,
  StaffProfileResponse,
} from "../types/staffProfile";

export const staffProfileService = {

  async getMe(): Promise<StaffProfile> {

    const response =
      await api.get<StaffProfileResponse>(
        "/staff-auth/me",
      );

    return response.data.data;

  },

};