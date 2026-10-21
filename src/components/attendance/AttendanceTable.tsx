import { Avatar, Badge, Table, Td, Th } from "../ui";
import type { Attendance } from "../../types/attendance";

// One served meal, plus which of the person's servings today it was.
export interface ServedRow {
  attendance: Attendance;
  servingNumber: number;
}

// "14:05" in canteen time, so every device shows the same clock.
function formatServedTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Africa/Lagos",
  });
}

function staffName(row: ServedRow) {
  const { firstName, lastName } = row.attendance.staff;
  return `${firstName} ${lastName}`.trim();
}

function ServingBadge({ servingNumber }: { servingNumber: number }) {
  if (servingNumber < 2) return null;
  return <Badge tone="info">Serving {servingNumber}</Badge>;
}

export default function AttendanceTable({ rows }: { rows: ServedRow[] }) {
  return (
    <>
      {/* Desktop / tablet */}
      <div className="hidden md:block">
        <Table>
          <thead>
            <tr>
              <Th>Staff</Th>
              <Th>Staff number</Th>
              <Th>Department</Th>
              <Th>Dish</Th>
              <Th className="text-right">Time served</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const { attendance } = row;
              const name = staffName(row);

              return (
                <tr key={attendance.id} className="transition-colors hover:bg-zinc-50/60">
                  <Td>
                    <div className="flex items-center gap-3">
                      <Avatar name={name} size="sm" />
                      <span className="font-medium text-zinc-900">{name}</span>
                      <ServingBadge servingNumber={row.servingNumber} />
                    </div>
                  </Td>
                  <Td className="tabular text-zinc-600">{attendance.staff.staffNumber}</Td>
                  <Td className="text-zinc-600">{attendance.staff.department || "—"}</Td>
                  <Td className="text-zinc-900">{attendance.meal?.name ?? "—"}</Td>
                  <Td className="tabular text-right text-zinc-600">
                    <time dateTime={attendance.scannedAt}>
                      {formatServedTime(attendance.scannedAt)}
                    </time>
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>

      {/* Phone */}
      <ul className="divide-y divide-zinc-100 md:hidden">
        {rows.map((row) => {
          const { attendance } = row;
          const name = staffName(row);

          return (
            <li key={attendance.id} className="flex items-center gap-3 px-4 py-3">
              <Avatar name={name} size="md" />
              <div className="min-w-0 flex-1">
                <div className="flex min-w-0 items-center gap-2">
                  <p className="truncate font-medium text-zinc-900">{name}</p>
                  <ServingBadge servingNumber={row.servingNumber} />
                </div>
                <p className="truncate text-sm text-zinc-500">
                  {attendance.staff.staffNumber}
                  {attendance.staff.department && ` · ${attendance.staff.department}`}
                </p>
                {attendance.meal && (
                  <p className="truncate text-sm text-zinc-800">{attendance.meal.name}</p>
                )}
              </div>
              <time
                dateTime={attendance.scannedAt}
                className="tabular shrink-0 text-sm text-zinc-500"
              >
                {formatServedTime(attendance.scannedAt)}
              </time>
            </li>
          );
        })}
      </ul>
    </>
  );
}
