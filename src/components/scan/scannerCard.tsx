import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Camera, CheckCircle2, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";

import { useScan } from "../../hooks/useScan";

export default function ScannerCard() {
  const scannerRef = useRef<Html5Qrcode | null>(null);

  const [isScanning, setIsScanning] = useState(false);

  const [staff, setStaff] = useState<any>(null);

  const { mutate, isPending } = useScan();

  useEffect(() => {
    startScanner();

    return () => {
      stopScanner();
    };
  }, []);

  async function startScanner() {
    if (scannerRef.current) return;

    const scanner = new Html5Qrcode("reader");

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
        () => {}
      );

      setIsScanning(true);
    } catch (err) {
      console.error(err);

      toast.error("Unable to access camera");
    }
  }

  async function stopScanner() {
    if (!scannerRef.current) return;

    try {
      await scannerRef.current.stop();
      await scannerRef.current.clear();

      scannerRef.current = null;

      setIsScanning(false);
    } catch {}
  }

  function onScanSuccess(decodedText: string) {
    stopScanner();

    mutate(
      {
        qrCodeId: decodedText,
      },
      {
        onSuccess(res) {
          toast.success("Meal recorded!");

          setStaff(res.data.staff);
        },

        onError(error: any) {
          toast.error(
            error.response?.data?.message ??
              "Unable to record attendance."
          );
        },
      }
    );
  }

  async function scanAgain() {
    setStaff(null);

    await startScanner();
  }

  return (
    <div className="rounded-3xl border bg-white p-8 shadow-sm">

      {staff ? (
        <div className="flex flex-col items-center">

          <CheckCircle2
            size={70}
            className="text-green-600"
          />

          <h2 className="mt-4 text-2xl font-bold">
            Attendance Recorded
          </h2>

          <img
            src={staff.qrImage}
            alt=""
            className="mt-6 h-36 w-36 rounded-xl border object-cover"
          />

          <h3 className="mt-4 text-xl font-semibold">
            {staff.firstName} {staff.lastName}
          </h3>

          <p className="text-gray-500">
            {staff.staffNumber}
          </p>

          <p className="text-gray-500">
            {staff.department}
          </p>

          <button
            onClick={scanAgain}
            className="mt-8 flex items-center gap-2 rounded-xl bg-[#B10F16] px-6 py-3 text-white"
          >
            <RefreshCw size={18} />

            Scan Again
          </button>
        </div>
      ) : (
        <>
          <div className="mb-6 flex items-center gap-3">

            <Camera className="text-[#B10F16]" />

            <h2 className="text-xl font-bold">
              QR Scanner
            </h2>
          </div>

          <div
            id="reader"
            className="overflow-hidden rounded-2xl border"
          />

          {isPending && (
            <p className="mt-5 text-center font-medium">
              Recording attendance...
            </p>
          )}

          {!isScanning && !isPending && (
            <button
              onClick={startScanner}
              className="mt-6 w-full rounded-xl bg-[#B10F16] py-3 font-semibold text-white transition hover:bg-[#900d12]"
            >
              Start Camera
            </button>
          )}
        </>
      )}
    </div>
  );
}