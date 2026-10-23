import { Link } from "react-router-dom";

import { KeyRound } from "lucide-react";

import { useAuth } from "../../hooks/useAuth";
import { usePinResetRequests } from "../../hooks/useStaff";

import { Callout, buttonStyles } from "../ui";

// Administrator overview: staff waiting for a PIN reset
export default function PinRequestsBanner() {
  const { user } = useAuth();
  const isAdmin = user?.role === "SUPER_ADMIN";
  const { data: requests = [] } = usePinResetRequests(isAdmin);

  if (!isAdmin || !requests.length) return null;

  const names = requests
    .slice(0, 3)
    .map((r) => `${r.staff.firstName} ${r.staff.lastName}`)
    .join(", ");

  return (
    <Callout
      tone="warning"
      icon={<KeyRound size={18} />}
      title={`${requests.length} PIN reset ${requests.length === 1 ? "request" : "requests"}`}
      action={
        <Link to="/staff" className={buttonStyles("secondary", "sm")}>
          Review
        </Link>
      }
    >
      {names}
      {requests.length > 3 ? ` and ${requests.length - 3} more` : ""} forgot their PIN.
    </Callout>
  );
}
