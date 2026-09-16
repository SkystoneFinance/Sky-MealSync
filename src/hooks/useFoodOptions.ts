import { useQuery } from "@tanstack/react-query";

import { foodOptionService } from "../services/foodOption.service";

export function useFoodOptions() {
  return useQuery({
    queryKey: ["food-options"],
    queryFn: foodOptionService.getAll,
  });
}

export function useFoodOptionsByDate(
  date: string
) {
  return useQuery({
    queryKey: ["food-options", "date", date],
    queryFn: () =>
      foodOptionService.getByDate(date),
    enabled: Boolean(date),
  });
}