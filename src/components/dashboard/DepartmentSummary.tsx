import { Building2 } from "lucide-react";

import type {
  DepartmentSummary as Summary,
} from "../../types/dashboard";

interface Props {
  loading: boolean;
  data: Summary[];
}

export default function DepartmentSummary({
  loading,
  data,
}: Props) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm border">

      <div className="flex items-center gap-2 mb-5">

        <Building2 className="text-red-700" />

        <h2 className="font-semibold text-lg">
          Department Summary
        </h2>

      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-4">

          {data.map((department) => (
            <div
              key={department.department}
              className="flex justify-between border-b pb-3"
            >
              <span>
                {department.department}
              </span>

              <span className="font-semibold">
                {department.total}
              </span>
            </div>
          ))}

        </div>
      )}
    </div>
  );
}