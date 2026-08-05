import { useMemo, useState } from "react";
import { Search, RefreshCw } from "lucide-react";

import AttendanceTable from "./AttendanceTable";
import { useTodayAttendance } from "../../hooks/useattendance";

export default function TodayAttendance() {
  const {
    data = [],
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useTodayAttendance();

  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All");

  const departments = useMemo(() => {
    const unique = Array.from(
      new Set(data.map((item) => item.staff.department))
    );

    return ["All", ...unique];
  }, [data]);

  const filteredAttendance = useMemo(() => {
    return data.filter((attendance) => {
      const fullName = `${attendance.staff.firstName} ${attendance.staff.lastName}`.toLowerCase();

      const matchesSearch =
        fullName.includes(search.toLowerCase()) ||
        attendance.staff.staffNumber
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesDepartment =
        department === "All" ||
        attendance.staff.department === department;

      return matchesSearch && matchesDepartment;
    });
  }, [data, search, department]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <p className="text-gray-500">Loading attendance...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl bg-red-50 p-10 text-center">
        <h2 className="text-xl font-semibold text-red-600">
          Unable to load today's attendance.
        </h2>
      </div>
    );
  }

  return (
    <div className="space-y-7">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-4xl font-bold">
            Today's Attendance
          </h1>

          <p className="mt-2 text-xs md:text-lg text-gray-500">
            Staff that have received meals today.
          </p>
        </div>

        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="flex items-center gap-2 rounded-xl bg-[#B10F16] px-5 py-3 text-white transition hover:bg-red-800"
        >
          <RefreshCw
            size={18}
            className={isFetching ? "animate-spin" : ""}
          />

          Refresh
        </button>
      </div>

      <div className="rounded-3xl border-grey bg-white p-5 shadow-sm">
        <div className="grid md:justify-center md:items-center gap-4 lg:grid-cols-3">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search by name or staff number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-gray-300 py-3 pl-11 pr-4 outline-none transition focus:border-[#B10F16]"
            />
          </div>

          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#B10F16]"
          >
            {departments.map((dept) => (
              <option
                key={dept}
                value={dept}
              >
                {dept}
              </option>
            ))}
          </select>

          <div className="flex items-center justify-center p-4 rounded-xl bg-[#B10F16] text-white">
            <div className="text-center">
              <p className="text-sm text-white opacity-80">
                Meals Served Today
              </p>

              <h2 className="text-3xl text-white font-bold">
                {filteredAttendance.length}
              </h2>
            </div>
          </div>
        </div>
      </div>

      <AttendanceTable attendance={filteredAttendance} />
    </div>
  );
}