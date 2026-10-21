import type { CreateStaffPayload, Staff } from "../../types/staff";

export type StaffFormValues = CreateStaffPayload;

export type StaffFormErrors = Partial<Record<keyof StaffFormValues, string>>;

export const EMPTY_STAFF_FORM: StaffFormValues = {
  firstName: "",
  lastName: "",
  staffNumber: "",
  department: "",
};

const LABELS: Record<keyof StaffFormValues, string> = {
  firstName: "First name",
  lastName: "Last name",
  staffNumber: "Staff number",
  department: "Department",
};

export function staffToForm(staff: Staff): StaffFormValues {
  return {
    firstName: staff.firstName,
    lastName: staff.lastName,
    staffNumber: staff.staffNumber,
    department: staff.department,
  };
}

export function trimStaffForm(values: StaffFormValues): StaffFormValues {
  return {
    firstName: values.firstName.trim(),
    lastName: values.lastName.trim(),
    staffNumber: values.staffNumber.trim(),
    department: values.department.trim(),
  };
}

export function validateStaffForm(values: StaffFormValues): StaffFormErrors {
  const errors: StaffFormErrors = {};

  (Object.keys(LABELS) as (keyof StaffFormValues)[]).forEach((key) => {
    const value = values[key].trim();
    if (!value) errors[key] = `${LABELS[key]} is required.`;
    else if (value.length < 2)
      errors[key] = `${LABELS[key]} must be at least 2 characters.`;
  });

  return errors;
}

export function staffFullName(staff: Pick<Staff, "firstName" | "lastName">) {
  return `${staff.firstName} ${staff.lastName}`.trim();
}

export function downloadStaffQr(staff: Pick<Staff, "qrImage" | "staffNumber">) {
  const link = document.createElement("a");
  link.href = staff.qrImage;
  link.download = `${staff.staffNumber}-QR.png`;
  document.body.appendChild(link);
  link.click();
  link.remove();
}
