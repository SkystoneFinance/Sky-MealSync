import {
  Users,
  Utensils,
} from "lucide-react";

import type { FoodOptionSummary } from "../../types/foodOption";

interface SummaryCardProps {
  totalSelections: number;
  options: FoodOptionSummary[];
  loading?: boolean;
}

export default function SummaryCard({
  totalSelections,
  options,
  loading = false,
}: SummaryCardProps) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-5">
          <div className="h-5 w-40 animate-pulse rounded bg-gray-200" />
          <div className="mt-2 h-4 w-56 animate-pulse rounded bg-gray-100" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-24 animate-pulse rounded-xl bg-gray-100"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      {/* HEADER */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900">
            Today's Meal Demand
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            See how many staff selected each meal option.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2">
          <Users
            size={18}
            className="text-[#B10F16]"
          />

          <div>
            <p className="text-xs text-gray-500">
              Total
            </p>

            <p className="text-lg font-bold text-[#B10F16]">
              {totalSelections}
            </p>
          </div>
        </div>
      </div>

      {/* MEAL DEMAND */}
      {options.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-200 p-8 text-center">
          <Utensils
            size={28}
            className="mx-auto text-gray-300"
          />

          <p className="mt-3 text-sm font-medium text-gray-600">
            No meal options available for this date.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {options.map((option) => (
            <div
              key={option.id}
              className="rounded-xl border border-gray-100 bg-gray-50 p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <img
                    src={option.image}
                    alt={option.name}
                    className="h-12 w-12 rounded-lg object-cover"
                  />

                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold text-gray-900">
                      {option.name}
                    </h3>

                    <p className="text-xs text-gray-500">
                      {option.isActive
                        ? "Active meal"
                        : "Inactive meal"}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xl font-bold text-[#B10F16]">
                    {option.selectionCount}
                  </p>

                  <p className="text-xs text-gray-500">
                    selected
                  </p>
                </div>
              </div>

              {/* DEMAND BAR */}
              <div className="mt-4">
                <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-full rounded-full bg-[#B10F16] transition-all duration-500"
                    style={{
                      width:
                        totalSelections > 0
                          ? `${Math.min(
                              (option.selectionCount /
                                totalSelections) *
                                100,
                              100
                            )}%`
                          : "0%",
                    }}
                  />
                </div>

                <p className="mt-2 text-right text-xs text-gray-400">
                  {totalSelections > 0
                    ? `${Math.round(
                        (option.selectionCount /
                          totalSelections) *
                          100
                      )}% of selections`
                    : "0%"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}