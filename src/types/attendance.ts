export interface Attendance {
  id: string;
  mealDate: string;
  scannedAt: string;

  staff: {
    id: string;
    firstName: string;
    lastName: string;
    staffNumber: string;
    department: string;
    qrImage: string;
  };
}

export interface ScanPayload {
  qrCodeId: string;
}