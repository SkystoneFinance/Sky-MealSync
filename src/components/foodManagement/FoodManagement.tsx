import {
  CalendarDays,
  CheckCircle2,
  Edit3,
  Image as ImageIcon,
  Loader2,
  Plus,
  Search,
  Trash2,
  UtensilsCrossed,
  X,
  Power,
} from "lucide-react";

import { useMemo, useState } from "react";

import {
  useCreateFoodOption,
  useDeleteFoodOption,
  useFoodOptions,
  useUpdateFoodOption,
  useUpdateFoodOptionStatus,
} from "../../hooks/useFoodOptions";

import type { FoodOption } from "../../types/foodOption";


// ==========================================
// HELPERS
// ==========================================

function formatDate(date: string) {
  return new Date(`${date.slice(0, 10)}T00:00:00`).toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  );
}


function getTodayDate() {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}


function getMonday(date: Date) {
  const result = new Date(date);

  const day = result.getDay();

  const difference =
    day === 0
      ? -6
      : 1 - day;

  result.setDate(
    result.getDate() + difference
  );

  result.setHours(
    0,
    0,
    0,
    0
  );

  return result;
}


// ==========================================
// COMPONENT
// ==========================================

export default function FoodManagement() {

  const {
    data: meals = [],
    isLoading,
    isError,
  } = useFoodOptions();


  const createMeal =
    useCreateFoodOption();

  const updateMeal =
    useUpdateFoodOption();

  const updateStatus =
    useUpdateFoodOptionStatus();

  const deleteMeal =
    useDeleteFoodOption();


  const [search, setSearch] =
    useState("");

  const [showModal, setShowModal] =
    useState(false);

  const [editingMeal, setEditingMeal] =
    useState<FoodOption | null>(null);


  const [name, setName] =
    useState("");

  const [image, setImage] =
    useState("");

  const [mealDate, setMealDate] =
    useState(getTodayDate());


  // ==========================================
  // SUMMARY
  // ==========================================

  const summary = useMemo(() => {

    const today =
      new Date();

    const monday =
      getMonday(today);

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


  // ==========================================
  // FILTER
  // ==========================================

  const filteredMeals =
    useMemo(() => {

      const value =
        search.trim().toLowerCase();

      if (!value) {
        return meals;
      }

      return meals.filter((meal) =>
        meal.name
          .toLowerCase()
          .includes(value)
      );

    }, [meals, search]);


  // ==========================================
  // OPEN ADD MODAL
  // ==========================================

  const openAddModal = () => {

    setEditingMeal(null);

    setName("");

    setImage("");

    setMealDate(
      getTodayDate()
    );

    setShowModal(true);

  };


  // ==========================================
  // OPEN EDIT MODAL
  // ==========================================

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


  // ==========================================
  // CLOSE MODAL
  // ==========================================

  const closeModal = () => {

    if (
      createMeal.isPending ||
      updateMeal.isPending
    ) {
      return;
    }

    setShowModal(false);

  };


  // ==========================================
  // SUBMIT
  // ==========================================

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


  // ==========================================
  // STATUS
  // ==========================================

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


  // ==========================================
  // DELETE
  // ==========================================

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


  // ==========================================
  // LOADING
  // ==========================================

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


  // ==========================================
  // ERROR
  // ==========================================

  if (isError) {

    return (
      <div className="mx-auto flex min-h-[400px] w-full max-w-7xl items-center justify-center">

        <div className="text-center">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FDEBEC] text-[#B10F16]">
            <UtensilsCrossed size={24} />
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

          <Plus size={18} />

          Add Meal

        </button>

      </div>


      {/* ======================================
          SUMMARY
      ======================================= */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

        <SummaryCard
          icon={
            <UtensilsCrossed size={20} />
          }
          label="Total Meals"
          value={String(summary.total)}
        />


        <SummaryCard
          icon={
            <CalendarDays size={20} />
          }
          label="This Week"
          value={String(summary.thisWeek)}
        />


        <SummaryCard
          icon={
            <CheckCircle2 size={20} />
          }
          label="Active Meals"
          value={String(summary.active)}
        />

      </div>


      {/* ======================================
          MEALS CARD
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
                setSearch(event.target.value)
              }
              placeholder="Search meals..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[#B10F16] focus:bg-white"
            />

          </div>

        </div>


        {/* ======================================
            EMPTY SEARCH RESULT
        ======================================= */}

        {filteredMeals.length === 0 && meals.length > 0 ? (

          <div className="flex min-h-[320px] flex-col items-center justify-center px-6 text-center">

            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <Search size={26} />
            </div>

            <h3 className="mt-5 text-lg font-bold text-slate-900">
              No meals found
            </h3>

            <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
              We couldn't find a meal matching "{search}".
            </p>

          </div>

        ) : filteredMeals.length === 0 ? (

          /* ======================================
             EMPTY DATABASE
          ======================================= */

          <div className="flex min-h-[320px] flex-col items-center justify-center px-6 text-center">

            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FDEBEC] text-[#B10F16]">
              <UtensilsCrossed size={28} />
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

              <Plus size={18} />

              Add First Meal

            </button>

          </div>

        ) : (

          /* ======================================
             MEAL LIST
          ======================================= */

          <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-2 xl:grid-cols-3">

            {filteredMeals.map((meal) => (

              <MealCard
                key={meal.id}
                meal={meal}
                onEdit={() =>
                  openEditModal(meal)
                }
                onToggleStatus={() =>
                  handleStatusChange(meal)
                }
                onDelete={() =>
                  handleDelete(meal)
                }
                statusLoading={
                  updateStatus.isPending &&
                  updateStatus.variables?.id === meal.id
                }
                deleteLoading={
                  deleteMeal.isPending &&
                  deleteMeal.variables === meal.id
                }
              />

            ))}

          </div>

        )}

      </div>


      {/* ======================================
          ADD / EDIT MODAL
      ======================================= */}

      {showModal && (

        <MealModal
          editingMeal={editingMeal}
          name={name}
          image={image}
          mealDate={mealDate}
          setName={setName}
          setImage={setImage}
          setMealDate={setMealDate}
          onClose={closeModal}
          onSubmit={handleSubmit}
          loading={
            createMeal.isPending ||
            updateMeal.isPending
          }
        />

      )}

    </div>
  );
}


// ==========================================
// MEAL CARD
// ==========================================

function MealCard({
  meal,
  onEdit,
  onToggleStatus,
  onDelete,
  statusLoading,
  deleteLoading,
}: {
  meal: FoodOption;
  onEdit: () => void;
  onToggleStatus: () => void;
  onDelete: () => void;
  statusLoading: boolean;
  deleteLoading: boolean;
}) {

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:shadow-md">

      {/* IMAGE */}

      <div className="relative h-48 w-full overflow-hidden bg-slate-100">

        {meal.image ? (

          <img
            src={meal.image}
            alt={meal.name}
            className="h-full w-full object-cover transition duration-300 hover:scale-105"
          />

        ) : (

          <div className="flex h-full items-center justify-center text-slate-400">

            <ImageIcon size={32} />

          </div>

        )}


        {/* STATUS */}

        <div className="absolute right-3 top-3">

          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold shadow-sm ${
              meal.isActive
                ? "bg-white text-green-700"
                : "bg-white text-slate-500"
            }`}
          >

            <span
              className={`h-2 w-2 rounded-full ${
                meal.isActive
                  ? "bg-green-500"
                  : "bg-slate-400"
              }`}
            />

            {meal.isActive
              ? "Active"
              : "Inactive"}

          </span>

        </div>

      </div>


      {/* CONTENT */}

      <div className="p-5">

        <div className="flex items-start justify-between gap-3">

          <div className="min-w-0">

            <h3 className="truncate text-base font-bold text-slate-900">
              {meal.name}
            </h3>

            <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">

              <CalendarDays size={15} />

              {formatDate(meal.mealDate)}

            </div>

          </div>

        </div>


        {/* ACTIONS */}

        <div className="mt-5 grid grid-cols-3 gap-2">

          <button
            type="button"
            onClick={onEdit}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          >

            <Edit3 size={15} />

            Edit

          </button>


          <button
            type="button"
            onClick={onToggleStatus}
            disabled={statusLoading}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:opacity-50"
          >

            {statusLoading ? (

              <Loader2
                size={15}
                className="animate-spin"
              />

            ) : (

              <Power size={15} />

            )}

            {meal.isActive
              ? "Disable"
              : "Activate"}

          </button>


          <button
            type="button"
            onClick={onDelete}
            disabled={deleteLoading}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-red-100 px-3 py-2.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
          >

            {deleteLoading ? (

              <Loader2
                size={15}
                className="animate-spin"
              />

            ) : (

              <Trash2 size={15} />

            )}

            Delete

          </button>

        </div>

      </div>

    </div>
  );
}


// ==========================================
// MEAL MODAL
// ==========================================

function MealModal({
  editingMeal,
  name,
  image,
  mealDate,
  setName,
  setImage,
  setMealDate,
  onClose,
  onSubmit,
  loading,
}: {
  editingMeal: FoodOption | null;
  name: string;
  image: string;
  mealDate: string;
  setName: (value: string) => void;
  setImage: (value: string) => void;
  setMealDate: (value: string) => void;
  onClose: () => void;
  onSubmit: (
    event: React.FormEvent
  ) => void;
  loading: boolean;
}) {

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">

      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white shadow-2xl">

        {/* HEADER */}

        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">

          <div>

            <h2 className="text-lg font-bold text-slate-900">
              {editingMeal
                ? "Edit Meal"
                : "Add Meal"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {editingMeal
                ? "Update the meal details below."
                : "Add a meal to the staff menu."}
            </p>

          </div>


          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
          >

            <X size={19} />

          </button>

        </div>


        {/* FORM */}

        <form
          onSubmit={onSubmit}
          className="space-y-5 p-6"
        >

          {/* NAME */}

          <div>

            <label className="text-sm font-semibold text-slate-700">
              Meal Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              placeholder="e.g. Jollof Rice & Chicken"
              required
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#B10F16] focus:bg-white"
            />

          </div>


          {/* IMAGE URL */}

          <div>

            <label className="text-sm font-semibold text-slate-700">
              Meal Image URL
            </label>

            <input
              type="url"
              value={image}
              onChange={(event) =>
                setImage(event.target.value)
              }
              placeholder="https://example.com/meal.jpg"
              required
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#B10F16] focus:bg-white"
            />

            <p className="mt-1.5 text-xs text-slate-400">
              Enter a publicly accessible image URL.
            </p>

          </div>


          {/* IMAGE PREVIEW */}

          {image && (

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">

              <img
                src={image}
                alt="Meal preview"
                className="h-48 w-full object-cover"
                onError={(event) => {
                  event.currentTarget.style.display =
                    "none";
                }}
              />

            </div>

          )}


          {/* DATE */}

          <div>

            <label className="text-sm font-semibold text-slate-700">
              Meal Date
            </label>

            <input
              type="date"
              value={mealDate}
              onChange={(event) =>
                setMealDate(event.target.value)
              }
              required
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#B10F16] focus:bg-white"
            />

          </div>


          {/* ACTIONS */}

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>


            <button
              type="submit"
              disabled={
                loading ||
                !name.trim() ||
                !image.trim() ||
                !mealDate
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#B10F16] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#920C12] disabled:cursor-not-allowed disabled:opacity-50"
            >

              {loading && (

                <Loader2
                  size={17}
                  className="animate-spin"
                />

              )}

              {editingMeal
                ? "Save Changes"
                : "Add Meal"}

            </button>

          </div>

        </form>

      </div>

    </div>
  );
}


// ==========================================
// SUMMARY CARD
// ==========================================

function SummaryCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex items-center justify-between">

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FDEBEC] text-[#B10F16]">
          {icon}
        </div>

      </div>


      <p className="mt-4 text-sm font-medium text-slate-500">
        {label}
      </p>


      <p className="mt-1 text-2xl font-bold text-slate-900">
        {value}
      </p>

    </div>
  );
}