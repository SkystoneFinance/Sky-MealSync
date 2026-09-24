import {
  useMemo,
  useState,
} from "react";

import {
  Loader2,
  Check,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import {
  useFoodOptionsByDate,
} from "../../hooks/useFoodOptions";

import {
  useCreateMealSelection,
  useMyMealSelections,
  useUpdateMealSelection,
} from "../../hooks/useMealSelection";

type DayKey =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday";

interface Day {
  name: DayKey;
  date: string;
}

const DAY_NAMES: DayKey[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
];

function getMonday(date: Date) {
  const result =
    new Date(date);

  const day =
    result.getDay();

  const difference =
    day === 0
      ? -6
      : 1 - day;

  result.setDate(
    result.getDate() + difference
  );

  result.setHours(0, 0, 0, 0);

  return result;
}

function formatDate(
  date: Date
) {
  const year =
    date.getFullYear();

  const month =
    String(
      date.getMonth() + 1
    ).padStart(2, "0");

  const day =
    String(
      date.getDate()
    ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default function WeeklyMealPlan() {
  const [weekOffset, setWeekOffset] =
    useState(0);

  const [selectedMeals, setSelectedMeals] =
    useState<Record<string, string>>({});

  const [submitted, setSubmitted] =
    useState(false);

  const today = useMemo(
    () => new Date(),
    []
  );

  const monday = useMemo(() => {
    const date =
      getMonday(today);

    date.setDate(
      date.getDate() +
        weekOffset * 7
    );

    return date;
  }, [today, weekOffset]);

  const days: Day[] =
    useMemo(() => {
      return DAY_NAMES.map(
        (name, index) => {
          const date =
            new Date(monday);

          date.setDate(
            monday.getDate() +
              index
          );

          return {
            name,
            date: formatDate(date),
          };
        }
      );
    }, [monday]);

  const {
    data: selections = [],
    isLoading: selectionsLoading,
  } = useMyMealSelections();

  const createSelection =
  useCreateMealSelection();

const updateSelection =
  useUpdateMealSelection();

  const handleSelect = (
    date: string,
    foodOptionId: string
  ) => {
    setSelectedMeals(
      (current) => ({
        ...current,
        [date]: foodOptionId,
      })
    );
  };

  const getExistingSelection = (
    date: string
  ) => {
    return selections.find(
      (selection) =>
        selection.mealDate.startsWith(
          date
        )
    );
  };

  const getSelectedFood = (
    date: string
  ) => {
    return (
      selectedMeals[date] ||
      getExistingSelection(date)
        ?.foodOptionId ||
      ""
    );
  };

  const handleSubmit = async () => {
  const missingDay = days.find(
    (day) =>
      !getSelectedFood(day.date)
  );

  if (missingDay) {
    alert(
      `Please select a meal for ${missingDay.name}.`
    );

    return;
  }

  try {
    for (const day of days) {
      const foodOptionId =
        getSelectedFood(day.date);

      const existing =
        getExistingSelection(day.date);

      // ==========================
      // NEW SELECTION
      // ==========================

      if (!existing) {
        await createSelection.mutateAsync({
          foodOptionId,
          mealDate: day.date,
        });

        continue;
      }

      // ==========================
      // CHANGE FUTURE SELECTION
      // ==========================

      if (
        existing.foodOptionId !==
        foodOptionId
      ) {
        await updateSelection.mutateAsync({
          id: existing.id,
          foodOptionId,
        });
      }
    }

    setSubmitted(true);

  } catch (error) {
    console.error(
      "Failed to submit meal plan:",
      error
    );

    alert(
      "Something went wrong while saving your meal plan."
    );
  }
};

  const hasAllSelections =
    days.every(
      (day) =>
        Boolean(
          getSelectedFood(day.date)
        )
    );
    

  if (selectionsLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2
          className="animate-spin"
          size={30}
        />
      </div>
    );
  }

  function isDateLocked(dateString: string) {
  const today = new Date();

  today.setHours(
    0,
    0,
    0,
    0
  );

  const selectedDate = new Date(
    `${dateString}T00:00:00`
  );

  selectedDate.setHours(
    0,
    0,
    0,
    0
  );

  return selectedDate <= today;
}

  return (
    <div className="space-y-6">
      {/* HEADER */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Weekly Meal Plan
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Select your meal for each day
            of the week.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() =>
              setWeekOffset(
                (value) =>
                  value - 1
              )
            }
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="min-w-[150px] text-center text-sm font-semibold">
            {monday.toLocaleDateString(
              "en-US",
              {
                month: "short",
                day: "numeric",
              }
            )}
          </div>

          <button
            type="button"
            onClick={() =>
              setWeekOffset(
                (value) =>
                  value + 1
              )
            }
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* DAYS */}

      <div className="space-y-6">
        {days.map((day) => (
          <DayMealSelector
  key={day.date}
  day={day}
  selectedFoodId={getSelectedFood(day.date)}
  onSelect={(foodId) =>
    handleSelect(
      day.date,
      foodId
    )
  }
  locked={isDateLocked(day.date)}
/>
        ))}
      </div>

      {/* SUBMIT */}

      <div className="flex justify-end border-t border-gray-200 pt-6">
        <button
          type="button"
          disabled={
            !hasAllSelections ||
            createSelection.isPending ||
            submitted
          }
          onClick={handleSubmit}
          className="flex items-center gap-2 rounded-xl bg-[#B10F16] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#920c12] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {createSelection.isPending ? (
            <>
              <Loader2
                size={18}
                className="animate-spin"
              />

              Saving...
            </>
          ) : submitted ? (
            <>
              <Check size={18} />

              Meal Plan Saved
            </>
          ) : (
            "Submit Weekly Plan"
          )}
        </button>
      </div>
    </div>
  );
}

