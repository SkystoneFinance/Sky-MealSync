import { useId, type ChangeEvent } from "react";

import { Field, Input } from "../ui";

import type { StaffFormErrors, StaffFormValues } from "./staffForm";

interface Props {
  values: StaffFormValues;
  errors: StaffFormErrors;
  onChange: (values: StaffFormValues) => void;
  departments: string[];
  autoFocus?: boolean;
}

export default function StaffFormFields({
  values,
  errors,
  onChange,
  departments,
  autoFocus = false,
}: Props) {
  const id = useId();

  const set =
    (key: keyof StaffFormValues) =>
    (event: ChangeEvent<HTMLInputElement>) =>
      onChange({ ...values, [key]: event.target.value });

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="First name" htmlFor={`${id}-first`} error={errors.firstName}>
          <Input
            id={`${id}-first`}
            value={values.firstName}
            onChange={set("firstName")}
            placeholder="Ada"
            autoComplete="off"
            autoFocus={autoFocus}
            aria-invalid={Boolean(errors.firstName)}
          />
        </Field>
        <Field label="Last name" htmlFor={`${id}-last`} error={errors.lastName}>
          <Input
            id={`${id}-last`}
            value={values.lastName}
            onChange={set("lastName")}
            placeholder="Okafor"
            autoComplete="off"
            aria-invalid={Boolean(errors.lastName)}
          />
        </Field>
      </div>

      <Field
        label="Staff number"
        htmlFor={`${id}-number`}
        error={errors.staffNumber}
        hint="Must be unique. Staff use it to sign in."
      >
        <Input
          id={`${id}-number`}
          value={values.staffNumber}
          onChange={set("staffNumber")}
          placeholder="SKY-0042"
          autoComplete="off"
          aria-invalid={Boolean(errors.staffNumber)}
        />
      </Field>

      <Field
        label="Department"
        htmlFor={`${id}-department`}
        error={errors.department}
      >
        <Input
          id={`${id}-department`}
          value={values.department}
          onChange={set("department")}
          placeholder="Finance"
          autoComplete="off"
          list={departments.length ? `${id}-departments` : undefined}
          aria-invalid={Boolean(errors.department)}
        />
      </Field>
      {departments.length > 0 && (
        <datalist id={`${id}-departments`}>
          {departments.map((department) => (
            <option key={department} value={department} />
          ))}
        </datalist>
      )}
    </div>
  );
}
