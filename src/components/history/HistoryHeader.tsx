import { Download, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { reportService } from "../../services/report.service";

interface Props {
  period: string;
}

type ExportPeriod =
  | "today"
  | "current-week"
  | "previous-week"
  | "current-month"
  | "previous-month";

export default function HistoryHeader({
  period,
}: Props) {
  const [open, setOpen] = useState(false);

  const [downloading, setDownloading] =
    useState<ExportPeriod | null>(null);

  const dropdownRef =
    useRef<HTMLDivElement>(null);

  // ========================================
  // CLOSE DROPDOWN WHEN CLICKING OUTSIDE
  // ========================================

  useEffect(() => {
    function handleClickOutside(
      event: MouseEvent
    ) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(
          event.target as Node
        )
      ) {
        setOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  // ========================================
  // EXPORT OPTIONS
  // ========================================

  const getExportOptions = (): {
    label: string;
    value: ExportPeriod;
  }[] => {
    switch (period) {
      case "weekly":
        return [
          {
            label: "Present Week",
            value: "current-week",
          },
          {
            label: "Previous Week",
            value: "previous-week",
          },
        ];

      case "monthly":
        return [
          {
            label: "Present Month",
            value: "current-month",
          },
          {
            label: "Previous Month",
            value: "previous-month",
          },
        ];

      case "today":
      default:
        return [
          {
            label: "Today",
            value: "today",
          },
        ];
    }
  };

  // ========================================
  // DOWNLOAD
  // ========================================

  async function download(
    exportPeriod: ExportPeriod
  ) {
    try {
      setDownloading(exportPeriod);

      const blob =
        await reportService.downloadReport(
          exportPeriod
        );

      const url =
        window.URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = url;

      const filenames: Record<
        ExportPeriod,
        string
      > = {
        today:
          "MealSync-Today.xlsx",

        "current-week":
          "MealSync-Present-Week.xlsx",

        "previous-week":
          "MealSync-Previous-Week.xlsx",

        "current-month":
          "MealSync-Present-Month.xlsx",

        "previous-month":
          "MealSync-Previous-Month.xlsx",
      };

      link.download =
        filenames[exportPeriod];

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);

      setOpen(false);
    } catch (error) {
      console.error(
        "Failed to download report:",
        error
      );

      alert(
        "Unable to export the report. Please try again."
      );
    } finally {
      setDownloading(null);
    }
  }

  const options =
    getExportOptions();

  return (
    <div className="flex items-center justify-between">
      {/* ======================================
          HEADER
      ====================================== */}

      <div>
        <h1 className="text-2xl md:text-4xl font-bold">
          Attendance History
        </h1>

        <p className="mt-2 text-xs md:text-lg text-gray-500">
          View and download historical attendance data
        </p>
      </div>

      {/* ======================================
          EXPORT DROPDOWN
      ====================================== */}

      <div
        ref={dropdownRef}
        className="relative"
      >
        <button
          type="button"
          onClick={() =>
            setOpen((previous) => !previous)
          }
          className="
            flex
            items-center
            gap-2
            rounded-xl
            bg-[#B10F16]
            px-5
            py-4
            text-sm
            font-medium
            text-white
            transition
            hover:bg-[#8D0B11]
          "
        >
          <Download size={18} />

          <span>
            Export Excel
          </span>

          <ChevronDown
            size={18}
            className={`
              transition-transform
              duration-200
              ${open ? "rotate-180" : ""}
            `}
          />
        </button>

        {/* ====================================
            DROPDOWN MENU
        ==================================== */}

        {open && (
          <div
            className="
              absolute
              right-0
              z-50
              mt-2
              w-56
              overflow-hidden
              rounded-2xl
              border
              border-gray-200
              bg-white
              shadow-xl
            "
          >
            <div className="p-2">
              {options.map(
                (option) => {
                  const isDownloading =
                    downloading ===
                    option.value;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      disabled={
                        downloading !== null
                      }
                      onClick={() =>
                        download(
                          option.value
                        )
                      }
                      className="
                        flex
                        w-full
                        items-center
                        justify-between
                        rounded-xl
                        px-4
                        py-3
                        text-left
                        text-sm
                        font-medium
                        text-gray-700
                        transition
                        hover:bg-gray-100
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                      "
                    >
                      <span>
                        {option.label}
                      </span>

                      {isDownloading && (
                        <span
                          className="
                            h-4
                            w-4
                            animate-spin
                            rounded-full
                            border-2
                            border-gray-300
                            border-t-[#B10F16]
                          "
                        />
                      )}
                    </button>
                  );
                }
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}