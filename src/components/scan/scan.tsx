import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import {
  AlertTriangle,
  Ban,
  CheckCircle2,
  CircleSlash,
  QrCode,
  RotateCcw,
  ScanLine,
  ShieldOff,
  Utensils,
  WifiOff,
} from "lucide-react";
import toast from "react-hot-toast";

import {
  Avatar,
  Button,
  Callout,
  Card,
  CardBody,
  CardHeader,
  EmptyState,
  PageHeader,
  Spinner,
  cn,
} from "../ui";
import ScannerCard from "./scannerCard";
import { useScan } from "../../hooks/useScan";
import { useServeMeal } from "../../hooks/useServedMeal";
import { apiErrorMessage, dishImageUrl } from "../../utils/mealPlanDates";
import type {
  ScanPreview,
  ScannedMeal,
  ScannedStaff,
  ServeResult,
} from "../../types/attendance";

// After a successful serve, scanning resumes on its own after this delay.
const AUTO_RESUME_MS = 2000;

interface ScanProblem {
  tone: "danger" | "warning";
  icon: ReactNode;
  title: string;
  message: string;
}

type ScanState =
  | { phase: "scanning" }
  | { phase: "looking-up" }
  | { phase: "preview"; result: ScanPreview }
  | { phase: "served"; result: ServeResult }
  | { phase: "error"; problem: ScanProblem };

