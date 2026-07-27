import { ChevronDown } from "lucide-react";

import MealCard from "./mealCard";

import type { Meal } from "../types/dashboard.types";

interface MealsSectionProps {
  meals: Meal[];
}

export default function MealsSection({
  meals,
}: MealsSectionProps) {
  return (
    <section
      className="
        rounded-3xl
        bg-white
        p-6
        shadow-[0_10px_30px_rgba(0,0,0,.08)]
      "
    >
      {/* Header */}

      <div className="mb-6 flex items-center justify-between">

        <h2
          className="
            text-2xl
            font-bold
            uppercase
            tracking-wide
          "
        >
          STAFF MEAL GRID
        </h2>

        <button
          className="
            flex
            items-center
            gap-2
            rounded-full
            bg-gray-100
            px-4
            py-2
            text-sm
            font-medium
          "
        >
          Today's Menu

          <ChevronDown size={18} />
        </button>

      </div>

      {/* Grid */}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

        {meals.map((meal) => (
          <MealCard
            key={meal.id}
            meal={meal}
          />
        ))}

      </div>

    </section>
  );
}