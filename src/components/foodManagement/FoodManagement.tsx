import {
  CalendarDays,
  CheckCircle2,
  Loader2,
  Plus,
  Search,
  UtensilsCrossed,
} from "lucide-react";

import { useMemo, useState } from "react";

import {
  useCreateFoodOption,
  useDeleteFoodOption,
  useFoodOptions,
  useFoodOptionSummary,
  useUpdateFoodOption,
  useUpdateFoodOptionStatus,
} from "../../hooks/useFoodOptions";

import MealCard from "./MealCard";
import MealModal from "./MealModal";
import SummaryCard from "./SummaryCard";
import DemandSummaryCard from "./DemandSummaryCard";

import type { FoodOption } from "../../types/foodOption";


// ==========================================
// HELPERS
// ==========================================

function getTodayDate() {
  const today = new Date();

  const year = today.getFullYear();

  const month = String(
    today.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    today.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}


// ==========================================
// COMPONENT
// ==========================================

export default function FoodManagement() {

  // ========================================
  // FOOD OPTIONS
  // ========================================

  const {
    data: meals = [],
    isLoading,
    isError,
  } = useFoodOptions();


  // ========================================
  // DEMAND DATE
  // ========================================

  const [selectedDate, setSelectedDate] =
    useState(getTodayDate());


  // ========================================
  // FOOD DEMAND SUMMARY
  // ========================================

  const {
    data: demandSummary,
    isLoading: demandSummaryLoading,
    isError: demandSummaryError,
  } = useFoodOptionSummary(
    selectedDate
  );


  // ========================================
  // MUTATIONS
  // ========================================

  const createMeal =
    useCreateFoodOption();

  const updateMeal =
    useUpdateFoodOption();

  const updateStatus =
    useUpdateFoodOptionStatus();

  const deleteMeal =
    useDeleteFoodOption();


  // ========================================
  // SEARCH
  // ========================================

  const [search, setSearch] =
    useState("");


  // ========================================
  // MODAL
  // ========================================

  const [showModal, setShowModal] =
    useState(false);

  const [editingMeal, setEditingMeal] =
    useState<FoodOption | null>(null);


  // ========================================
  // FORM
  // ========================================

  const [name, setName] =
    useState("");

  const [image, setImage] =
    useState("");

  const [mealDate, setMealDate] =
    useState(getTodayDate());


  // ========================================
  // FOOD MANAGEMENT SUMMARY
  // ========================================

  const summary = useMemo(() => {

    const today =
      new Date();

    // const todayDate =
    //   new Date(
    //     `${getTodayDate()}T00:00:00`
    //   );


    // --------------------------------------
    // START OF CURRENT WEEK
    // --------------------------------------

    const day =
      today.getDay();

    const difference =
      day === 0
        ? -6
        : 1 - day;

    const monday =
      new Date(today);

    monday.setDate(
      monday.getDate() + difference
    );

    monday.setHours(
      0,
      0,
      0,
      0
    );


    // --------------------------------------
    // END OF CURRENT WEEK
    // --------------------------------------

    const friday =
      new Date(monday);

    friday.setDate(
      monday.getDate() + 4
    );

    friday.setHours(
      23,
      59,
      59,
      999
    );


    // --------------------------------------
    // MEALS THIS WEEK
    // --------------------------------------

    const thisWeek =
      meals.filter((meal) => {

        const date =
          new Date(
            `${meal.mealDate.slice(0, 10)}T00:00:00`
          );

        return (
          date >= monday &&
          date <= friday
        );

      });


    // --------------------------------------
    // ACTIVE MEALS
    // --------------------------------------

    const activeMeals =
      meals.filter(
        (meal) => meal.isActive
      );


    return {
      total: meals.length,
      thisWeek: thisWeek.length,
      active: activeMeals.length,
    };

  }, [meals]);


  // ========================================
  // FILTERED MEALS
  // ========================================

  const filteredMeals =
    useMemo(() => {

      const value =
        search
          .trim()
          .toLowerCase();


      if (!value) {
        return meals;
      }


      return meals.filter(
        (meal) =>
          meal.name
            .toLowerCase()
            .includes(value)
      );

    }, [meals, search]);


  // ========================================
  // OPEN ADD MODAL
  // ========================================

  const openAddModal = () => {

    setEditingMeal(null);

    setName("");

    setImage("");

    setMealDate(
      getTodayDate()
    );

    setShowModal(true);

  };


  // ========================================
  // OPEN EDIT MODAL
  // ========================================

  const openEditModal = (
    meal: FoodOption
  ) => {

    setEditingMeal(meal);

    setName(
      meal.name
    );

    setImage(
      meal.image
    );

    setMealDate(
      meal.mealDate.slice(0, 10)
    );

    setShowModal(true);

  };


  // ========================================
  // CLOSE MODAL
  // ========================================

  const closeModal = () => {

    if (
      createMeal.isPending ||
      updateMeal.isPending
    ) {
      return;
    }

    setShowModal(false);

  };


  // ========================================
  // SUBMIT FOOD OPTION
  // ========================================

  const handleSubmit = async (
    event: React.FormEvent
  ) => {

    event.preventDefault();


    if (
      !name.trim() ||
      !image.trim() ||
      !mealDate
    ) {
      return;
    }


    try {

      if (editingMeal) {

        await updateMeal.mutateAsync({

          id:
            editingMeal.id,

          data: {

            name:
              name.trim(),

            image:
              image.trim(),

            mealDate,

          },

        });

      } else {

        await createMeal.mutateAsync({

          name:
            name.trim(),

          image:
            image.trim(),

          mealDate,

        });

      }


      closeModal();

    } catch (error) {

      console.error(
        "Food option save error:",
        error
      );

    }

  };


  // ========================================
  // CHANGE STATUS
  // ========================================

  const handleStatusChange = async (
    meal: FoodOption
  ) => {

    try {

      await updateStatus.mutateAsync({

        id:
          meal.id,

        isActive:
          !meal.isActive,

      });

    } catch (error) {

      console.error(
        "Food option status error:",
        error
      );

    }

  };


  // ========================================
  // DELETE
  // ========================================

  const handleDelete = async (
    meal: FoodOption
  ) => {

    const confirmed =
      window.confirm(
        `Delete "${meal.name}"? This action cannot be undone.`
      );


    if (!confirmed) {
      return;
    }


    try {

      await deleteMeal.mutateAsync(
        meal.id
      );

    } catch (error) {

      console.error(
        "Food option delete error:",
        error
      );

    }

  };


  // ========================================
  // INITIAL LOADING
  // ========================================

  if (isLoading) {

    return (
      <div className="mx-auto flex min-h-[500px] w-full max-w-7xl items-center justify-center">

        <div className="flex items-center gap-3 text-sm text-slate-500">

          <Loader2
            size={20}
            className="animate-spin text-[#B10F16]"
          />

          Loading meals...

        </div>

      </div>
    );

  }


  // ========================================
  // INITIAL ERROR
  // ========================================

  if (isError) {

    return (
      <div className="mx-auto flex min-h-[400px] w-full max-w-7xl items-center justify-center">

        <div className="text-center">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FDEBEC] text-[#B10F16]">

            <UtensilsCrossed
              size={24}
            />

          </div>


          <h2 className="mt-4 text-lg font-bold text-slate-900">
            Unable to load meals
          </h2>


          <p className="mt-1 text-sm text-slate-500">
            Something went wrong while loading the food menu.
          </p>

        </div>

      </div>
    );

  }


  // ========================================
  // PAGE
  // ========================================

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">


      {/* ======================================
          HEADER
      ======================================= */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

        <div>

          <p className="text-sm font-medium text-slate-500">
            Chef
          </p>


          <h1 className="mt-1 text-2xl font-bold text-slate-900">
            Food Management
          </h1>


          <p className="mt-1 text-sm text-slate-500">
            Create and manage the meals available to staff.
          </p>

        </div>


        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#B10F16] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#920C12]"
        >

          <Plus
            size={18}
          />

          Add Meal

        </button>

      </div>


      {/* ======================================
          MANAGEMENT SUMMARY
      ======================================= */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">


        <SummaryCard
          icon={
            <UtensilsCrossed
              size={20}
            />
          }
          label="Total Meals"
          value={String(summary.total)}
        />


        <SummaryCard
          icon={
            <CalendarDays
              size={20}
            />
          }
          label="This Week"
          value={String(summary.thisWeek)}
        />


        <SummaryCard
          icon={
            <CheckCircle2
              size={20}
            />
          }
          label="Active Meals"
          value={String(summary.active)}
        />


      </div>


      {/* ======================================
          MEALS MANAGEMENT
      ======================================= */}

      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">


        {/* TOOLBAR */}

        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">


          <div>

            <h2 className="text-lg font-bold text-slate-900">
              Meals
            </h2>


            <p className="mt-1 text-sm text-slate-500">
              Manage your current and upcoming food menu.
            </p>

          </div>


          {/* SEARCH */}

          <div className="relative w-full sm:w-72">

            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />


            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search meals..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[#B10F16] focus:bg-white"
            />

          </div>


        </div>


        {/* ======================================
            EMPTY / MEAL LIST
        ======================================= */}

        {filteredMeals.length === 0 &&
        meals.length > 0 ? (

          /* SEARCH EMPTY */

          <div className="flex min-h-[320px] flex-col items-center justify-center px-6 text-center">

            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">

              <Search
                size={26}
              />

            </div>


            <h3 className="mt-5 text-lg font-bold text-slate-900">
              No meals found
            </h3>


            <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
              We couldn't find a meal matching "{search}".
            </p>

          </div>

        ) : filteredMeals.length === 0 ? (

          /* DATABASE EMPTY */

          <div className="flex min-h-[320px] flex-col items-center justify-center px-6 text-center">

            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FDEBEC] text-[#B10F16]">

              <UtensilsCrossed
                size={28}
              />

            </div>


            <h3 className="mt-5 text-lg font-bold text-slate-900">
              No meals yet
            </h3>


            <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
              Start building your food menu by adding the first meal.
              Staff will be able to select meals based on their assigned
              dates.
            </p>


            <button
              type="button"
              onClick={openAddModal}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#B10F16] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#920C12]"
            >

              <Plus
                size={18}
              />

              Add First Meal

            </button>

          </div>

        ) : (

          /* MEAL LIST */

          <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-2 xl:grid-cols-3">

            {filteredMeals.map(
              (meal) => (

                <MealCard
                  key={meal.id}
                  meal={meal}

                  onEdit={() =>
                    openEditModal(
                      meal
                    )
                  }

                  onToggleStatus={() =>
                    handleStatusChange(
                      meal
                    )
                  }

                  onDelete={() =>
                    handleDelete(
                      meal
                    )
                  }

                  statusLoading={
                    updateStatus.isPending &&
                    updateStatus.variables?.id ===
                      meal.id
                  }

                  deleteLoading={
                    deleteMeal.isPending &&
                    deleteMeal.variables ===
                      meal.id
                  }
                />

              )
            )}

          </div>

        )}


      </div>


      {/* ======================================
          MEAL DEMAND HEADER
      ======================================= */}

      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">


        <div>

          <h2 className="text-base font-bold text-slate-900">
            Meal Demand
          </h2>


          <p className="text-sm text-slate-500">
            View staff meal selections for a specific date.
          </p>

        </div>


        {/* DATE SELECTOR */}

        <div className="flex items-center gap-2">

          <CalendarDays
            size={18}
            className="text-slate-400"
          />


          <input
            type="date"
            value={selectedDate}
            onChange={(event) =>
              setSelectedDate(
                event.target.value
              )
            }
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none transition focus:border-[#B10F16] focus:bg-white"
          />

        </div>

      </div>


      {/* ======================================
          MEAL DEMAND
      ======================================= */}

      {demandSummaryError ? (

        <div className="rounded-2xl border border-red-100 bg-red-50 p-5 text-sm text-red-600">

          Unable to load meal demand for the selected date.

        </div>

      ) : (

        <DemandSummaryCard
          totalSelections={
            demandSummary?.totalSelections ?? 0
          }

          options={
            demandSummary?.options ?? []
          }

          loading={
            demandSummaryLoading
          }
        />

      )}


      {/* ======================================
          ADD / EDIT MODAL
      ======================================= */}

      {showModal && (

        <MealModal
          editingMeal={
            editingMeal
          }

          name={
            name
          }

          image={
            image
          }

          mealDate={
            mealDate
          }

          setName={
            setName
          }

          setImage={
            setImage
          }

          setMealDate={
            setMealDate
          }

          onClose={
            closeModal
          }

          onSubmit={
            handleSubmit
          }

          loading={
            createMeal.isPending ||
            updateMeal.isPending
          }
        />

      )}

    </div>
  );
}