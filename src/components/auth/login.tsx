import { useState } from "react";
import { Eye, EyeOff, LockKeyhole, UserRound } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import { authService } from "../../services/auth.service";
import { useAuth } from "../../hooks/useAuth";

export default function Login() {
  const navigate = useNavigate();

  const { login, staffLogin } = useAuth();

  const [loginType, setLoginType] =
    useState<"admin" | "staff">("staff");

  const [staffStep, setStaffStep] =
    useState<"activate" | "login">("login");

  const [staffNumber, setStaffNumber] =
    useState("");

  const [pin, setPin] =
    useState("");

  const [confirmPin, setConfirmPin] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showPin, setShowPin] =
    useState(false);

  const [showConfirmPin, setShowConfirmPin] =
    useState(false);

  const [loading, setLoading] =
    useState(false);


  // ==========================================
  // ADMIN LOGIN
  // ==========================================

  async function handleAdminLogin(
    event: React.FormEvent
  ) {
    event.preventDefault();

    if (!email.trim() || !password) {
      toast.error(
        "Please enter your email and password."
      );

      return;
    }

    try {
      setLoading(true);

      await login({
        email: email.trim(),
        password,
      });

      toast.success(
        "Login successful."
      );

      navigate("/dashboard");

    } catch (error: any) {
      toast.error(
        error.response?.data?.message ??
          "We couldn’t log you in. Please check your email and password and try again."
      );

    } finally {
      setLoading(false);
    }
  }


  // ==========================================
  // STAFF FIRST-TIME ACTIVATION
  // ==========================================

  async function handleStaffActivate(
    event: React.FormEvent
  ) {
    event.preventDefault();

    if (!staffNumber.trim()) {
      toast.error(
        "Please enter your staff number."
      );

      return;
    }

    if (!/^\d{4}$/.test(pin)) {
      toast.error(
        "PIN must be exactly 4 digits."
      );

      return;
    }

    if (pin !== confirmPin) {
      toast.error(
        "PINs do not match."
      );

      return;
    }

    try {
      setLoading(true);

      const result =
        await authService.activateStaff({
          staffNumber:
            staffNumber.trim(),

          pin,

          confirmPin,
        });

      toast.success(
        result.message ??
          "Account activated successfully."
      );

      // After activation, move directly
      // to the normal Staff ID + PIN login.

      setPin("");
      setConfirmPin("");

      setStaffStep("login");

    } catch (error: any) {
      toast.error(
        error.response?.data?.message ??
          "We couldn’t set up your account. Please check your Staff ID and PIN and try again."
      );

    } finally {
      setLoading(false);
    }
  }


  // ==========================================
  // STAFF LOGIN
  // ==========================================

  async function handleStaffLogin(
    event: React.FormEvent
  ) {
    event.preventDefault();

    if (!staffNumber.trim()) {
      toast.error(
        "Please enter your staff number."
      );

      return;
    }

    if (!/^\d{4}$/.test(pin)) {
      toast.error(
        "PIN must be exactly 4 digits."
      );

      return;
    }

    try {
      setLoading(true);

      const result =
        await authService.staffLogin({
          staffNumber:
            staffNumber.trim(),

          pin,
        });


      // ======================================
      // SAVE STAFF AUTH
      // ======================================

      staffLogin(
        result.user,
        result.token
      );


      toast.success(
        "Login successful."
      );


      // ======================================
      // STAFF DASHBOARD
      // ======================================

      navigate("/staff/dashboard");

    } catch (error: any) {

      toast.error(
        error.response?.data?.message ??
          "Incorrect Staff ID or PIN. Please check and try again."
      );

    } finally {
      setLoading(false);
    }
  }


  // ==========================================
  // RESET STAFF FORM
  // ==========================================

  function resetStaffForm() {
    setStaffNumber("");
    setPin("");
    setConfirmPin("");
  }


  return (
    <div className="min-h-screen bg-slate-50">

      <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 py-10">

        <div className="w-full max-w-md">

          {/* ==================================
              HEADER
          ================================== */}

          <div className="mb-8 text-center">

            <h1 className="text-3xl font-bold text-slate-900">
              MealSync
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Meal attendance and management system
            </p>

          </div>


          {/* ==================================
              LOGIN CARD
          ================================== */}

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">


            {/* ==================================
                LOGIN TYPE
            ================================== */}

            <div className="mb-7 grid grid-cols-2 rounded-xl bg-slate-100 p-1">

              <button
                type="button"
                onClick={() => {
                  setLoginType("staff");
                  resetStaffForm();
                  setStaffStep("login");
                }}
                className={`rounded-lg py-2.5 text-sm font-semibold transition ${
                  loginType === "staff"
                    ? "bg-white text-[#B10F16] shadow-sm"
                    : "text-slate-500"
                }`}
              >
                Staff
              </button>


              <button
                type="button"
                onClick={() => {
                  setLoginType("admin");
                }}
                className={`rounded-lg py-2.5 text-sm font-semibold transition ${
                  loginType === "admin"
                    ? "bg-white text-[#B10F16] shadow-sm"
                    : "text-slate-500"
                }`}
              >
                Admin
              </button>

            </div>


            {/* ==================================
                STAFF
            ================================== */}

            {loginType === "staff" && (

              <>
                {staffStep === "login" ? (

                  <form
                    onSubmit={
                      handleStaffLogin
                    }
                    className="space-y-5"
                  >

                    <div>

                      <h2 className="text-xl font-bold text-slate-900">
                        Staff Login
                      </h2>

                      <p className="mt-1 text-sm text-slate-500">
                        Sign in with your staff number and PIN.
                      </p>

                    </div>


                    {/* STAFF NUMBER */}

                    <div>

                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Staff Number
                      </label>

                      <div className="relative">

                        <UserRound
                          size={18}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                          type="text"
                          value={staffNumber}
                          onChange={(event) =>
                            setStaffNumber(
                              event.target.value
                            )
                          }
                          placeholder="e.g. ST001"
                          autoComplete="username"
                          className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 outline-none transition focus:border-[#B10F16] focus:ring-2 focus:ring-[#B10F16]/10"
                        />

                      </div>

                    </div>


                    {/* PIN */}

                    <div>

                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        PIN
                      </label>

                      <div className="relative">

                        <LockKeyhole
                          size={18}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                          type={
                            showPin
                              ? "text"
                              : "password"
                          }
                          inputMode="numeric"
                          maxLength={4}
                          value={pin}
                          onChange={(event) =>
                            setPin(
                              event.target.value.replace(
                                /\D/g,
                                ""
                              )
                            )
                          }
                          placeholder="••••"
                          autoComplete="current-password"
                          className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-11 text-center text-lg font-semibold tracking-[0.35em] outline-none transition focus:border-[#B10F16] focus:ring-2 focus:ring-[#B10F16]/10"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setShowPin(
                              (current) =>
                                !current
                            )
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showPin ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>

                      </div>

                    </div>


                    {/* LOGIN */}

                    <button
                      type="submit"
                      disabled={
                        loading ||
                        pin.length !== 4
                      }
                      className="flex w-full items-center justify-center rounded-xl bg-[#B10F16] py-3.5 font-semibold text-white transition hover:bg-[#900d12] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {loading
                        ? "Signing in..."
                        : "Login"}
                    </button>


                    {/* ACTIVATE */}

                    <button
                      type="button"
                      onClick={() => {
                        setPin("");
                        setConfirmPin("");
                        setStaffStep("activate");
                      }}
                      className="w-full text-sm font-medium text-slate-500 transition hover:text-[#B10F16]"
                    >
                      First time here? Activate your account
                    </button>

                  </form>

                ) : (

                  /* ==================================
                     FIRST-TIME ACTIVATION
                  ================================== */

                  <form
                    onSubmit={
                      handleStaffActivate
                    }
                    className="space-y-5"
                  >

                    <div>

                      <h2 className="text-xl font-bold text-slate-900">
                        Activate Staff Account
                      </h2>

                      <p className="mt-1 text-sm text-slate-500">
                        Create a 4-digit PIN for your MealSync account.
                      </p>

                    </div>


                    {/* STAFF NUMBER */}

                    <div>

                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Staff Number
                      </label>

                      <div className="relative">

                        <UserRound
                          size={18}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                          type="text"
                          value={staffNumber}
                          onChange={(event) =>
                            setStaffNumber(
                              event.target.value
                            )
                          }
                          placeholder="e.g. ST001"
                          className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 outline-none transition focus:border-[#B10F16] focus:ring-2 focus:ring-[#B10F16]/10"
                        />

                      </div>

                    </div>


                    {/* CREATE PIN */}

                    <div>

                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Create PIN
                      </label>

                      <div className="relative">

                        <LockKeyhole
                          size={18}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                          type={
                            showPin
                              ? "text"
                              : "password"
                          }
                          inputMode="numeric"
                          maxLength={4}
                          value={pin}
                          onChange={(event) =>
                            setPin(
                              event.target.value.replace(
                                /\D/g,
                                ""
                              )
                            )
                          }
                          placeholder="••••"
                          className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-11 text-center text-lg font-semibold tracking-[0.35em] outline-none transition focus:border-[#B10F16] focus:ring-2 focus:ring-[#B10F16]/10"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setShowPin(
                              (current) =>
                                !current
                            )
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                        >
                          {showPin ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>

                      </div>

                    </div>


                    {/* CONFIRM PIN */}

                    <div>

                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Confirm PIN
                      </label>

                      <div className="relative">

                        <LockKeyhole
                          size={18}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                          type={
                            showConfirmPin
                              ? "text"
                              : "password"
                          }
                          inputMode="numeric"
                          maxLength={4}
                          value={confirmPin}
                          onChange={(event) =>
                            setConfirmPin(
                              event.target.value.replace(
                                /\D/g,
                                ""
                              )
                            )
                          }
                          placeholder="••••"
                          className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-11 text-center text-lg font-semibold tracking-[0.35em] outline-none transition focus:border-[#B10F16] focus:ring-2 focus:ring-[#B10F16]/10"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPin(
                              (current) =>
                                !current
                            )
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                        >
                          {showConfirmPin ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>

                      </div>

                    </div>


                    {/* ACTIVATE */}

                    <button
                      type="submit"
                      disabled={
                        loading ||
                        pin.length !== 4 ||
                        confirmPin.length !== 4
                      }
                      className="flex w-full items-center justify-center rounded-xl bg-[#B10F16] py-3.5 font-semibold text-white transition hover:bg-[#900d12] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {loading
                        ? "Activating..."
                        : "Activate Account"}
                    </button>


                    {/* BACK */}

                    <button
                      type="button"
                      onClick={() => {
                        setPin("");
                        setConfirmPin("");
                        setStaffStep("login");
                      }}
                      disabled={loading}
                      className="w-full text-sm font-medium text-slate-500 transition hover:text-[#B10F16]"
                    >
                      ← Back to Staff Login
                    </button>

                  </form>

                )}

              </>

            )}


            {/* ==================================
                ADMIN LOGIN
            ================================== */}

            {loginType === "admin" && (

              <form
                onSubmit={
                  handleAdminLogin
                }
                className="space-y-5"
              >

                <div>

                  <h2 className="text-xl font-bold text-slate-900">
                    Admin Login
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Sign in with your administrator credentials.
                  </p>

                </div>


                {/* EMAIL */}

                <div>

                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Email
                  </label>

                  <input
                    type="email"
                    value={email}
                    onChange={(event) =>
                      setEmail(
                        event.target.value
                      )
                    }
                    placeholder="admin@example.com"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#B10F16] focus:ring-2 focus:ring-[#B10F16]/10"
                  />

                </div>


                {/* PASSWORD */}

                <div>

                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Password
                  </label>

                  <div className="relative">

                    <input
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      value={password}
                      onChange={(event) =>
                        setPassword(
                          event.target.value
                        )
                      }
                      placeholder="Enter password"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-11 outline-none transition focus:border-[#B10F16] focus:ring-2 focus:ring-[#B10F16]/10"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (current) =>
                            !current
                        )
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >

                      {showPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}

                    </button>

                  </div>

                </div>


                {/* ADMIN LOGIN */}

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center rounded-xl bg-[#B10F16] py-3.5 font-semibold text-white transition hover:bg-[#900d12] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading
                    ? "Signing in..."
                    : "Login"}
                </button>

              </form>

            )}

          </div>

        </div>

      </div>

    </div>
  );
}