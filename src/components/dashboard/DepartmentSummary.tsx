import { Building2 } from "lucide-react";

import { Card, CardBody, CardHeader, EmptyState, Spinner } from "../ui";
import type { DepartmentSummary as Summary } from "../../types/dashboard";

interface Props {
  loading: boolean;
  error: boolean;
  data: Summary[];
}

export default function DepartmentSummary({ loading, error, data }: Props) {
  const rows = [...data].sort((a, b) => b.total - a.total);
  const max = Math.max(1, ...rows.map((row) => row.total));

  let body;

  if (loading) {
    body = (
      <div className="flex justify-center py-12">
        <Spinner />
      </div>
    );
  } else if (error) {
    body = (
      <EmptyState
        icon={<Building2 size={20} />}
        title="Couldn't load departments"
        description="Try refreshing the page in a moment."
      />
    );
  } else if (rows.length === 0) {
    body = (
      <EmptyState
        icon={<Building2 size={20} />}
        title="No departments yet"
        description="Departments appear once staff are added."
      />
    );
  } else {
    body = (
      <CardBody>
        <ul className="space-y-4">
          {rows.map((row) => (
            <li key={row.department}>
              <div className="mb-1.5 flex items-baseline justify-between gap-3 text-sm">
                <span className="truncate text-zinc-700">{row.department}</span>
                <span className="tabular font-medium text-zinc-900">
                  {row.total.toLocaleString()}
                </span>
              </div>
              <div
                className="h-2 overflow-hidden rounded-full bg-zinc-100"
                role="img"
                aria-label={`${row.department}: ${row.total} staff`}
              >
                <div
                  className="h-full rounded-full bg-brand-600"
                  style={{ width: `${(row.total / max) * 100}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      </CardBody>
    );
  }

  return (
    <Card>
      <CardHeader title="Staff by department" description="Headcount per department" />
      {body}
    </Card>
  );
}
