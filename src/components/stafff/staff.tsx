import { useMemo, useState } from "react";

import StaffHeader from "./staffHeader";
import StaffTable from "./staffTable";
import AddStaffModal from "./AddStaffModal";

import { useStaff } from "../../hooks/useStaff";

export default function Staff() {
  const [open, setOpen] = useState(false);

  const [search, setSearch] = useState("");

  const [department, setDepartment] = useState("All");

  const {
    data,
    isLoading,
    isError,
  } = useStaff();

  const departments = useMemo(() => {
    if (!data) return [];

    return [...new Set(data.map((staff) => staff.department))];
  }, [data]);

  const filteredStaff = useMemo(() => {
    if (!data) return [];

    return data.filter((staff) => {
      const matchesSearch =
        `${staff.firstName} ${staff.lastName}`
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        staff.staffNumber
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesDepartment =
        department === "All" ||
        staff.department === department;

      return matchesSearch && matchesDepartment;
    });
  }, [data, search, department]);

  return (
    <div className="space-y-7">
      <StaffHeader
        onAdd={() => setOpen(true)}
      />

      <div className="flex flex-col gap-4 md:flex-row">
        <input
          type="text"
          placeholder="Search staff..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="flex-1 rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#B10F16]"
        />

        <select
          value={department}
          onChange={(e) =>
            setDepartment(e.target.value)
          }
          className="rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#B10F16]"
        >
          <option value="All">All Departments</option>

          {departments.map((dept) => (
            <option
              key={dept}
              value={dept}
            >
              {dept}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <p>Loading staff...</p>
      ) : isError ? (
        <p>Unable to load staff</p>
      ) : (
        <StaffTable
          staff={filteredStaff}
        />
      )}

      <AddStaffModal
        open={open}
        close={() => setOpen(false)}
      />
    </div>
  );
}