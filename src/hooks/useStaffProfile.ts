import { useQuery } from "@tanstack/react-query";

import { staffProfileService } from "../services/staffProfile.service";

export function useStaffProfile() {

  return useQuery({

    queryKey: [
      "staff-profile",
    ],

    queryFn:
      staffProfileService.getMe,

  });

}