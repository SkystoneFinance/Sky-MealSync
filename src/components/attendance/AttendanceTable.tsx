import type { Attendance } from "../../types/attendance";

interface Props {
  attendance: Attendance[];
}

export default function AttendanceTable({
  attendance,
}: Props) {
  return (
    <div className="overflow-hidden rounded-3xl border bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr className="border-b text-left text-sm font-semibold text-gray-600">
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Staff Number</th>
              <th className="px-6 py-4">Department</th>
              <th className="px-6 py-4">Scanned Time</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>

          <tbody>
            {attendance.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="py-12 text-center text-gray-500"
                >
                  No attendance records found.
                </td>
              </tr>
            ) : (
              attendance.map((item) => (
                <tr
                  key={item.id}
                  className="border-b transition hover:bg-gray-50 last:border-none"
                >
                  <td className="px-6 py-5">
                    <div>
                      <p className="font-semibold">
                        {item.staff.firstName}{" "}
                        {item.staff.lastName}
                      </p>

                      <p className="text-sm text-gray-500">
                        ID: {item.staff.id.slice(0, 8)}...
                      </p>
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    {item.staff.staffNumber}
                  </td>

                  <td className="px-6 py-5">
                    {item.staff.department}
                  </td>

                  <td className="px-6 py-5">
                    {new Date(item.scannedAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </td>

                  <td className="px-6 py-5">
                    <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                      Served
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}