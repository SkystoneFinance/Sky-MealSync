import { useState, type FormEvent } from "react";
import toast from "react-hot-toast";

import { Button, Modal } from "../ui";
import { useCreateStaff } from "../../hooks/useStaff";
import { apiErrorMessage } from "../../utils/mealPlanDates";

import StaffFormFields from "./StaffFormFields";
import {
  EMPTY_STAFF_FORM,
  trimStaffForm,
  validateStaffForm,
  type StaffFormErrors,
} from "./staffForm";

interface Props {
  open: boolean;
  close: () => void;
  departments?: string[];
}

const FORM_ID = "add-staff-form";

export default function AddStaffModal({ open, close, departments = [] }: Props) {
  const { mutate, isPending } = useCreateStaff();

  const [form, setForm] = useState(EMPTY_STAFF_FORM);
  const [errors, setErrors] = useState<StaffFormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  function reset() {
    setForm(EMPTY_STAFF_FORM);
    setErrors({});
    setSubmitted(false);
  }

  function handleClose() {
    if (isPending) return;
    reset();
    close();
  }

  function handleChange(next: typeof form) {
    setForm(next);
    if (submitted) setErrors(validateStaffForm(next));
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    setSubmitted(true);

    const nextErrors = validateStaffForm(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const payload = trimStaffForm(form);

    mutate(payload, {
      onSuccess() {
        toast.success(`${payload.firstName} ${payload.lastName} added.`);
        reset();
        close();
      },
      onError(error) {
        const status = (error as { response?: { status?: number } })?.response
          ?.status;
        if (status === 409) {
          setErrors((prev) => ({
            ...prev,
            staffNumber: "This staff number is already in use.",
          }));
        }
        toast.error(apiErrorMessage(error, "Couldn't add this staff member."));
      },
    });
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Add staff"
      description="They'll get a QR code automatically and can activate their account with their staff number."
      footer={
        <>
          <Button variant="secondary" onClick={handleClose} disabled={isPending}>
            Cancel
          </Button>
          <Button type="submit" form={FORM_ID} loading={isPending}>
            Add staff
          </Button>
        </>
      }
    >
      <form id={FORM_ID} onSubmit={submit} noValidate>
        <StaffFormFields
          values={form}
          errors={errors}
          onChange={handleChange}
          departments={departments}
          autoFocus
        />
      </form>
    </Modal>
  );
}
