import { useMemo, useState } from "react";
import { CircleAlert, Search, SearchX, UserPlus, Users } from "lucide-react";

import {
  Button,
  Callout,
  Card,
  EmptyState,
  Input,
  PageLoader,
  Segmented,
  Select,
} from "../ui";
import { useStaff } from "../../hooks/useStaff";
import type { Staff as StaffMember } from "../../types/staff";

import StaffHeader from "./staffHeader";
import StaffTable from "./staffTable";
import AddStaffModal from "./AddStaffModal";
import EditStaffModal from "./EditStaffModal";
import ImportStaffModal from "./ImportStaffModal";

type StatusFilter = "all" | "active" | "inactive";

const ALL_DEPARTMENTS = "__all__";

export default function Staff() {
  const [addOpen, setAddOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [editing, setEditing] = useState<StaffMember | null>(null);

  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState(ALL_DEPARTMENTS);
  const [status, setStatus] = useState<StatusFilter>("all");

  const { data, isLoading, isError, refetch, isRefetching } = useStaff();

  const staff = useMemo(() => data ?? [], [data]);
  const activeCount = useMemo(
    () => staff.filter((person) => person.isActive).length,
    [staff]
  );

  const departments = useMemo(
    () =>
      [...new Set(staff.map((person) => person.department).filter(Boolean))].sort(
        (a, b) => a.localeCompare(b)
      ),
    [staff]
  );

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return staff
      .filter((person) => {
        const name = `${person.firstName} ${person.lastName}`.toLowerCase();
        const matchesSearch =
          !query ||
          name.includes(query) ||
          person.staffNumber.toLowerCase().includes(query);
        const matchesDepartment =
          department === ALL_DEPARTMENTS || person.department === department;
        const matchesStatus =
          status === "all" ||
          (status === "active" ? person.isActive : !person.isActive);

        return matchesSearch && matchesDepartment && matchesStatus;
      })
      .sort((a, b) =>
        `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`)
      );
  }, [staff, search, department, status]);

  const hasFilters =
    search.trim() !== "" || department !== ALL_DEPARTMENTS || status !== "all";

  function clearFilters() {
    setSearch("");
    setDepartment(ALL_DEPARTMENTS);
    setStatus("all");
  }

  function renderContent() {
    if (isLoading) return <PageLoader />;

    if (isError) {
      return (
        <Callout
          tone="danger"
          icon={<CircleAlert size={18} />}
          title="Couldn't load staff"
          action={
            <Button
              variant="secondary"
              size="sm"
              loading={isRefetching}
              onClick={() => refetch()}
            >
              Try again
            </Button>
          }
        >
          Check your connection and try again.
        </Callout>
      );
    }

    if (staff.length === 0) {
      return (
        <Card>
          <EmptyState
            icon={<Users size={20} />}
            title="No staff yet"
            description="Add people one at a time, or import a list from Excel."
            action={
              <div className="flex flex-wrap justify-center gap-2">
                <Button variant="secondary" onClick={() => setImportOpen(true)}>
                  Import from Excel
                </Button>
                <Button icon={<UserPlus size={16} />} onClick={() => setAddOpen(true)}>
                  Add staff
                </Button>
              </div>
            }
          />
        </Card>
      );
    }

    return (
      <Card className="overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-zinc-100 p-4 lg:flex-row lg:items-center">
          <div className="flex-1">
            <Input
              type="search"
              aria-label="Search staff by name or staff number"
              placeholder="Search name or staff number"
              leading={<Search size={16} />}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Select
              aria-label="Filter by department"
              value={department}
              onChange={(event) => setDepartment(event.target.value)}
              className="sm:w-52"
            >
              <option value={ALL_DEPARTMENTS}>All departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </Select>
            <Segmented<StatusFilter>
              value={status}
              onChange={setStatus}
              className="w-full sm:w-auto"
              options={[
                { value: "all", label: "All" },
                { value: "active", label: "Active" },
                { value: "inactive", label: "Inactive" },
              ]}
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={<SearchX size={20} />}
            title="No matching staff"
            description="Try a different name, staff number or filter."
            action={
              <Button variant="secondary" size="sm" onClick={clearFilters}>
                Clear filters
              </Button>
            }
          />
        ) : (
          <>
            <StaffTable staff={filtered} onEdit={setEditing} />
            <div className="border-t border-zinc-100 px-5 py-3 text-sm text-zinc-500">
              {hasFilters
                ? `Showing ${filtered.length} of ${staff.length}`
                : `${staff.length} ${staff.length === 1 ? "person" : "people"}`}
            </div>
          </>
        )}
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <StaffHeader
        total={data ? staff.length : undefined}
        active={activeCount}
        onCreate={() => setAddOpen(true)}
        onImport={() => setImportOpen(true)}
      />

      {renderContent()}

      <AddStaffModal
        open={addOpen}
        close={() => setAddOpen(false)}
        departments={departments}
      />

      <ImportStaffModal open={importOpen} close={() => setImportOpen(false)} />

      <EditStaffModal
        key={editing?.id ?? "none"}
        staff={editing}
        onClose={() => setEditing(null)}
        departments={departments}
      />
    </div>
  );
}