export default function Scan() {
  const [state, setState] = useState<ScanState>({ phase: "scanning" });

  const { mutate: lookup } = useScan();
  const { mutate: serve, isPending: isServing } = useServeMeal();

  const scanNext = useCallback(() => setState({ phase: "scanning" }), []);

  // ------------------------------------------
  // QR decoded → identify the staff member
  // ------------------------------------------

  const handleDecode = useCallback(
    (qrCodeId: string) => {
      setState({ phase: "looking-up" });

      lookup(
        { qrCodeId },
        {
          onSuccess(response) {
            setState({ phase: "preview", result: response.data });
          },
          onError(error) {
            setState({ phase: "error", problem: describeProblem(error) });
          },
        }
      );
    },
    [lookup]
  );

  // ------------------------------------------
  // Mark as served
  // ------------------------------------------

  function handleServe(preview: ScanPreview) {
    serve(
      { staffId: preview.staff.id },
      {
        onSuccess(response) {
          setState({ phase: "served", result: response.data });
          toast.success(`${fullName(response.data.staff)} served.`);
        },
        onError(error) {
          setState({ phase: "error", problem: describeProblem(error) });
        },
      }
    );
  }

  // Resume scanning shortly after a serve so the queue keeps moving.
  useEffect(() => {
    if (state.phase !== "served") return;

    const timer = window.setTimeout(scanNext, AUTO_RESUME_MS);
    return () => window.clearTimeout(timer);
  }, [state, scanNext]);

  // On phones the panels are stacked: bring whichever one matters into view.
  const cameraRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const isScanningPhase = state.phase === "scanning";

  const lastPhaseRef = useRef(isScanningPhase);

  useEffect(() => {
    if (lastPhaseRef.current === isScanningPhase) return;
    lastPhaseRef.current = isScanningPhase;

    if (!window.matchMedia("(max-width: 1023px)").matches) return;

    const target = isScanningPhase ? cameraRef.current : resultRef.current;
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [isScanningPhase]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Canteen counter"
        title="Scan"
        description="Scan a staff QR code to see the meal they chose for today, then mark it as served."
      />

      <div className="grid items-start gap-6 lg:grid-cols-2">
        <div ref={cameraRef} className="scroll-mt-18">
          <ScannerCard active={isScanningPhase} onDecode={handleDecode} />
        </div>

        <div ref={resultRef} className="scroll-mt-18">
          <ResultPanel
            state={state}
            isServing={isServing}
            onServe={handleServe}
            onScanNext={scanNext}
          />
        </div>
      </div>
    </div>
  );
}

// ==========================================
// RESULT PANEL
// ==========================================

function ResultPanel({
  state,
  isServing,
  onServe,
  onScanNext,
}: {
  state: ScanState;
  isServing: boolean;
  onServe: (preview: ScanPreview) => void;
  onScanNext: () => void;
}) {
  return (
    <Card className="lg:min-h-[420px]">
      <CardHeader title="Result" />

      <div aria-live="polite">
        {state.phase === "scanning" && (
          <EmptyState
            icon={<ScanLine size={20} />}
            title="Ready to scan"
            description="Hold the staff member's QR code in front of the camera. Their meal for today will appear here."
            className="py-16"
          />
        )}

        {state.phase === "looking-up" && (
          <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
            <Spinner />
            <p className="font-medium text-zinc-900">Identifying staff…</p>
            <p className="text-sm text-zinc-500">Checking today's meal selection.</p>
          </div>
        )}

        {state.phase === "preview" && (
          <PreviewResult
            preview={state.result}
            isServing={isServing}
            onServe={() => onServe(state.result)}
            onCancel={onScanNext}
          />
        )}

        {state.phase === "served" && (
          <ServedResult result={state.result} onScanNext={onScanNext} />
        )}

        {state.phase === "error" && (
          <CardBody className="space-y-4">
            <Callout
              tone={state.problem.tone}
              icon={state.problem.icon}
              title={state.problem.title}
            >
              {state.problem.message}
            </Callout>

            <Button
              size="lg"
              className="w-full"
              onClick={onScanNext}
              icon={<ScanLine size={18} />}
            >
              Scan next
            </Button>
          </CardBody>
        )}
      </div>
    </Card>
  );
}

function PreviewResult({
  preview,
  isServing,
  onServe,
  onCancel,
}: {
  preview: ScanPreview;
  isServing: boolean;
  onServe: () => void;
  onCancel: () => void;
}) {
  const { staff, meal, serving } = preview;
  const canServe = serving.remainingServings > 0;

  return (
    <CardBody className="space-y-5">
      <StaffSummary staff={staff} />

      <MealSummary meal={meal} />

      <div className="flex flex-col gap-3 rounded-xl border border-zinc-200 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-zinc-500">Servings today</p>
          <p className="tabular mt-0.5 font-semibold text-zinc-900">
            {canServe
              ? `This is serving ${serving.servedCount + 1} of ${serving.maxDailyServings}`
              : `${serving.servedCount} of ${serving.maxDailyServings} used`}
          </p>
        </div>
        <ServingPips
          served={serving.servedCount}
          max={serving.maxDailyServings}
          highlightNext={canServe}
        />
      </div>

      {!canServe && (
        <Callout
          tone="warning"
          icon={<AlertTriangle size={18} />}
          title="Daily limit reached"
        >
          {fullName(staff)} has already had every serving allowed today.
        </Callout>
      )}

      <div className="space-y-2">
        <Button
          size="lg"
          className="w-full"
          onClick={onServe}
          loading={isServing}
          disabled={!canServe}
          icon={<CheckCircle2 size={18} />}
        >
          {isServing ? "Recording…" : "Mark as served"}
        </Button>

        <Button
          variant="secondary"
          size="lg"
          className="w-full"
          onClick={onCancel}
          disabled={isServing}
          icon={<RotateCcw size={18} />}
        >
          Cancel, scan next
        </Button>
      </div>
    </CardBody>
  );
}

function ServedResult({
  result,
  onScanNext,
}: {
  result: ServeResult;
  onScanNext: () => void;
}) {
  const { staff, meal, attendance } = result;

  return (
    <CardBody className="space-y-5">
      <div className="flex flex-col items-center rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-6 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-white">
          <CheckCircle2 size={24} aria-hidden="true" />
        </span>
        <p className="mt-3 text-lg font-semibold text-emerald-900">
          Served · {attendance.servedCount} of {attendance.maxDailyServings} today
        </p>
        <p className="mt-0.5 text-sm text-emerald-800">
          {fullName(staff)} · {meal.name}
        </p>
        <ServingPips
          served={attendance.servedCount}
          max={attendance.maxDailyServings}
          className="mt-3"
          tone="success"
        />
      </div>

      <Button
        size="lg"
        className="w-full"
        onClick={onScanNext}
        icon={<ScanLine size={18} />}
      >
        Scan next
      </Button>

      <p className="text-center text-sm text-zinc-500">
        Scanning resumes automatically in a moment.
      </p>
    </CardBody>
  );
}

// ==========================================
// PIECES
// ==========================================

function StaffSummary({ staff }: { staff: ScannedStaff }) {
  const name = fullName(staff);

  return (
    <div className="flex items-center gap-4">
      <Avatar name={name} size="lg" />
      <div className="min-w-0">
        <p className="truncate text-lg font-semibold text-zinc-900">{name}</p>
        <p className="truncate text-sm text-zinc-500">
          {staff.staffNumber}
          {staff.department && ` · ${staff.department}`}
        </p>
      </div>
    </div>
  );
}

function MealSummary({ meal }: { meal: ScannedMeal }) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-zinc-200 bg-zinc-50/60 p-3">
      {meal.image ? (
        <img
          src={dishImageUrl(meal.image)}
          alt=""
          className="h-16 w-16 shrink-0 rounded-lg border border-zinc-200 bg-white object-cover"
        />
      ) : (
        <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-400">
          <Utensils size={22} aria-hidden="true" />
        </span>
      )}
      <div className="min-w-0">
        <p className="text-xs font-medium tracking-wide text-zinc-500 uppercase">
          Today's meal
        </p>
        <p className="mt-0.5 text-base font-semibold text-zinc-900">{meal.name}</p>
      </div>
    </div>
  );
}

