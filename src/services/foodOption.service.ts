import api from "../lib/axios";

import type {
  FoodOption,
  FoodOptionsResponse,
  FoodOptionResponse,
  FoodOptionSummaryResponse,
  DishPhotoStatus,
} from "../types/foodOption";


// ==========================================
// PAYLOAD TYPES
// ==========================================

export interface CreateFoodOptionPayload {
  name: string;
  // Optional when we already have our own photo of this dish
  image?: string;
  mealDate: string;
}


export interface UpdateFoodOptionPayload {
  name?: string;
  image?: string;
  mealDate?: string;
}


export interface UpdateFoodOptionStatusPayload {
  isActive: boolean;
}


// ==========================================
// FOOD OPTION SERVICE
// ==========================================

export const foodOptionService = {

  // ========================================
  // OUR OWN DISH PHOTOS
  // ========================================

  async getPhotoStatus(): Promise<DishPhotoStatus> {
    const res = await api.get<{ success: boolean; data: DishPhotoStatus }>(
      "/food-options/photo-status"
    );

    return res.data.data;
  },

  async uploadPhoto(id: string, photo: Blob): Promise<FoodOption> {
    const form = new FormData();
    form.append("photo", photo, "dish.jpg");

    const res = await api.post<FoodOptionResponse>(
      `/food-options/${id}/photo`,
      form,
      {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 60000,
      }
    );

    return res.data.data;
  },

  // ========================================
  // GET ALL
  // ========================================

  async getAll(): Promise<FoodOption[]> {
    const response =
      await api.get<FoodOptionsResponse>(
        "/food-options"
      );

    return response.data.data;
  },


  // ========================================
  // GET BY DATE
  // ========================================

  async getByDate(
    date: string
  ): Promise<FoodOption[]> {
    const response =
      await api.get<FoodOptionsResponse>(
        `/food-options/date?date=${encodeURIComponent(date)}`
      );

    return response.data.data;
  },


  // ========================================
  // GET BY ID
  // ========================================

  async getById(
    id: string
  ): Promise<FoodOption> {
    const response =
      await api.get<FoodOptionResponse>(
        `/food-options/${id}`
      );

    return response.data.data;
  },


  // ========================================
  // CREATE
  // ========================================

  async create(
    data: CreateFoodOptionPayload
  ): Promise<FoodOption> {
    const response =
      await api.post<FoodOptionResponse>(
        "/food-options",
        data
      );

    return response.data.data;
  },


  // ========================================
  // UPDATE
  // ========================================

  async update(
    id: string,
    data: UpdateFoodOptionPayload
  ): Promise<FoodOption> {
    const response =
      await api.patch<FoodOptionResponse>(
        `/food-options/${id}`,
        data
      );

    return response.data.data;
  },


  // ========================================
  // UPDATE STATUS
  // ========================================

  async updateStatus(
    id: string,
    data: UpdateFoodOptionStatusPayload
  ): Promise<FoodOption> {
    const response =
      await api.patch<FoodOptionResponse>(
        `/food-options/${id}/status`,
        data
      );

    return response.data.data;
  },


  // ========================================
  // DELETE
  // ========================================

  async remove(
    id: string
  ): Promise<void> {
    await api.delete(
      `/food-options/${id}`
    );
  },


  // ========================================
  // GET DEMAND SUMMARY BY DATE
  // ========================================

  async getSummaryByDate(
    date: string
  ): Promise<FoodOptionSummaryResponse["data"]> {
    const response =
      await api.get<FoodOptionSummaryResponse>(
        `/food-options/summary?date=${encodeURIComponent(date)}`
      );

    return response.data.data;
  },

};