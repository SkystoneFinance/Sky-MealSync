import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  foodOptionService,
  type CreateFoodOptionPayload,
  type UpdateFoodOptionPayload,
  // type UpdateFoodOptionStatusPayload,
} from "../services/foodOption.service";


// ==========================================
// GET ALL FOOD OPTIONS
// ==========================================

export function useFoodOptions() {

  return useQuery({

    queryKey: [
      "food-options",
    ],

    queryFn:
      foodOptionService.getAll,

  });

}


// ==========================================
// GET FOOD OPTIONS BY DATE
// ==========================================

export function useFoodOptionsByDate(
  date: string
) {

  return useQuery({

    queryKey: [
      "food-options",
      "date",
      date,
    ],

    queryFn: () =>
      foodOptionService.getByDate(date),

    enabled:
      Boolean(date),

  });

}


// ==========================================
// CREATE FOOD OPTION
// ==========================================

export function useCreateFoodOption() {

  const queryClient =
    useQueryClient();


  return useMutation({

    mutationFn:
      (
        data: CreateFoodOptionPayload
      ) =>
        foodOptionService.create(
          data
        ),


    onSuccess: () => {

      queryClient.invalidateQueries({

        queryKey: [
          "food-options",
        ],

      });

    },

  });

}


// ==========================================
// UPDATE FOOD OPTION
// ==========================================

export function useUpdateFoodOption() {

  const queryClient =
    useQueryClient();


  return useMutation({

    mutationFn:
      ({
        id,
        data,
      }: {
        id: string;
        data: UpdateFoodOptionPayload;
      }) =>
        foodOptionService.update(
          id,
          data
        ),


    onSuccess: () => {

      queryClient.invalidateQueries({

        queryKey: [
          "food-options",
        ],

      });

    },

  });

}


// ==========================================
// UPDATE FOOD OPTION STATUS
// ==========================================

export function useUpdateFoodOptionStatus() {

  const queryClient =
    useQueryClient();


  return useMutation({

    mutationFn:
      ({
        id,
        isActive,
      }: {
        id: string;
        isActive: boolean;
      }) =>
        foodOptionService.updateStatus(
          id,
          {
            isActive,
          }
        ),


    onSuccess: () => {

      queryClient.invalidateQueries({

        queryKey: [
          "food-options",
        ],

      });

    },

  });

}


// ==========================================
// DELETE FOOD OPTION
// ==========================================

export function useDeleteFoodOption() {

  const queryClient =
    useQueryClient();


  return useMutation({

    mutationFn:
      (id: string) =>
        foodOptionService.remove(id),


    onSuccess: () => {

      queryClient.invalidateQueries({

        queryKey: [
          "food-options",
        ],

      });

    },

  });

}