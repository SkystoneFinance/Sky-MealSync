import { Download } from "lucide-react";
import { reportService } from "../../services/report.service";

interface Props {
  period: string;
}

export default function HistoryHeader({
  period,
}: Props) {
  async function download() {
    const blob =
      await reportService.downloadReport(
        period
      );

    const url =
      window.URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    link.download =
      `MealSync-${period}.xlsx`;

    link.click();

    window.URL.revokeObjectURL(url);
  }

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-4xl font-bold">
          Attendance History
        </h1>

        <p className="mt-2 text-gray-500">
          Weekly and Monthly Meal Reports
        </p>
      </div>

      <button
        onClick={download}
        className=" flex items-center gap-2 rounded-xl bg-[#B10F16] px-3 py-2 text-sm font-medium text-white transition hover:bg-[#8D0B11]"
      >
        <Download size={18} />

        Export Excel
      </button>
    </div>
  );
}