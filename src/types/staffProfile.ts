export interface StaffProfile {
  id: string;
  staffNumber: string;
  firstName: string;
  lastName: string;
  department: string;
  phoneNumber: string | null;
  qrCodeId: string;
  qrImage: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StaffProfileResponse {
  success: boolean;
  data: StaffProfile;
}