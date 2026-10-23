import { useState, type FormEvent } from "react";

import { Navigate, useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

import {
  Eye,
  EyeOff,
  IdCard,
  KeyRound,
  Mail,
} from "lucide-react";

import { authService } from "../../services/auth.service";
import { useAuth } from "../../hooks/useAuth";
import { apiErrorMessage } from "../../utils/mealPlanDates";

import {
  Button,
  Field,
  Input,
  Segmented,
} from "../ui";

type Mode = "staff" | "admin";
type StaffStep = "login" | "activate" | "forgot";

const digitsOnly = (value: string) => value.replace(/\D/g, "").slice(0, 4);

export default function Login() {
  const navigate = useNavigate();
  const { user, login, staffLogin } = useAuth();

  const [mode, setMode] = useState<Mode>("staff");
  const [staffStep, setStaffStep] = useState<StaffStep>("login");

  const [staffNumber, setStaffNumber] = useState("");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [reveal, setReveal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState<string | null>(null);

  if (user) {
    return <Navigate to="/" replace />;
  }

  const resetSecrets = () => {
    setPin("");
    setConfirmPin("");
    setPassword("");
    setReveal(false);
  };

  async function handleAdminLogin(event: FormEvent) {
    event.preventDefault();

    if (!email.trim() || !password) {
      toast.error("Enter your email and password.");
      return;
    }

    try {
      setLoading(true);
      await login({ email: email.trim(), password });
      navigate("/", { replace: true });
    } catch (error) {
      toast.error(
        apiErrorMessage(error, "We couldn't sign you in. Check your email and password.")
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleStaffLogin(event: FormEvent) {
    event.preventDefault();

    if (!staffNumber.trim()) {
      toast.error("Enter your staff number.");
      return;
    }

    if (!/^\d{4}$/.test(pin)) {
      toast.error("Your PIN is 4 digits.");
      return;
    }

    try {
      setLoading(true);
      const result = await authService.staffLogin({
        staffNumber: staffNumber.trim(),
        pin,
      });
      staffLogin(result.user, result.token);
      navigate("/", { replace: true });
    } catch (error) {
      toast.error(
        apiErrorMessage(error, "Incorrect staff number or PIN.")
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleActivate(event: FormEvent) {
    event.preventDefault();

    if (!staffNumber.trim()) {
      toast.error("Enter your staff number.");
      return;
    }

    if (!/^\d{4}$/.test(pin)) {
      toast.error("Choose a 4-digit PIN.");
      return;
    }

    if (pin !== confirmPin) {
      toast.error("The two PINs don't match.");
      return;
    }

    try {
      setLoading(true);
      const result = await authService.activateStaff({
        staffNumber: staffNumber.trim(),
        pin,
        confirmPin,
      });
      toast.success(result.message ?? "Account activated. You can sign in now.");
      resetSecrets();
      setStaffStep("login");
    } catch (error) {
      toast.error(
        apiErrorMessage(error, "We couldn't activate your account.")
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleForgot(event: FormEvent) {
    event.preventDefault();

    if (!staffNumber.trim()) {
      toast.error("Enter your staff number.");
      return;
    }

    try {
      setLoading(true);
      const result = await authService.requestPinReset(staffNumber.trim());
      setResetSent(result.message);
    } catch (error) {
      toast.error(apiErrorMessage(error, "We couldn't send your request."));
    } finally {
      setLoading(false);
    }
  }

  const goTo = (step: StaffStep) => {
    setStaffStep(step);
    setResetSent(null);
    resetSecrets();
  };

  const pinToggle = (
    <button
      type="button"
      onClick={() => setReveal((v) => !v)}
      className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-zinc-400 hover:text-zinc-700"
      aria-label={reveal ? "Hide" : "Show"}
    >
      {reveal ? <EyeOff size={17} /> : <Eye size={17} />}
    </button>
  );

  const heading =
    mode === "admin"
      ? { title: "Sign in", text: "Kitchen and administrator accounts." }
      : staffStep === "activate"
        ? { title: "Activate your account", text: "First time here, or your PIN was reset? Choose a 4-digit PIN to sign in with." }
        : staffStep === "forgot"
          ? { title: "Forgot your PIN?", text: "We'll ask an administrator to reset it. PINs can't be recovered, only replaced." }
          : { title: "Sign in", text: "Use your staff number and 4-digit PIN." };

  return (
    <div className="flex min-h-dvh flex-col bg-zinc-50">
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-[400px]">
          <div className="mb-10 flex flex-col items-center text-center">
            <img src="/logoblack.png" alt="Skystone" className="h-10 w-auto" />
            <p className="mt-3 text-sm font-medium tracking-[0.2em] text-zinc-500 uppercase">
              MealSync
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-card sm:p-8">
            <Segmented
              className="mb-6 w-full"
              value={mode}
              onChange={(value) => {
                setMode(value);
                goTo("login");
              }}
              options={[
                { value: "staff", label: "Staff" },
                { value: "admin", label: "Kitchen & admin" },
              ]}
            />

            <h1 className="text-xl font-semibold text-zinc-900">{heading.title}</h1>
            <p className="mt-1 text-sm text-zinc-500">{heading.text}</p>

            {mode === "admin" ? (
              <form onSubmit={handleAdminLogin} className="mt-6 space-y-4">
                <Field label="Email" htmlFor="email">
                  <Input
                    id="email"
                    type="email"
                    autoComplete="username"
                    leading={<Mail size={16} />}
                    placeholder="name@skystone-finance.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Field>

                <Field label="Password" htmlFor="password">
                  <div className="relative">
                    <Input
                      id="password"
                      type={reveal ? "text" : "password"}
                      autoComplete="current-password"
                      leading={<KeyRound size={16} />}
                      className="pr-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    {pinToggle}
                  </div>
                </Field>

                <Button type="submit" size="lg" className="w-full" loading={loading}>
                  Sign in
                </Button>
              </form>
            ) : staffStep === "forgot" ? (
              resetSent ? (
                <div className="mt-6 space-y-4">
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
                    {resetSent}
                  </div>
                  <Button variant="secondary" size="lg" className="w-full" onClick={() => goTo("activate")}>
                    My PIN was reset: activate account
                  </Button>
                  <button
                    type="button"
                    className="block w-full text-center text-sm font-medium text-brand-600 hover:text-brand-700"
                    onClick={() => goTo("login")}
                  >
                    Back to sign in
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgot} className="mt-6 space-y-4">
                  <Field label="Staff number" htmlFor="forgotStaffNumber">
                    <Input
                      id="forgotStaffNumber"
                      autoCapitalize="characters"
                      leading={<IdCard size={16} />}
                      placeholder="e.g. AD001"
                      value={staffNumber}
                      onChange={(e) => setStaffNumber(e.target.value.toUpperCase())}
                    />
                  </Field>
                  <Button type="submit" size="lg" className="w-full" loading={loading}>
                    Request a PIN reset
                  </Button>
                  <button
                    type="button"
                    className="block w-full pt-1 text-center text-sm font-medium text-brand-600 hover:text-brand-700"
                    onClick={() => goTo("login")}
                  >
                    Back to sign in
                  </button>
                </form>
              )
            ) : (
              <form
                onSubmit={staffStep === "login" ? handleStaffLogin : handleActivate}
                className="mt-6 space-y-4"
              >
                <Field label="Staff number" htmlFor="staffNumber">
                  <Input
                    id="staffNumber"
                    autoComplete="username"
                    autoCapitalize="characters"
                    leading={<IdCard size={16} />}
                    placeholder="e.g. AD001"
                    value={staffNumber}
                    onChange={(e) => setStaffNumber(e.target.value.toUpperCase())}
                  />
                </Field>

                <Field
                  label={
                    staffStep === "activate" ? (
                      "Choose a PIN"
                    ) : (
                      <span className="flex items-center justify-between">
                        PIN
                        <button
                          type="button"
                          className="text-sm font-medium text-brand-600 hover:text-brand-700"
                          onClick={() => goTo("forgot")}
                        >
                          Forgot your PIN?
                        </button>
                      </span>
                    )
                  }
                  htmlFor="pin"
                >
                  <div className="relative">
                    <Input
                      id="pin"
                      type={reveal ? "text" : "password"}
                      inputMode="numeric"
                      autoComplete={staffStep === "activate" ? "new-password" : "current-password"}
                      leading={<KeyRound size={16} />}
                      className="pr-10 tracking-[0.3em]"
                      placeholder="••••"
                      value={pin}
                      onChange={(e) => setPin(digitsOnly(e.target.value))}
                    />
                    {pinToggle}
                  </div>
                </Field>

                {staffStep === "activate" && (
                  <Field label="Confirm PIN" htmlFor="confirmPin">
                    <Input
                      id="confirmPin"
                      type={reveal ? "text" : "password"}
                      inputMode="numeric"
                      autoComplete="new-password"
                      leading={<KeyRound size={16} />}
                      className="tracking-[0.3em]"
                      placeholder="••••"
                      value={confirmPin}
                      onChange={(e) => setConfirmPin(digitsOnly(e.target.value))}
                    />
                  </Field>
                )}

                <Button type="submit" size="lg" className="w-full" loading={loading}>
                  {staffStep === "activate" ? "Activate account" : "Sign in"}
                </Button>

                <p className="pt-1 text-center text-sm text-zinc-500">
                  {staffStep === "login" ? "First time using MealSync? " : "Already activated? "}
                  <button
                    type="button"
                    className="font-medium text-brand-600 hover:text-brand-700"
                    onClick={() => goTo(staffStep === "login" ? "activate" : "login")}
                  >
                    {staffStep === "login" ? "Activate your account" : "Sign in"}
                  </button>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>

      <p className="pb-6 text-center text-xs text-zinc-400">
        © {new Date().getFullYear()} Skystone Finance
      </p>
    </div>
  );
}
