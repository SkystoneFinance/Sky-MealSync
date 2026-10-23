import toast from "react-hot-toast";

import { KeyRound } from "lucide-react";

import { useResetPin } from "../../hooks/useStaff";
import { apiErrorMessage } from "../../utils/mealPlanDates";

import { Button } from "../ui";

// PINs can't be read back (they're hashed). Resetting clears it, and the
// staff member picks a new one with "Activate your account" on sign-in.
export default function ResetPinButton({
  staff,
  compact = false,
}: {
  staff: { id: string; firstName: string; lastName: string };
  compact?: boolean;
}) {
  const resetPin = useResetPin();
  const name = `${staff.firstName} ${staff.lastName}`;

  const handleReset = () => {
    const ok = window.confirm(
      `Reset ${name}'s PIN?\n\nTheir current PIN stops working. Ask them to open MealSync now, tap "Activate your account" and choose a new PIN. (Until they do, anyone with their staff number could set it.)`
    );

    if (!ok) return;

    resetPin.mutate(staff.id, {
      onSuccess: (res) => toast.success(res.message),
      onError: (error) => toast.error(apiErrorMessage(error, "Couldn't reset the PIN.")),
    });
  };

  if (compact) {
    return (
      <Button
        variant="ghost"
        size="icon"
        aria-label={`Reset PIN for ${name}`}
        title="Reset PIN"
        loading={resetPin.isPending}
        onClick={handleReset}
        icon={<KeyRound size={16} />}
      />
    );
  }

  return (
    <Button
      size="sm"
      icon={<KeyRound size={15} />}
      loading={resetPin.isPending}
      onClick={handleReset}
    >
      Reset PIN
    </Button>
  );
}
