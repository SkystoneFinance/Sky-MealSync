export interface Staff {
  id:string;
  staffNumber:string;
  firstName:string;
  lastName:string;
  department:string;
  qrCodeId:string;
  qrImage:string;
  isActive:boolean;
  createdAt:string;
}

export interface CreateStaffPayload {
  firstName:string;
  lastName:string;
  staffNumber:string;
  department:string;
}