import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Camera, CameraOff, Pause, RefreshCw } from "lucide-react";

import { Badge, Button, Card, CardHeader, Spinner, cn } from "../ui";

// The camera is driven imperatively by html5-qrcode, so it needs a real
// element id. Only one scanner is ever mounted on the page.
const READER_ID = "meal-qr-reader";

type CameraStatus = "starting" | "scanning" | "paused" | "error";

// ==========================================
// CAMERA HOOK
// ==========================================
// Starts the rear camera while `active` is true and stops it otherwise.
// Start/stop calls are queued so they never overlap (html5-qrcode throws if
// you stop while it is still starting). After the first decode the camera
// stops straight away so one QR code can never trigger two lookups.

function useQrCamera(active: boolean, onDecode: (text: string) => void) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const queueRef = useRef<Promise<void>>(Promise.resolve());
  const decodedRef = useRef(false);
  const onDecodeRef = useRef(onDecode);

  const [status, setStatus] = useState<CameraStatus>("paused");
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  // Always call the latest callback without restarting the camera.
  useLayoutEffect(() => {
    onDecodeRef.current = onDecode;
  }, [onDecode]);

  useEffect(() => {
    // Each effect run gets its own token; cleanup cancels it so queued work
    // from a superseded run neither starts the camera nor sets state.
    const run = { cancelled: false };

    const enqueue = (task: () => Promise<void>) => {
      queueRef.current = queueRef.current.then(task, task);
    };

    const stop = async () => {
      const scanner = scannerRef.current;
      if (!scanner) return;

      scannerRef.current = null;

      try {
        if (scanner.isScanning) await scanner.stop();
        scanner.clear();
      } catch (stopError) {
        console.error("Scanner stop error:", stopError);
      }
    };

    if (!active) {
      enqueue(async () => {
        await stop();
        if (!run.cancelled) setStatus("paused");
      });
      return () => {
        run.cancelled = true;
      };
    }

    enqueue(async () => {
      // A newer effect run superseded this one before it got its turn.
      if (run.cancelled) return;

      await stop();

      setStatus("starting");
      setError(null);
      decodedRef.current = false;

      const scanner = new Html5Qrcode(READER_ID, { verbose: false });
      scannerRef.current = scanner;

      try {
        await scanner.start(
          { facingMode: "environment" },
          { fps: 10, aspectRatio: 1 },
          (decodedText) => {
            if (decodedRef.current) return;
            decodedRef.current = true;

            enqueue(stop);
            onDecodeRef.current(decodedText);
          },
          () => {
            // Frames without a QR code: ignore.
          }
        );

        if (!run.cancelled) setStatus("scanning");
      } catch (startError) {
        console.error("QR scanner error:", startError);
        scannerRef.current = null;

        if (!run.cancelled) {
          setStatus("error");
          setError(cameraErrorMessage(startError));
        }
      }
    });

    return () => {
      run.cancelled = true;
      enqueue(stop);
    };
  }, [active, attempt]);

  return {
    status,
    error,
    retry: () => setAttempt((value) => value + 1),
  };
}

function cameraErrorMessage(error: unknown) {
  const text = String(
    error instanceof Error ? `${error.name} ${error.message}` : error
  );

  if (/NotAllowed|Permission/i.test(text)) {
    return "Camera access was blocked. Allow camera access for this site in your browser settings, then try again.";
  }

  if (/NotFound|Requested device not found|no camera/i.test(text)) {
    return "No camera was found on this device.";
  }

  if (/NotReadable|in use|Could not start video/i.test(text)) {
    return "The camera is being used by another app. Close it and try again.";
  }

  if (/secure|https/i.test(text)) {
    return "The camera only works on a secure (https) connection.";
  }

  return "We couldn't start the camera. Check permissions and try again.";
}

// ==========================================
// CARD
// ==========================================

const STATUS_COPY: Record<CameraStatus, string> = {
  starting: "Starting camera…",
  scanning: "Point the camera at a staff QR code",
  paused: "Camera paused while you review this scan",
  error: "Camera unavailable",
};

export default function ScannerCard({
  active,
  onDecode,
}: {
  active: boolean;
  onDecode: (text: string) => void;
}) {
  const { status, error, retry } = useQrCamera(active, onDecode);

  return (
    <Card>
      <CardHeader
        title="Camera"
        description="Uses the rear camera on phones and tablets."
        actions={
          status === "scanning" ? (
            <Badge
              tone="success"
              icon={
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
              }
            >
              Live
            </Badge>
          ) : status === "error" ? (
            <Badge tone="danger">Off</Badge>
          ) : (
            <Badge>{status === "starting" ? "Starting" : "Paused"}</Badge>
          )
        }
      />

      <div className="p-4 sm:p-5">
        <div className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-2xl bg-zinc-900">
          {/* html5-qrcode injects its <video> in here. */}
          <div
            id={READER_ID}
            className={cn(
              "absolute inset-0 [&_video]:h-full! [&_video]:w-full! [&_video]:object-cover",
              status !== "scanning" && "opacity-0"
            )}
          />

          {status === "scanning" && <ViewfinderFrame />}

          {status === "starting" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-sm text-zinc-300">
              <Spinner className="text-zinc-400" />
              Starting camera…
            </div>
          )}

          {status === "paused" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center text-sm text-zinc-300">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-zinc-200">
                <Pause size={20} aria-hidden="true" />
              </span>
              Scanning paused
            </div>
          )}

          {status === "error" && (
            <div
              role="alert"
              className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-zinc-50 px-6 text-center"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-red-600">
                <CameraOff size={20} aria-hidden="true" />
              </span>
              <p className="font-medium text-zinc-900">Camera unavailable</p>
              <p className="max-w-xs text-sm text-zinc-500">{error}</p>
              <Button
                variant="secondary"
                onClick={retry}
                icon={<RefreshCw size={16} />}
                className="mt-1"
              >
                Try again
              </Button>
            </div>
          )}
        </div>

        <p
          aria-live="polite"
          className="mt-4 flex items-center justify-center gap-2 text-center text-sm text-zinc-500"
        >
          <Camera size={16} aria-hidden="true" className="shrink-0" />
          {STATUS_COPY[status]}
        </p>
      </div>
    </Card>
  );
}

// Corner brackets that frame the scan area.
function ViewfinderFrame() {
  const corner = "absolute h-10 w-10 border-white/90";

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-[14%]">
      <span className={cn(corner, "top-0 left-0 rounded-tl-xl border-t-4 border-l-4")} />
      <span className={cn(corner, "top-0 right-0 rounded-tr-xl border-t-4 border-r-4")} />
      <span className={cn(corner, "bottom-0 left-0 rounded-bl-xl border-b-4 border-l-4")} />
      <span className={cn(corner, "right-0 bottom-0 rounded-br-xl border-r-4 border-b-4")} />
    </div>
  );
}
