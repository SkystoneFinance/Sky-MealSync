import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Building2,
  Clock,
  RefreshCw,
  Search,
  Users,
  Utensils,
} from "lucide-react";

import {
  Button,
  Callout,
  Card,
  EmptyState,
  Input,
  PageHeader,
  Select,
  Spinner,
  StatCard,
} from "../ui";
import AttendanceTable, { type ServedRow } from "./AttendanceTable";
import { useTodayAttendance } from "../../hooks/useattendance";
import type { Attendance } from "../../types/attendance";

const TIME_ZONE = "Africa/Lagos";
const ALL_DEPARTMENTS = "all";

function todayLabel() {
  return new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: TIME_ZONE,
  });
}

function timeLabel(iso: string) {
  return new Date(iso).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: TIME_ZONE,
  });
}

// Newest first, each row tagged with which serving of the day it was.
function toServedRows(attendance: Attendance[]): ServedRow[] {
  const oldestFirst = [...attendance].sort(
    (a, b) => new Date(a.scannedAt).getTime() - new Date(b.scannedAt).getTime()
  );

  const countByStaff = new Map<string, number>();
  const rows = oldestFirst.map((item) => {
    const servingNumber = (countByStaff.get(item.staff.id) ?? 0) + 1;
    countByStaff.set(item.staff.id, servingNumber);
    return { attendance: item, servingNumber };
  });

  return rows.reverse();
}

export default function TodayAttendance() {
  const { data, isLoading, isError, refetch, isFetching } = useTodayAttendance();

  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState(ALL_DEPARTMENTS);

  const rows = useMemo(() => toServedRows(data ?? []), [data]);

  const departments = useMemo(
    () =>
      Array.from(
        new Set(rows.map((row) => row.attendance.staff.department).filter(Boolean))
      ).sort((a, b) => a.localeCompare(b)),
    [rows]
  );

  const stats = useMemo(() => {
    const people = new Set(rows.map((row) => row.attendance.staff.id));
    const repeat = rows.filter((row) => row.servingNumber > 1).length;

    return {
      meals: rows.length,
      people: people.size,
      repeat,
      departments: departments.length,
      lastServed: rows[0]?.attendance.scannedAt,
    };
  }, [rows, departments]);

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();

    return rows.filter(({ attendance }) => {
      const { firstName, lastName, staffNumber } = attendance.staff;

      const matchesSearch =
        !query ||
        `${firstName} ${lastName}`.toLowerCase().includes(query) ||
        staffNumber.toLowerCase().includes(query) ||
        Boolean(attendance.meal?.name.toLowerCase().includes(query));

      const matchesDepartment =
        department === ALL_DEPARTMENTS ||
        attendance.staff.department === department;

      return matchesSearch && matchesDepartment;
    });
  }, [rows, search, department]);

  const isFiltered = search.trim() !== "" || department !== ALL_DEPARTMENTS;

  function clearFilters() {
    setSearch("");
    setDepartment(ALL_DEPARTMENTS);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Served today"
        description={todayLabel()}
        actions={
          <Button
            variant="secondary"
            onClick={() => refetch()}
            loading={isFetching}
            icon={<RefreshCw size={16} />}
          >
            Refresh
          </Button>
        }
      />

      {isError && (
        <Callout
          tone="danger"
          icon={<AlertTriangle size={18} />}
          title="Couldn't load today's servings"
          action={
            <Button variant="secondary" size="sm" onClick={() => refetch()}>
              Try again
            </Button>
          }
        >
          Check your connection and try again.
        </Callout>
      )}

      {!isError && (
        <>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard
              label="Meals served"
              value={isLoading ? "—" : stats.meals}
              tone="brand"
              icon={<Utensils size={16} />}
            />
            <StatCard
              label="People served"
              value={isLoading ? "—" : stats.people}
              hint={stats.repeat > 0 ? `${stats.repeat} extra servings` : undefined}
              icon={<Users size={16} />}
            />
            <StatCard
              label="Departments"
              value={isLoading ? "—" : stats.departments}
              icon={<Building2 size={16} />}
            />
            <StatCard
              label="Last served"
              value={stats.lastServed ? timeLabel(stats.lastServed) : "—"}
              icon={<Clock size={16} />}
            />
          </div>

          <Card>
            <div className="flex flex-col gap-3 border-b border-zinc-100 p-4 sm:flex-row sm:items-center">
              <div className="flex-1">
                <label htmlFor="served-search" className="sr-only">
                  Search by name or staff number
                </label>
                <Input
                  id="served-search"
                  type="search"
                  placeholder="Search name, staff number or dish"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  leading={<Search size={16} />}
                />
              </div>
              <div className="sm:w-56">
                <label htmlFor="served-department" className="sr-only">
                  Department
                </label>
                <Select
                  id="served-department"
                  value={department}
                  onChange={(event) => setDepartment(event.target.value)}
                >
                  <option value={ALL_DEPARTMENTS}>All departments</option>
                  {departments.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-16">
                <Spinner />
              </div>
            ) : rows.length === 0 ? (
              <EmptyState
                icon={<Utensils size={20} />}
                title="No meals served yet today"
                description="Servings recorded at the scanner will show up here."
              />
            ) : filteredRows.length === 0 ? (
              <EmptyState
                icon={<Search size={20} />}
                title="No matches"
                description="No one served today matches your search or department filter."
                action={
                  <Button variant="secondary" onClick={clearFilters}>
                    Clear filters
                  </Button>
                }
              />
            ) : (
              <>
                <AttendanceTable rows={filteredRows} />
                {isFiltered && (
                  <p className="px-5 py-3 text-sm text-zinc-500">
                    Showing {filteredRows.length} of {rows.length} servings
                  </p>
                )}
              </>
            )}
          </Card>
        </>
      )}
    </div>
  );
}