function ServingPips({
  served,
  max,
  highlightNext = false,
  tone = "brand",
  className,
}: {
  served: number;
  max: number;
  highlightNext?: boolean;
  tone?: "brand" | "success";
  className?: string;
}) {
  const filled = tone === "success" ? "bg-emerald-600" : "bg-brand-600";

  return (
    <div
      className={cn("flex items-center gap-1.5", className)}
      role="img"
      aria-label={`${served} of ${max} servings used today`}
    >
      {Array.from({ length: Math.max(max, 0) }, (_, index) => (
        <span
          key={index}
          className={cn(
            "h-2.5 w-6 rounded-full",
            index < served
              ? filled
              : highlightNext && index === served
                ? "bg-brand-100 ring-1 ring-brand-600 ring-inset"
                : "bg-zinc-200"
          )}
        />
      ))}
    </div>
  );
}

// ==========================================
// HELPERS
// ==========================================

function fullName(staff: Pick<ScannedStaff, "firstName" | "lastName">) {
  return `${staff.firstName} ${staff.lastName}`.trim();
}

// Turns an API error into something the counter staff can act on.
function describeProblem(error: unknown): ScanProblem {
  const status = (error as { response?: { status?: number } })?.response?.status;
  const message = apiErrorMessage(error, "Something went wrong. Please try again.");

  if (status === undefined) {
    return {
      tone: "danger",
      icon: <WifiOff size={18} />,
      title: "Couldn't reach the server",
      message: "Check the connection, then scan again.",
    };
  }

  if (status === 404) {
    return {
      tone: "danger",
      icon: <QrCode size={18} />,
      title: "QR code not recognised",
      message: apiErrorMessage(error, "This QR code doesn't belong to any staff member."),
    };
  }

  if (status === 403) {
    return {
      tone: "danger",
      icon: <ShieldOff size={18} />,
      title: "Account inactive",
      message,
    };
  }

  if (status === 409) {
    if (/no meal required/i.test(message)) {
      return {
        tone: "warning",
        icon: <CircleSlash size={18} />,
        title: "No meal today",
        message,
      };
    }

    if (/not selected/i.test(message)) {
      return {
        tone: "warning",
        icon: <AlertTriangle size={18} />,
        title: "No meal selected",
        message,
      };
    }

    if (/maximum|max/i.test(message)) {
      return {
        tone: "warning",
        icon: <Ban size={18} />,
        title: "Daily limit reached",
        message,
      };
    }

    return {
      tone: "warning",
      icon: <AlertTriangle size={18} />,
      title: "Can't serve this meal",
      message,
    };
  }

  return {
    tone: "danger",
    icon: <AlertTriangle size={18} />,
    title: "Something went wrong",
    message,
  };
}
