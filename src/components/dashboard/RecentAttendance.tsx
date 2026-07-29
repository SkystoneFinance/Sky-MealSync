import { Clock3 } from "lucide-react";

import type {
  RecentAttendance as Attendance,
} from "../../types/dashboard";

interface Props {
  loading: boolean;
  data: Attendance[];
}

export default function RecentAttendance({
  loading,
  data,
}: Props) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm border">

      <div className="flex items-center gap-2 mb-5">

        <Clock3 className="text-red-700" />

        <h2 className="font-semibold text-lg">
          Recent Attendance
        </h2>

      </div>

      {loading ? (
        <p>Loading...</p>
      ) : data.length === 0 ? (
        <p>No attendance today.</p>
      ) : (
        <div className="space-y-4">

          {data.map((attendance) => (
            <div
              key={attendance.id}
              className="flex justify-between items-center border-b pb-3"
            >
              <div>

                <h3 className="font-medium">
                  {attendance.staff.firstName}{" "}
                  {attendance.staff.lastName}
                </h3>

                <p className="text-sm text-gray-500">
                  {attendance.staff.department}
                </p>

              </div>

              <span className="text-sm font-medium">
                {new Date(
                  attendance.scannedAt
                ).toLocaleTimeString()}
              </span>
            </div>
          ))}

        </div>
      )}
    </div>
  );
}