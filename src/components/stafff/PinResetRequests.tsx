import toast from "react-hot-toast";

import { KeyRound } from "lucide-react";

import {
  useDismissPinResetRequest,
  usePinResetRequests,
} from "../../hooks/useStaff";
import { apiErrorMessage, formatTimestamp } from "../../utils/mealPlanDates";

import { Avatar, Button, Card, CardHeader } from "../ui";

import ResetPinButton from "./ResetPinButton";

// "Forgot your PIN?" requests from the sign-in page. Hidden when empty.
export default function PinResetRequests() {
  const { data: requests = [] } = usePinResetRequests();
  const dismiss = useDismissPinResetRequest();

  if (!requests.length) return null;

  return (
    <Card className="border-amber-200">
      <CardHeader
        title={
          <span className="flex items-center gap-2">
            <KeyRound size={17} className="text-amber-600" />
            PIN reset requests ({requests.length})
          </span>
        }
        description="Staff who forgot their PIN. Reset it, then tell them to choose a new one with “Activate your account”."
      />
      <ul className="divide-y divide-zinc-100">
        {requests.map((request) => {
          const name = `${request.staff.firstName} ${request.staff.lastName}`;

          return (
            <li key={request.id} className="flex flex-col gap-3 px-5 py-3 sm:flex-row sm:items-center">
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <Avatar name={name} size="sm" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-zinc-900">{name}</p>
                  <p className="truncate text-xs text-zinc-500">
                    {request.staff.staffNumber} · {request.staff.department} · asked {formatTimestamp(request.createdAt)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 pl-10 sm:pl-0">
                <Button
                  variant="ghost"
                  size="sm"
                  loading={dismiss.isPending && dismiss.variables === request.id}
                  onClick={() =>
                    dismiss.mutate(request.id, {
                      onError: (error) => toast.error(apiErrorMessage(error)),
                    })
                  }
                >
                  Dismiss
                </Button>
                <ResetPinButton staff={request.staff} />
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
