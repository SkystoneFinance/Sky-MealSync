import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Html5Qrcode,
} from "html5-qrcode";

import {
  Camera,
  CheckCircle2,
  RefreshCw,
  Utensils,
  Loader2,
} from "lucide-react";

import toast from "react-hot-toast";

import { useScan } from "../../hooks/useScan";
import { useServeMeal } from "../../hooks/useServedMeal";


// ==========================================
// TYPES
// ==========================================

interface Staff {
  id: string;
  staffNumber: string;
  firstName: string;
  lastName: string;
  department: string;
  qrImage?: string;
}

interface Meal {
  id: string;
  name: string;
  image: string;
}

interface Serving {
  servedCount: number;
  remainingServings: number;
  maxDailyServings: number;
}

interface ScanResult {
  staff: Staff;
  meal: Meal;
  serving: Serving;
}


// ==========================================
// COMPONENT
// ==========================================

export default function ScannerCard() {
  const scannerRef =
    useRef<Html5Qrcode | null>(null);

  const [isScanning, setIsScanning] =
    useState(false);

  const [scanResult, setScanResult] =
    useState<ScanResult | null>(null);

  const {
    mutate: scan,
    isPending: isScanningStaff,
  } = useScan();

  const {
    mutate: serveMeal,
    isPending: isServing,
  } = useServeMeal();


  // ==========================================
  // START / STOP SCANNER
  // ==========================================

  useEffect(() => {
    startScanner();

    return () => {
      stopScanner();
    };
  }, []);


  async function startScanner() {
    if (scannerRef.current) {
      return;
    }

    const scanner =
      new Html5Qrcode("reader");

    scannerRef.current = scanner;

    try {
      await scanner.start(
        {
          facingMode: "environment",
        },
        {
          fps: 10,

          qrbox: {
            width: 250,
            height: 250,
          },
        },
        onScanSuccess,
        () => {},
      );

      setIsScanning(true);
    } catch (error) {
      console.error(
        "QR scanner error:",
        error,
      );

      scannerRef.current = null;

      setIsScanning(false);

      toast.error(
        "Unable to access camera.",
      );
    }
  }


  async function stopScanner() {
    if (!scannerRef.current) {
      return;
    }

    try {
      if (
        scannerRef.current.isScanning
      ) {
        await scannerRef.current.stop();
      }

      await scannerRef.current.clear();
    } catch (error) {
      console.error(
        "Scanner stop error:",
        error,
      );
    } finally {
      scannerRef.current = null;

      setIsScanning(false);
    }
  }


  // ==========================================
  // QR SCAN SUCCESS
  // ==========================================

  function onScanSuccess(
    decodedText: string,
  ) {
    // Stop immediately so the same QR
    // cannot trigger multiple requests.

    stopScanner();

    scan(
      {
        qrCodeId: decodedText,
      },
      {
        onSuccess(response) {
          setScanResult(
            response.data,
          );

          toast.success(
            "Staff identified successfully.",
          );
        },

        onError(error: any) {
          toast.error(
            error.response?.data?.message ??
              "Unable to identify staff.",
          );

          // Give the scanner a moment to
          // fully stop before restarting.

          setTimeout(() => {
            startScanner();
          }, 500);
        },
      },
    );
  }


  // ==========================================
  // MARK AS EATEN
  // ==========================================

  function handleServeMeal() {
    if (!scanResult) {
      return;
    }

    const {
      servedCount,
      maxDailyServings,
    } = scanResult.serving;

    // ----------------------------------------
    // FRONTEND SAFETY CHECK
    // ----------------------------------------

    if (
      servedCount >= maxDailyServings
    ) {
      toast.error(
        "Maximum daily servings reached.",
      );

      return;
    }

    serveMeal(
      {
        staffId:
          scanResult.staff.id,
      },
      {
        onSuccess(response) {
          const result =
            response.data;

          // ----------------------------------
          // UPDATE SERVING COUNT
          // ----------------------------------

          setScanResult(
            (current) => {
              if (!current) {
                return current;
              }

              return {
                ...current,

                serving: {
                  servedCount:
                    result.attendance
                      .servedCount,

                  remainingServings:
                    result.attendance
                      .remainingServings,

                  maxDailyServings:
                    result.attendance
                      .maxDailyServings,
                },
              };
            },
          );

          toast.success(
            `Meal served successfully. Serving ${result.attendance.servedCount} of ${result.attendance.maxDailyServings}.`,
          );
        },

        onError(error: any) {
          toast.error(
            error.response?.data?.message ??
              "Unable to record meal serving.",
          );
        },
      },
    );
  }


  // ==========================================
  // SCAN AGAIN
  // ==========================================

  async function scanAgain() {
    if (isServing) {
      return;
    }

    setScanResult(null);

    // Make sure the previous scanner is
    // completely stopped before starting
    // another one.

    await stopScanner();

    await startScanner();
  }


  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

      {scanResult ? (
        <div className="flex flex-col items-center">

          {/* ==================================
              SUCCESS ICON
          ================================== */}

          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
            <CheckCircle2
              size={38}
              className="text-green-600"
            />
          </div>


          {/* ==================================
              TITLE
          ================================== */}

          <h2 className="mt-4 text-2xl font-bold text-slate-900">
            Staff Identified
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Review the selected meal before serving.
          </p>


          {/* ==================================
              STAFF INFORMATION
          ================================== */}

          <div className="mt-6 w-full max-w-md rounded-2xl border border-slate-200 bg-slate-50 p-5">

            <div className="flex items-center gap-4">

              {scanResult.staff.qrImage ? (
                <img
                  src={
                    scanResult.staff.qrImage
                  }
                  alt={`${scanResult.staff.firstName} ${scanResult.staff.lastName}`}
                  className="h-16 w-16 rounded-xl border border-slate-200 bg-white object-cover"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-white text-slate-400">
                  <Camera size={24} />
                </div>
              )}

              <div className="min-w-0">

                <h3 className="truncate text-lg font-bold text-slate-900">
                  {scanResult.staff.firstName}{" "}
                  {scanResult.staff.lastName}
                </h3>

                <p className="text-sm text-slate-500">
                  {scanResult.staff.staffNumber}
                </p>

                <p className="text-sm text-slate-500">
                  {scanResult.staff.department}
                </p>

              </div>

            </div>

          </div>


          {/* ==================================
              SELECTED MEAL
          ================================== */}

          <div className="mt-5 w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white">

            {scanResult.meal.image ? (
              <img
                src={
                  scanResult.meal.image
                }
                alt={
                  scanResult.meal.name
                }
                className="h-48 w-full object-cover"
              />
            ) : (
              <div className="flex h-48 items-center justify-center bg-slate-100 text-slate-400">
                <Utensils size={40} />
              </div>
            )}

            <div className="p-5">

              <div className="flex items-center gap-2">

                <Utensils
                  size={18}
                  className="text-[#B10F16]"
                />

                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Selected Meal
                </p>

              </div>

              <h3 className="mt-2 text-xl font-bold text-slate-900">
                {scanResult.meal.name}
              </h3>


              {/* ==================================
                  SERVING INFORMATION
              ================================== */}

              <div className="mt-5 grid grid-cols-2 gap-3">

                <div className="rounded-xl bg-slate-50 p-4">

                  <p className="text-xs font-medium text-slate-500">
                    Served Today
                  </p>

                  <p className="mt-1 text-2xl font-bold text-slate-900">
                    {
                      scanResult.serving
                        .servedCount
                    }

                    <span className="text-sm font-medium text-slate-400">
                      /
                      {
                        scanResult.serving
                          .maxDailyServings
                      }
                    </span>
                  </p>

                </div>


                <div className="rounded-xl bg-red-50 p-4">

                  <p className="text-xs font-medium text-slate-500">
                    Remaining
                  </p>

                  <p className="mt-1 text-2xl font-bold text-[#B10F16]">
                    {
                      scanResult.serving
                        .remainingServings
                    }
                  </p>

                </div>

              </div>

            </div>

          </div>


          {/* ==================================
              SERVE BUTTON
          ================================== */}

          {scanResult.serving.remainingServings > 0 ? (

            <button
              type="button"
              onClick={
                handleServeMeal
              }
              disabled={isServing}
              className="mt-6 inline-flex w-full max-w-md items-center justify-center gap-2 rounded-xl bg-[#B10F16] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#920C12] disabled:cursor-not-allowed disabled:opacity-60"
            >

              {isServing ? (
                <>
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />

                  Recording serving...
                </>
              ) : (
                <>
                  <CheckCircle2
                    size={18}
                  />

                  Mark as Eaten
                </>
              )}

            </button>

          ) : (

            <div className="mt-6 w-full max-w-md rounded-xl bg-red-50 p-4 text-center">

              <p className="text-sm font-semibold text-[#B10F16]">
                Maximum daily servings reached.
              </p>

              <p className="mt-1 text-xs text-slate-500">
                This staff member cannot be served again today.
              </p>

            </div>

          )}


          {/* ==================================
              SCAN AGAIN
          ================================== */}

          <button
            type="button"
            onClick={
              scanAgain
            }
            disabled={isServing}
            className="mt-4 inline-flex items-center gap-2 rounded-xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >

            <RefreshCw
              size={17}
            />

            Scan Again

          </button>

        </div>

      ) : (

        <>
          {/* ==================================
              SCANNER HEADER
          ================================== */}

          <div className="mb-6 flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FDEBEC]">

              <Camera
                size={20}
                className="text-[#B10F16]"
              />

            </div>

            <div>

              <h2 className="text-xl font-bold text-slate-900">
                QR Scanner
              </h2>

              <p className="text-sm text-slate-500">
                Scan a staff QR code to identify their meal.
              </p>

            </div>

          </div>


          {/* ==================================
              QR READER
          ================================== */}

          <div
            id="reader"
            className="overflow-hidden rounded-2xl border border-slate-200"
          />


          {/* ==================================
              IDENTIFYING STAFF
          ================================== */}

          {isScanningStaff && (
            <div className="mt-5 flex items-center justify-center gap-2 text-sm font-medium text-slate-600">

              <Loader2
                size={17}
                className="animate-spin text-[#B10F16]"
              />

              Identifying staff...

            </div>
          )}


          {/* ==================================
              START CAMERA
          ================================== */}

          {!isScanning &&
            !isScanningStaff && (
              <button
                type="button"
                onClick={
                  startScanner
                }
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#B10F16] py-3 font-semibold text-white transition hover:bg-[#900d12]"
              >

                <Camera
                  size={18}
                />

                Start Camera

              </button>
            )}

        </>

      )}

    </div>
  );
}