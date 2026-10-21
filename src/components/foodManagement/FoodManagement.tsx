import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  CalendarRange,
  Eye,
  EyeOff,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";

import {
  Badge,
  Button,
  Callout,
  Card,
  CardHeader,
  PageHeader,
  PageLoader,
  WeekSwitcher,
} from "../ui";
import DishModal from "./DishModal";
import DishThumbnail from "./DishThumbnail";

import {
  useDeleteFoodOption,
  useFoodOptions,
  useUpdateFoodOptionStatus,
} from "../../hooks/useFoodOptions";
import { apiErrorMessage, formatDay } from "../../utils/mealPlanDates";

import type { FoodOption } from "../../types/foodOption";

// ==========================================
// WEEK HELPERS (UTC, "YYYY-MM-DD" keys)
// ==========================================

const DAY_MS = 24 * 60 * 60 * 1000;

function toKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

// Monday (UTC midnight) of the current week.
function currentMonday() {
  const now = new Date();
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const daysSinceMonday = (new Date(today).getUTCDay() + 6) % 7;
  return today - daysSinceMonday * DAY_MS;
}

function weekDays(offset: number) {
  const monday = currentMonday() + offset * 7 * DAY_MS;
  return Array.from({ length: 5 }, (_, index) =>
    toKey(new Date(monday + index * DAY_MS))
  );
}

function weekSublabel(offset: number) {
  if (offset === 0) return "This week";
  if (offset === 1) return "Next week";
  if (offset === -1) return "Last week";
  return offset > 0 ? `In ${offset} weeks` : `${-offset} weeks ago`;
}

function weekLabel(days: string[]) {
  const first = formatDay(days[0], { day: "numeric", month: "short" });
  const last = formatDay(days[days.length - 1], {
    day: "numeric",
    month: "short",
  });
  return `${first} – ${last}`;
}

// ==========================================
// PAGE
// ==========================================

type ModalState =
  | { mode: "add"; date: string }
  | { mode: "edit"; dish: FoodOption }
  | null;

