import type {
  StaffMealSummary,
} from "../../types/report";

interface Props {
  data: StaffMealSummary[];
}

export default function AttendanceTable({
  data,
}: Props) {
  if (!data.length) {
    return (
      <div className="rounded-2xl border bg-white p-10 text-center text-gray-500">
        No records found.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border bg-white shadow-sm">
      <table className="w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-4 text-left">Staff No</th>
            <th className="px-6 py-4 text-left">Name</th>
            <th className="px-6 py-4 text-left">Department</th>
            <th className="px-6 py-4 text-center">Meals</th>
            <th className="px-6 py-4 text-left">Last Meal</th>
          </tr>
        </thead>

        <tbody>
          {data.map((staff) => (
            <tr
              key={staff.staffId}
              className="border-b"
            >
              <td className="px-6 py-4">
                {staff.staffNumber}
              </td>

              <td className="px-6 py-4 font-semibold">
                {staff.name}
              </td>

              <td className="px-6 py-4">
                {staff.department}
              </td>

              <td className="px-6 py-4 text-center">
                <span className="rounded-full bg-red-100 px-3 py-1 font-semibold text-red-700">
                  {staff.mealCount}
                </span>
              </td>

              <td className="px-6 py-4">
                {staff.lastMeal
                  ? new Date(
                      staff.lastMeal
                    ).toLocaleString()
                  : "--"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}