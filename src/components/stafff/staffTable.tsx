import { Pencil, Download, Trash2 } from "lucide-react";
import type { Staff } from "../../types/staff";
import { useDeleteStaff } from "../../hooks/useStaff";

interface Props {
  staff: Staff[];
}

export default function StaffTable({ staff }: Props) {

    const { mutate: deleteStaff } = useDeleteStaff();
  return (
    <div className="overflow-hidden rounded-3xl border bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr className="border-b text-left text-sm font-semibold text-gray-600">
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Staff Number</th>
              <th className="px-6 py-4">Department</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {staff.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="py-10 text-center text-gray-500"
                >
                  No staff members found.
                </td>
              </tr>
            ) : (
              
              staff.map((person) => (
                <tr
                  key={person.id}
                  className="border-b transition-colors hover:bg-gray-50 last:border-none"
                >
                  <td className="px-6 py-5">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {person.firstName} {person.lastName}
                      </p>

                      <p className="text-sm text-gray-500">
                        ID: {person.id.slice(0, 8)}...
                      </p>
                    </div>
                  </td>

                  <td className="px-6 py-5 font-medium">
                    {person.staffNumber}
                  </td>

                  <td className="px-6 py-5">
                    {person.department}
                  </td>

                  <td className="px-6 py-5">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        person.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {person.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-5">
  <div className="flex items-center justify-center gap-2">

    <button
      className="flex items-center gap-2 rounded-xl bg-blue-100 px-3 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-200"
    >
      <Pencil size={16} />
      Edit
    </button>

    <a
      href={person.qrImage}
      download={`${person.staffNumber}-QR.png`}
      target="_blank"
      rel="noreferrer"
      className="flex items-center gap-2 rounded-xl bg-[#B10F16]/10 px-3 py-2 text-sm font-medium text-[#B10F16] transition hover:bg-[#B10F16]/20"
    >
      <Download size={16} />
      QR
    </a>

    <button
      onClick={() => {
        if (
          window.confirm(
            `Delete ${person.firstName} ${person.lastName}?`
          )
        ) {
          deleteStaff(person.id);
        }
      }}
      className="flex items-center gap-2 rounded-xl bg-red-100 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-200"
    >
      <Trash2 size={16} />
      Delete
    </button>

  </div>
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