export default function FoodManagement() {
  const { data: dishes = [], isLoading, isError, refetch } = useFoodOptions();

  const [weekOffset, setWeekOffset] = useState(1);
  const [modal, setModal] = useState<ModalState>(null);

  const days = useMemo(() => weekDays(weekOffset), [weekOffset]);

  const dishesByDay = useMemo(() => {
    const map = new Map<string, FoodOption[]>();
    for (const dish of dishes) {
      const key = dish.mealDate.slice(0, 10);
      const list = map.get(key);
      if (list) list.push(dish);
      else map.set(key, [dish]);
    }
    for (const list of map.values()) {
      list.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    }
    return map;
  }, [dishes]);

  const weekTotal = days.reduce(
    (total, day) => total + (dishesByDay.get(day)?.length ?? 0),
    0
  );

  const updateStatus = useUpdateFoodOptionStatus();
  const deleteDish = useDeleteFoodOption();

  const toggleStatus = async (dish: FoodOption) => {
    try {
      await updateStatus.mutateAsync({ id: dish.id, isActive: !dish.isActive });
      toast.success(dish.isActive ? `${dish.name} disabled` : `${dish.name} enabled`);
    } catch (error) {
      toast.error(apiErrorMessage(error, "Couldn't change the dish status."));
    }
  };

  const removeDish = async (dish: FoodOption) => {
    if (!window.confirm(`Delete "${dish.name}"? This can't be undone.`)) return;

    try {
      await deleteDish.mutateAsync(dish.id);
      toast.success(`${dish.name} deleted`);
    } catch (error) {
      // 409 when staff have already chosen it — the server explains why.
      toast.error(apiErrorMessage(error, "Couldn't delete the dish."));
    }
  };

  const busyId = (mutation: { isPending: boolean; variables?: unknown }) => {
    if (!mutation.isPending) return null;
    const vars = mutation.variables;
    if (typeof vars === "string") return vars;
    return (vars as { id?: string } | undefined)?.id ?? null;
  };

  const statusBusyId = busyId(updateStatus);
  const deleteBusyId = busyId(deleteDish);

  return (
    <div>
      <PageHeader
        title="Menu"
        description="Add the dishes for each day. Publish the week from Weekly planning when it's ready."
        actions={
          <Link
            to="/weekly-planning"
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 text-sm font-medium whitespace-nowrap text-zinc-800 shadow-sm transition-colors hover:bg-zinc-50"
          >
            <CalendarRange size={16} />
            Weekly planning
          </Link>
        }
      />

      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <WeekSwitcher
            label={weekLabel(days)}
            sublabel={weekSublabel(weekOffset)}
            onPrevious={() => setWeekOffset((value) => value - 1)}
            onNext={() => setWeekOffset((value) => value + 1)}
          />
          {!isLoading && !isError && (
            <p className="text-sm text-zinc-500">
              {weekTotal === 0
                ? "No dishes this week yet"
                : `${weekTotal} ${weekTotal === 1 ? "dish" : "dishes"} this week`}
            </p>
          )}
        </div>

        {isLoading ? (
          <PageLoader />
        ) : isError ? (
          <Callout
            tone="danger"
            title="Couldn't load the menu"
            action={
              <Button variant="secondary" size="sm" onClick={() => refetch()}>
                Try again
              </Button>
            }
          >
            Check your connection and try again.
          </Callout>
        ) : (
          days.map((day) => {
            const dayDishes = dishesByDay.get(day) ?? [];

            return (
              <Card key={day}>
                <CardHeader
                  title={formatDay(day)}
                  description={
                    dayDishes.length === 0
                      ? undefined
                      : `${dayDishes.length} ${dayDishes.length === 1 ? "dish" : "dishes"}`
                  }
                  actions={
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={<Plus size={16} />}
                      onClick={() => setModal({ mode: "add", date: day })}
                      aria-label={`Add dish for ${formatDay(day)}`}
                    >
                      Add dish
                    </Button>
                  }
                />

                {dayDishes.length === 0 ? (
                  <p className="px-5 py-6 text-sm text-zinc-400">No dishes yet</p>
                ) : (
                  <ul className="divide-y divide-zinc-100">
                    {dayDishes.map((dish) => (
                      <li
                        key={dish.id}
                        className="flex flex-col gap-3 px-5 py-3 sm:flex-row sm:items-center"
                      >
                        <div className="flex min-w-0 flex-1 items-center gap-3">
                          <DishThumbnail
                            key={dish.image}
                            src={dish.image}
                            alt={dish.name}
                            className={
                              dish.isActive ? "h-12 w-12" : "h-12 w-12 opacity-50"
                            }
                          />
                          <div className="flex min-w-0 flex-wrap items-center gap-2">
                            <p
                              className={
                                dish.isActive
                                  ? "truncate font-medium text-zinc-900"
                                  : "truncate font-medium text-zinc-500"
                              }
                            >
                              {dish.name}
                            </p>
                            {!dish.isActive && <Badge>Disabled</Badge>}
                          </div>
                        </div>

                        <div className="flex items-center gap-1 pl-15 sm:pl-0">
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={<Pencil size={15} />}
                            onClick={() => setModal({ mode: "edit", dish })}
                            aria-label={`Edit ${dish.name}`}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={dish.isActive ? <EyeOff size={15} /> : <Eye size={15} />}
                            loading={statusBusyId === dish.id}
                            onClick={() => toggleStatus(dish)}
                            aria-label={`${dish.isActive ? "Disable" : "Enable"} ${dish.name}`}
                          >
                            {dish.isActive ? "Disable" : "Enable"}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-700 hover:bg-red-50 hover:text-red-800"
                            icon={<Trash2 size={15} />}
                            loading={deleteBusyId === dish.id}
                            onClick={() => removeDish(dish)}
                            aria-label={`Delete ${dish.name}`}
                          >
                            Delete
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </Card>
            );
          })
        )}
      </div>

      {modal && (
        <DishModal
          key={modal.mode === "edit" ? modal.dish.id : modal.date}
          dish={modal.mode === "edit" ? modal.dish : null}
          defaultDate={modal.mode === "add" ? modal.date : days[0]}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
