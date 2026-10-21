// =========================================
// TODAY / HISTORY ROWS
// =========================================
// One row per serving: a staff member served twice today has two rows.

export interface AttendanceStaff {
  id: string;
  firstName: string;
  lastName: string;
  staffNumber: string;
  department: string;
  qrImage: string;
  isActive?: boolean;
}

export interface Attendance {
  id: string;
  staffId?: string;
  mealDate: string;
  scannedAt: string;

  staff: AttendanceStaff;

  // The dish they chose for the day (today's list only)
  meal?: { id: string; name: string; image: string } | null;
}

// =========================================
// SCAN / SERVE
// =========================================

export interface ScanPayload {
  qrCodeId: string;
}

export interface ServePayload {
  staffId: string;
}

export interface ScannedStaff {
  id: string;
  staffNumber: string;
  firstName: string;
  lastName: string;
  department: string;
  qrImage?: string | null;
}

export interface ScannedMeal {
  id: string;
  name: string;
  image?: string | null;
}

export interface ServingInfo {
  servedCount: number;
  remainingServings: number;
  maxDailyServings: number;
}

// POST /attendance/scan: preview only, nothing is recorded.
export interface ScanPreview {
  staff: ScannedStaff;
  meal: ScannedMeal;
  serving: ServingInfo;
}

// POST /attendance/serve: the serving has been recorded.
export interface ServeResult {
  staff: ScannedStaff;
  meal: ScannedMeal;
  attendance: ServingInfo & { scannedAt: string };
}
