import { useEffect, useRef, useState } from "react";

import { ChevronDown, Download, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

import { Button, PageHeader, cn } from "../ui";
import { reportService } from "../../services/report.service";
import type { ExportPeriod } from "../../types/report";
import { apiErrorMessage } from "../../utils/mealPlanDates";

const EXPORT_OPTIONS: {
  value: ExportPeriod;
  label: string;
  filename: string;
}[] = [
  { value: "today", label: "Today", filename: "MealSync-Today.xlsx" },
  {
    value: "current-week",
    label: "This week",
    filename: "MealSync-This-Week.xlsx",
  },
  {
    value: "previous-week",
    label: "Last week",
    filename: "MealSync-Last-Week.xlsx",
  },
  {
    value: "current-month",
    label: "This month",
    filename: "MealSync-This-Month.xlsx",
  },
  {
    value: "previous-month",
    label: "Last month",
    filename: "MealSync-Last-Month.xlsx",
  },
];

// Blob errors come back as a Blob too, so read the JSON message out of it.
async function exportErrorMessage(error: unknown) {
  const data = (error as { response?: { data?: unknown } })?.response?.data;

  if (data instanceof Blob) {
    try {
      const parsed = JSON.parse(await data.text()) as { message?: string };
      if (parsed.message) return parsed.message;
    } catch {
      // not JSON; fall through
    }
  }

  return apiErrorMessage(error, "Unable to export the report. Please try again.");
}

function saveBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function ExportMenu() {
  const [open, setOpen] = useState(false);
  const [downloading, setDownloading] = useState<ExportPeriod | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onPointer = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  async function download(option: (typeof EXPORT_OPTIONS)[number]) {
    setDownloading(option.value);

    try {
      const blob = await reportService.downloadReport(option.value);
      saveBlob(blob, option.filename);
      setOpen(false);
    } catch (error) {
      toast.error(await exportErrorMessage(error));
    } finally {
      setDownloading(null);
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <Button
        variant="secondary"
        icon={<Download size={16} />}
        loading={downloading !== null}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        Export
        <ChevronDown
          size={16}
          className={cn("text-zinc-400 transition-transform", open && "rotate-180")}
        />
      </Button>

      {open && (
        <div
          role="menu"
          aria-label="Export period"
          className="absolute right-0 z-30 mt-2 w-56 overflow-hidden rounded-xl border border-zinc-200 bg-white p-1 shadow-pop"
        >
          <p className="px-3 pt-2 pb-1 text-xs font-medium text-zinc-500">
            Download as Excel
          </p>
          {EXPORT_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              role="menuitem"
              disabled={downloading !== null}
              onClick={() => download(option)}
              className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm text-zinc-700 transition-colors hover:bg-zinc-50 hover:text-zinc-900 disabled:cursor-not-allowed disabled:text-zinc-400"
            >
              {option.label}
              {downloading === option.value && (
                <Loader2 size={14} className="animate-spin text-zinc-400" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function HistoryHeader() {
  return (
    <PageHeader
      title="Reports"
      description="Meals served and attendance across your staff."
      actions={<ExportMenu />}
    />
  );
}
