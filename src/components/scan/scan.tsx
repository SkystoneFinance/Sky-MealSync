import ScannerCard from "./scannerCard";

export default function Scan() {
  return (
    <div className="space-y-7">
      <div>
        <h1 className="text-2xl md:text-4xl font-bold">
          Scan Meal QR
        </h1>

        <p className="mt-2 text-xs md:text-lg text-gray-500">
          Scan a staff QR Code to record today's meal attendance.
        </p>
      </div>

      <ScannerCard />
    </div>
  );
}