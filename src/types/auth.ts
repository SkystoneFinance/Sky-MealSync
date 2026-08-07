export type Role =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "USER";

export interface User {
  id: string;
  email: string;
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

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  user: User;
}