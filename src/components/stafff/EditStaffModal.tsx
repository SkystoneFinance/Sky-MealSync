import { useId, useState, type FormEvent } from "react";
import toast from "react-hot-toast";

import { Button, Modal } from "../ui";
import { useUpdateStaff } from "../../hooks/useStaff";
import type { Staff, UpdateStaffPayload } from "../../types/staff";
import { apiErrorMessage } from "../../utils/mealPlanDates";

import StaffFormFields from "./StaffFormFields";
import {
  staffFullName,
  staffToForm,
  trimStaffForm,
  validateStaffForm,
  type StaffFormErrors,
} from "./staffForm";

interface Props {
  /** Staff member being edited. `null` closes the modal. */
  staff: Staff | null;
  onClose: () => void;
  departments?: string[];
}

const FORM_ID = "edit-staff-form";

/**
 * Render with `key={staff?.id}` so the form re-initialises for each person.
 */
export default function EditStaffModal({ staff, onClose, departments = [] }: Props) {
  const { mutate, isPending } = useUpdateStaff();
  const switchId = useId();

  const [form, setForm] = useState(() =>
    staff
      ? staffToForm(staff)
      : { firstName: "", lastName: "", staffNumber: "", department: "" }
  );
  const [isActive, setIsActive] = useState(staff?.isActive ?? true);
  const [errors, setErrors] = useState<StaffFormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  function handleClose() {
    if (isPending) return;
    onClose();
  }

  function handleChange(next: typeof form) {
    setForm(next);
    if (submitted) setErrors(validateStaffForm(next));
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!staff) return;
    setSubmitted(true);

    const nextErrors = validateStaffForm(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const trimmed = trimStaffForm(form);
    const original = staffToForm(staff);

    // Only send what actually changed.
    const payload: UpdateStaffPayload = {};
    (Object.keys(trimmed) as (keyof typeof trimmed)[]).forEach((key) => {
      if (trimmed[key] !== original[key]) payload[key] = trimmed[key];
    });
    if (isActive !== staff.isActive) payload.isActive = isActive;

    if (Object.keys(payload).length === 0) {
      onClose();
      return;
    }

    mutate(
      { id: staff.id, data: payload },
      {
        onSuccess() {
          toast.success(`${staffFullName(trimmed)} updated.`);
          onClose();
        },
        onError(error) {
          const status = (error as { response?: { status?: number } })
            ?.response?.status;
          if (status === 409) {
            setErrors((prev) => ({
              ...prev,
              staffNumber: "This staff number is already in use.",
            }));
          }
          toast.error(apiErrorMessage(error, "Couldn't save changes."));
        },
      }
    );
  }

  return (
    <Modal
      open={Boolean(staff)}
      onClose={handleClose}
      title="Edit staff"
      description={staff ? staffFullName(staff) : undefined}
      footer={
        <>
          <Button variant="secondary" onClick={handleClose} disabled={isPending}>
            Cancel
          </Button>
          <Button type="submit" form={FORM_ID} loading={isPending}>
            Save changes
          </Button>
        </>
      }
    >
      <form id={FORM_ID} onSubmit={submit} noValidate className="space-y-5">
        <StaffFormFields
          values={form}
          errors={errors}
          onChange={handleChange}
          departments={departments}
        />

        <div className="flex items-start justify-between gap-4 rounded-lg border border-zinc-200 p-4">
          <label htmlFor={switchId} className="min-w-0 cursor-pointer">
            <span className="block text-sm font-medium text-zinc-900">
              Active — can sign in and be served
            </span>
            <span className="mt-0.5 block text-sm text-zinc-500">
              Turn off instead of deleting to keep their meal history.
            </span>
          </label>
          <span className="relative mt-0.5 inline-flex shrink-0">
            <input
              id={switchId}
              type="checkbox"
              role="switch"
              checked={isActive}
              aria-checked={isActive}
              onChange={(event) => setIsActive(event.target.checked)}
              className="peer h-6 w-11 cursor-pointer appearance-none rounded-full bg-zinc-200 transition-colors checked:bg-brand-600 focus-visible:ring-3 focus-visible:ring-brand-600/25 focus-visible:outline-none"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-5"
            />
          </span>
        </div>
      </form>
    </Modal>
  );
}
