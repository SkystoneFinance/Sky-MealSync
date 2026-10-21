import { useMemo, useState } from "react";

import { Search, Users } from "lucide-react";

import {
  Avatar,
  Card,
  CardHeader,
  EmptyState,
  Input,
  Spinner,
  Table,
  Td,
  Th,
} from "../ui";
import type { StaffMealSummary } from "../../types/report";

// lastMeal is the meal *date* (no scan time), shown in Lagos time.
function formatMealDate(iso: string | null) {
  if (!iso) return "No meals";

  return new Date(iso).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "Africa/Lagos",
  });
}

interface Props {
  data: StaffMealSummary[];
  loading: boolean;
  error: boolean;
  periodLabel: string;
}

export default function AttendanceTable({
  data,
  loading,
  error,
  periodLabel,
}: Props) {
  const [query, setQuery] = useState("");

  const rows = useMemo(() => {
    const term = query.trim().toLowerCase();

    return data
      .filter(
        (staff) =>
          !term ||
          staff.name.toLowerCase().includes(term) ||
          staff.staffNumber.toLowerCase().includes(term) ||
          staff.department.toLowerCase().includes(term)
      )
      .sort(
        (a, b) => b.mealCount - a.mealCount || a.name.localeCompare(b.name)
      );
  }, [data, query]);

  let body;

  if (loading) {
    body = (
      <div className="flex justify-center py-12">
        <Spinner />
      </div>
    );
  } else if (error) {
    body = (
      <EmptyState
        icon={<Users size={20} />}
        title="Couldn't load staff"
        description="Something went wrong fetching the staff summary. Try again shortly."
      />
    );
  } else if (rows.length === 0) {
    body = (
      <EmptyState
        icon={<Users size={20} />}
        title={query ? "No matching staff" : "No staff yet"}
        description={
          query
            ? "Try a different name, staff number or department."
            : "Active staff will appear here once they are added."
        }
      />
    );
  } else {
    body = (
      <>
        {/* Mobile: stacked list */}
        <ul className="divide-y divide-zinc-100 sm:hidden">
          {rows.map((staff) => (
            <li key={staff.staffId} className="flex items-center gap-3 px-5 py-3">
              <Avatar name={staff.name} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-zinc-900">
                  {staff.name}
                </p>
                <p className="truncate text-xs text-zinc-500">
                  {staff.staffNumber} · {staff.department}
                </p>
              </div>
              <div className="text-right">
                <p className="tabular text-sm font-semibold text-zinc-900">
                  {staff.mealCount}
                  <span className="sr-only"> meals</span>
                </p>
                <p className="text-xs text-zinc-500">
                  {formatMealDate(staff.lastMeal)}
                </p>
              </div>
            </li>
          ))}
        </ul>

        {/* Desktop: table */}
        <div className="hidden sm:block">
          <Table>
            <thead>
              <tr>
                <Th>Staff</Th>
                <Th>Staff no.</Th>
                <Th>Department</Th>
                <Th className="text-right">Meals</Th>
                <Th>Last meal</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((staff) => (
                <tr key={staff.staffId} className="hover:bg-zinc-50/60">
                  <Td>
                    <div className="flex items-center gap-3">
                      <Avatar name={staff.name} size="sm" />
                      <span className="font-medium text-zinc-900">
                        {staff.name}
                      </span>
                    </div>
                  </Td>
                  <Td className="tabular text-zinc-600">{staff.staffNumber}</Td>
                  <Td className="text-zinc-600">{staff.department}</Td>
                  <Td className="tabular text-right font-semibold text-zinc-900">
                    {staff.mealCount}
                  </Td>
                  <Td className="text-zinc-600">
                    {staff.lastMeal ? (
                      formatMealDate(staff.lastMeal)
                    ) : (
                      <span className="text-zinc-400">No meals</span>
                    )}
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </>
    );
  }

  return (
    <Card>
      <CardHeader
        title="Staff summary"
        description={`Meals per person, ${periodLabel.toLowerCase()}`}
        actions={
          <div className="w-full sm:w-64">
            <label htmlFor="staff-search" className="sr-only">
              Search staff
            </label>
            <Input
              id="staff-search"
              type="search"
              placeholder="Search staff"
              leading={<Search size={16} />}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
        }
      />
      {body}
    </Card>
  );
}
