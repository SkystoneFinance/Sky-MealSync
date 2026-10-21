import { Upload, UserPlus } from "lucide-react";

import { Button, PageHeader } from "../ui";

interface Props {
  total?: number;
  active?: number;
  onCreate: () => void;
  onImport: () => void;
}

export default function StaffHeader({ total, active, onCreate, onImport }: Props) {
  const description =
    total === undefined
      ? "Manage who can sign in and be served meals."
      : `${total} ${total === 1 ? "person" : "people"} · ${active ?? 0} active`;

  return (
    <PageHeader
      title="Staff"
      description={description}
      actions={
        <>
          <Button
            variant="secondary"
            icon={<Upload size={16} />}
            onClick={onImport}
          >
            Import from Excel
          </Button>
          <Button icon={<UserPlus size={16} />} onClick={onCreate}>
            Add staff
          </Button>
        </>
      }
    />
  );
}
