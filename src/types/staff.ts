export interface Staff {
  id: string;
  staffNumber: string;
  firstName: string;
  lastName: string;
  department: string;
  phoneNumber?: string | null;
  qrCodeId: string;
  qrImage: string;
  isActive: boolean;
  hasActivedAccount?: boolean;
  // Has activated and set a PIN (can sign in)
  hasPin?: boolean;
  createdAt: string;
}

// "Forgot your PIN?" requests waiting for an administrator
export interface PinResetRequest {
  id: string;
  createdAt: string;
  staff: {
    id: string;
    staffNumber: string;
    firstName: string;
    lastName: string;
    department: string;
  };
}

export interface CreateStaffPayload {
  firstName: string;
  lastName: string;
  staffNumber: string;
  department: string;
}

export type UpdateStaffPayload = Partial<CreateStaffPayload> & {
  isActive?: boolean;
};

export interface ImportStaffResult {
  imported: number;
  skipped: number;
}