function DayMealSelector({
  day,
  selectedFoodId,
  onSelect,
  locked,
}: {
  day: Day;
  selectedFoodId: string;
  onSelect: (
    foodOptionId: string
  ) => void;
  locked: boolean;
}) {
  const {
    data: foodOptions = [],
    isLoading,
    isError,
  } =
    useFoodOptionsByDate(
      day.date
    );

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      {/* DAY HEADER */}

      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">
            {day.name}
          </h2>

          <p className="text-sm text-gray-500">
            {new Date(
              `${day.date}T00:00:00`
            ).toLocaleDateString(
              "en-US",
              {
                month: "long",
                day: "numeric",
                year: "numeric",
              }
            )}
          </p>
        </div>

        {locked ? (
  <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
    🔒 Locked
  </div>
) : selectedFoodId ? (
  <div className="flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
    <Check size={14} />
    Selected
  </div>
) : null}
      </div>

      {/* FOOD OPTIONS */}

      {isLoading ? (
        <div className="flex h-32 items-center justify-center">
          <Loader2
            className="animate-spin text-gray-400"
            size={24}
          />
        </div>
      ) : isError ? (
        <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600">
          Unable to load food options
          for {day.name}.
        </div>
      ) : foodOptions.length === 0 ? (
        <div className="rounded-xl bg-gray-50 p-6 text-center text-sm text-gray-500">
          No food options available
          for this day.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {foodOptions.map(
            (food) => {
              const selected =
                selectedFoodId ===
                food.id;

              return (
                <button
                key={food.id}
                type="button"
                disabled={locked}
                onClick={() => {
                  if (!locked) {
                    onSelect(food.id);
                  }
                }}
                  className={`group overflow-hidden rounded-xl border-2 text-left transition ${
                  selected
                    ? "border-[#B10F16] bg-red-50"
                    : locked
                      ? "cursor-not-allowed border-gray-100 bg-gray-50 opacity-70"
                      : "border-gray-100 bg-white hover:border-gray-300"
                }`}
                >
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={food.image}
                      alt={food.name}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />

                    {selected && (
                      <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#B10F16] text-white shadow">
                        <Check
                          size={18}
                        />
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900">
                      {food.name}
                    </h3>

                    <p
                      className={`mt-1 text-xs font-medium ${
                        selected
                          ? "text-[#B10F16]"
                          : locked
                            ? "text-slate-400"
                            : "text-gray-500"
                      }`}
                    >
                      {locked
                        ? selected
                          ? "Selected for this day"
                          : "Selection closed"
                        : selected
                          ? "Selected"
                          : "Select this meal"}
                    </p>
                  </div>
                </button>
              );
            }
          )}
        </div>
      )}
    </section>
  );
}


