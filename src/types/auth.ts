export type Role =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "USER";


// ===============================
// ADMIN USER
// ===============================

export interface AdminUser {
  id: string;

  email?: string | null;

  role: Role;

  staff?: {
    id: string;

    firstName: string;

    lastName: string;

    department: string;

    qrImage: string;

    staffNumber: string;
  } | null;
}


// ===============================
// STAFF USER
// ===============================

export interface StaffUser {
  id: string;

  staffId: string;

  staffNumber: string;

  firstName: string;

  lastName: string;

  department: string;

  role: "USER";
}


// ===============================
// AUTH USER
// ===============================

export type User =
  | AdminUser
  | StaffUser;


// ===============================
// ADMIN LOGIN
// ===============================

export interface LoginPayload {
  email: string;

  password: string;
}


// ===============================
// STAFF ACTIVATION
// ===============================

export interface StaffActivatePayload {
  staffNumber: string;

  phoneNumber: string;
}


// ===============================
// STAFF OTP VERIFICATION
// ===============================

export interface StaffVerifyOtpPayload {
  staffNumber: string;

  phoneNumber: string;

  code: string;
}


// ===============================
// LOGIN RESPONSE
// ===============================

export interface LoginResponse {
  success: boolean;

  token: string;

  user: User;
}


// ===============================
// STAFF ACTIVATE RESPONSE
// ===============================

export interface StaffActivateResponse {
  success: boolean;

  message: string;
}


// ===============================
// STAFF OTP RESPONSE
// ===============================

export interface StaffOtpResponse {
  success: boolean;

  message: string;

  token: string;

  user: StaffUser;
}