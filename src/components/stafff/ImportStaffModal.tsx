import { useId, useRef, useState, type DragEvent } from "react";
import { CircleCheck, CloudUpload, FileSpreadsheet, X } from "lucide-react";
import toast from "react-hot-toast";

import { Button, Callout, Modal, cn } from "../ui";
import { useImportStaff } from "../../hooks/useStaff";
import type { ImportStaffResult } from "../../types/staff";
import { apiErrorMessage } from "../../utils/mealPlanDates";

interface Props {
  open: boolean;
  close: () => void;
}

const COLUMNS = [
  { col: "A", label: "Staff number", example: "SKY-0042" },
  { col: "B", label: "First name", example: "Ada" },
  { col: "C", label: "Last name", example: "Okafor" },
  { col: "D", label: "Department", example: "Finance" },
];

function isXlsx(file: File) {
  return file.name.toLowerCase().endsWith(".xlsx");
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function ImportStaffModal({ open, close }: Props) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [result, setResult] = useState<ImportStaffResult | null>(null);

  const { mutate, isPending } = useImportStaff();

  function pick(selected: File | undefined) {
    if (!selected) return;
    if (!isXlsx(selected)) {
      toast.error("Please choose an .xlsx Excel file.");
      return;
    }
    setFile(selected);
    setResult(null);
  }

  function clearFile() {
    setFile(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  function handleClose() {
    if (isPending) return;
    clearFile();
    setResult(null);
    setDragging(false);
    close();
  }

  function onDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setDragging(false);
    pick(event.dataTransfer.files?.[0]);
  }

  function submit() {
    if (!file) {
      toast.error("Choose an Excel file first.");
      return;
    }

    mutate(file, {
      onSuccess(data) {
        setResult(data);
        clearFile();
        toast.success(`${data.imported} added, ${data.skipped} skipped.`);
      },
      onError(error) {
        toast.error(apiErrorMessage(error, "Couldn't import that file."));
      },
    });
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      size="lg"
      title="Import staff from Excel"
      description="Add many people at once. Rows whose staff number already exists are skipped."
      footer={
        result && !file ? (
          <Button onClick={handleClose}>Done</Button>
        ) : (
          <>
            <Button variant="secondary" onClick={handleClose} disabled={isPending}>
              Cancel
            </Button>
            <Button
              icon={<CloudUpload size={16} />}
              onClick={submit}
              loading={isPending}
              disabled={!file}
            >
              Import
            </Button>
          </>
        )
      }
    >
      <div className="space-y-5">
        <div>
          <p className="text-sm font-medium text-zinc-800">Expected format</p>
          <p className="mt-0.5 text-sm text-zinc-500">
            First sheet, headers in row 1, data from row 2. Columns in this order:
          </p>
          <div className="mt-3 overflow-x-auto rounded-lg border border-zinc-200">
            <table className="w-full min-w-[420px] text-left text-sm">
              <thead>
                <tr className="bg-zinc-50">
                  <th className="w-8 border-r border-b border-zinc-200 px-2 py-1.5 text-center text-xs font-medium text-zinc-400" />
                  {COLUMNS.map((c) => (
                    <th
                      key={c.col}
                      scope="col"
                      className="border-b border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-500"
                    >
                      {c.col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border-r border-b border-zinc-200 bg-zinc-50 px-2 py-1.5 text-center text-xs text-zinc-400">
                    1
                  </td>
                  {COLUMNS.map((c) => (
                    <td
                      key={c.col}
                      className="border-b border-zinc-100 px-3 py-1.5 font-medium text-zinc-900"
                    >
                      {c.label}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="border-r border-zinc-200 bg-zinc-50 px-2 py-1.5 text-center text-xs text-zinc-400">
                    2
                  </td>
                  {COLUMNS.map((c) => (
                    <td key={c.col} className="px-3 py-1.5 text-zinc-600">
                      {c.example}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {result && (
          <Callout
            tone={result.imported > 0 ? "success" : "neutral"}
            icon={<CircleCheck size={18} />}
            title="Import complete"
          >
            {result.imported} added, {result.skipped} skipped.
            {result.skipped > 0 &&
              " Skipped rows were duplicates or missing a value."}
          </Callout>
        )}

        {file ? (
          <div className="flex items-center gap-3 rounded-lg border border-zinc-200 p-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
              <FileSpreadsheet size={18} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-zinc-900">
                {file.name}
              </p>
              <p className="text-xs text-zinc-500">{formatSize(file.size)}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Remove file"
              title="Remove file"
              onClick={clearFile}
              disabled={isPending}
              icon={<X size={16} />}
            />
          </div>
        ) : (
          <label
            htmlFor={inputId}
            onDragOver={(event) => {
              event.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            className={cn(
              "flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed px-6 py-8 text-center transition-colors",
              dragging
                ? "border-brand-600 bg-brand-50"
                : "border-zinc-300 hover:border-zinc-400 hover:bg-zinc-50"
            )}
          >
            <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 text-zinc-500">
              <CloudUpload size={20} />
            </span>
            <span className="text-sm font-medium text-zinc-900">
              Drop an .xlsx file here, or{" "}
              <span className="text-brand-700 underline underline-offset-2">
                browse
              </span>
            </span>
            <span className="mt-1 text-xs text-zinc-500">Excel workbook (.xlsx)</span>
          </label>
        )}

        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          className="sr-only"
          onChange={(event) => pick(event.target.files?.[0])}
        />
      </div>
    </Modal>
  );
}
