import type { ReactNode } from "react";

interface SummaryCardProps {
  icon: ReactNode;
  label: string;
  value: string;
}

export default function SummaryCard({
  icon,
  label,
  value,
}: SummaryCardProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FDEBEC] text-[#B10F16]">
          {icon}
        </div>
      </div>

      <p className="mt-4 text-sm font-medium text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-2xl font-bold text-slate-900">
        {value}
      </p>
    </div>
  );
}