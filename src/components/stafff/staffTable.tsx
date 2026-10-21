import { Pencil, QrCode, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

import { Avatar, Badge, Button, Table, Td, Th } from "../ui";
import { useDeleteStaff } from "../../hooks/useStaff";
import type { Staff } from "../../types/staff";
import { apiErrorMessage } from "../../utils/mealPlanDates";

import { downloadStaffQr, staffFullName } from "./staffForm";

interface Props {
  staff: Staff[];
  onEdit: (staff: Staff) => void;
}

function StatusBadge({ active }: { active: boolean }) {
  return active ? (
    <Badge tone="success">Active</Badge>
  ) : (
    <Badge tone="neutral">Inactive</Badge>
  );
}

function RowActions({
  person,
  onEdit,
  onDelete,
  deleting,
}: {
  person: Staff;
  onEdit: () => void;
  onDelete: () => void;
  deleting: boolean;
}) {
  const name = staffFullName(person);

  return (
    <div className="flex items-center justify-end gap-1">
      <Button
        variant="ghost"
        size="icon"
        aria-label={`Edit ${name}`}
        title="Edit"
        onClick={onEdit}
        icon={<Pencil size={16} />}
      />
      <Button
        variant="ghost"
        size="icon"
        aria-label={`Download QR code for ${name}`}
        title={person.qrImage ? "Download QR code" : "No QR code available"}
        disabled={!person.qrImage}
        onClick={() => downloadStaffQr(person)}
        icon={<QrCode size={16} />}
      />
      <Button
        variant="ghost"
        size="icon"
        aria-label={`Delete ${name}`}
        title="Delete"
        loading={deleting}
        onClick={onDelete}
        className="text-zinc-500 hover:bg-red-50 hover:text-red-700"
        icon={<Trash2 size={16} />}
      />
    </div>
  );
}

export default function StaffTable({ staff, onEdit }: Props) {
  const { mutate: deleteStaff, isPending, variables } = useDeleteStaff();

  function confirmDelete(person: Staff) {
    const name = staffFullName(person);
    const ok = window.confirm(
      `Delete ${name} (${person.staffNumber})?\n\n` +
        "This permanently deletes their meal selections and history too. " +
        "If they've just left, consider deactivating them instead (Edit → Active) to keep their records."
    );
    if (!ok) return;

    deleteStaff(person.id, {
      onSuccess: () => toast.success(`${name} deleted.`),
      onError: (error) =>
        toast.error(apiErrorMessage(error, `Couldn't delete ${name}.`)),
    });
  }

  const isDeleting = (id: string) => isPending && variables === id;

  return (
    <>
      {/* Mobile: stacked list */}
      <ul className="divide-y divide-zinc-100 md:hidden">
        {staff.map((person) => (
          <li key={person.id} className="flex items-start gap-3 px-4 py-3">
            <Avatar name={staffFullName(person)} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate font-medium text-zinc-900">
                  {staffFullName(person)}
                </p>
              </div>
              <p className="tabular truncate text-sm text-zinc-500">
                {person.staffNumber} · {person.department}
              </p>
              <div className="mt-1.5">
                <StatusBadge active={person.isActive} />
              </div>
            </div>
            <RowActions
              person={person}
              onEdit={() => onEdit(person)}
              onDelete={() => confirmDelete(person)}
              deleting={isDeleting(person.id)}
            />
          </li>
        ))}
      </ul>

      {/* Desktop: table */}
      <div className="hidden md:block">
        <Table>
          <thead>
            <tr>
              <Th>Name</Th>
              <Th>Staff number</Th>
              <Th>Department</Th>
              <Th>Status</Th>
              <Th className="text-right">
                <span className="sr-only">Actions</span>
              </Th>
            </tr>
          </thead>
          <tbody>
            {staff.map((person) => (
              <tr
                key={person.id}
                className="transition-colors hover:bg-zinc-50/60 [&:last-child>td]:border-b-0"
              >
                <Td>
                  <div className="flex items-center gap-3">
                    <Avatar name={staffFullName(person)} size="sm" />
                    <span className="font-medium text-zinc-900">
                      {staffFullName(person)}
                    </span>
                  </div>
                </Td>
                <Td className="tabular text-zinc-700">{person.staffNumber}</Td>
                <Td className="text-zinc-700">{person.department}</Td>
                <Td>
                  <StatusBadge active={person.isActive} />
                </Td>
                <Td className="py-2">
                  <RowActions
                    person={person}
                    onEdit={() => onEdit(person)}
                    onDelete={() => confirmDelete(person)}
                    deleting={isDeleting(person.id)}
                  />
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </>
  );
}
