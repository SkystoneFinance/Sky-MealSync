import { useState } from "react";
import { Eye, EyeOff, LockKeyhole, UserRound } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import { authService } from "../../services/auth.service";
import { useAuth } from "../../hooks/useAuth";

export default function Login() {
  const navigate = useNavigate();

  const { login, staffLogin } = useAuth();

  const [loginType, setLoginType] = useState<
    "admin" | "staff"
  >("staff");

  const [staffStep, setStaffStep] = useState<
    "activate" | "otp"
  >("activate");

  const [staffNumber, setStaffNumber] =
    useState("");

  const [phoneNumber, setPhoneNumber] =
    useState("");

  const [otp, setOtp] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
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
          "Unable to login."
      );

    } finally {
      setLoading(false);
    }
  }


  // ==========================================
  // STAFF — REQUEST OTP
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

    if (!phoneNumber.trim()) {
      toast.error(
        "Please enter your phone number."
      );

      return;
    }

    try {
      setLoading(true);

      await authService.activateStaff({
        staffNumber:
          staffNumber.trim(),

        phoneNumber:
          phoneNumber.trim(),
      });

      toast.success(
        "OTP generated successfully."
      );

      setStaffStep("otp");

    } catch (error: any) {

      toast.error(
        error.response?.data?.message ??
          "Unable to activate staff account."
      );

    } finally {
      setLoading(false);
    }
  }


  // ==========================================
  // STAFF — VERIFY OTP
  // ==========================================

  async function handleVerifyOtp(
    event: React.FormEvent
  ) {
    event.preventDefault();

    if (!otp.trim()) {
      toast.error(
        "Please enter the OTP."
      );

      return;
    }

    if (!/^\d{6}$/.test(otp.trim())) {
      toast.error(
        "OTP must be 6 digits."
      );

      return;
    }

    try {
      setLoading(true);

      const result =
        await authService.verifyStaffOtp({
          staffNumber:
            staffNumber.trim(),

          phoneNumber:
            phoneNumber.trim(),

          code:
            otp.trim(),
        });


      // ======================================
      // SAVE STAFF JWT + USER
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
          "Invalid or expired OTP."
      );

    } finally {
      setLoading(false);
    }
  }


  // ==========================================
  // BACK TO STAFF ACTIVATION
  // ==========================================

  function handleBackToActivation() {
    setOtp("");

    setStaffStep(
      "activate"
    );
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
                  setStaffStep("activate");
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
                STAFF LOGIN
            ================================== */}

            {loginType === "staff" && (

              <>
                {staffStep === "activate" ? (

                  <form
                    onSubmit={
                      handleStaffActivate
                    }
                    className="space-y-5"
                  >

                    <div>

                      <h2 className="text-xl font-bold text-slate-900">
                        Staff Login
                      </h2>

                      <p className="mt-1 text-sm text-slate-500">
                        Enter your staff number and registered phone number.
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


                    {/* PHONE */}

                    <div>

                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Phone Number
                      </label>

                      <div className="relative">

                        <UserRound
                          size={18}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                          type="tel"
                          value={phoneNumber}
                          onChange={(event) =>
                            setPhoneNumber(
                              event.target.value
                            )
                          }
                          placeholder="08012345678"
                          className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 outline-none transition focus:border-[#B10F16] focus:ring-2 focus:ring-[#B10F16]/10"
                        />

                      </div>

                    </div>


                    <button
                      type="submit"
                      disabled={loading}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#B10F16] py-3.5 font-semibold text-white transition hover:bg-[#900d12] disabled:cursor-not-allowed disabled:opacity-60"
                    >

                      {loading
                        ? "Sending OTP..."
                        : "Continue"}

                    </button>

                  </form>

                ) : (

                  /* ==================================
                     OTP
                  ================================== */

                  <form
                    onSubmit={
                      handleVerifyOtp
                    }
                    className="space-y-5"
                  >

                    <div>

                      <h2 className="text-xl font-bold text-slate-900">
                        Verify OTP
                      </h2>

                      <p className="mt-1 text-sm text-slate-500">
                        Enter the 6-digit OTP generated for your account.
                      </p>

                    </div>


                    <div>

                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        OTP Code
                      </label>

                      <div className="relative">

                        <LockKeyhole
                          size={18}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                          type="text"
                          inputMode="numeric"
                          maxLength={6}
                          value={otp}
                          onChange={(event) =>
                            setOtp(
                              event.target.value.replace(
                                /\D/g,
                                ""
                              )
                            )
                          }
                          placeholder="000000"
                          className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-center text-lg font-semibold tracking-[0.35em] outline-none transition focus:border-[#B10F16] focus:ring-2 focus:ring-[#B10F16]/10"
                        />

                      </div>

                    </div>


                    <button
                      type="submit"
                      disabled={
                        loading ||
                        otp.length !== 6
                      }
                      className="flex w-full items-center justify-center rounded-xl bg-[#B10F16] py-3.5 font-semibold text-white transition hover:bg-[#900d12] disabled:cursor-not-allowed disabled:opacity-60"
                    >

                      {loading
                        ? "Verifying..."
                        : "Verify OTP"}

                    </button>


                    <button
                      type="button"
                      onClick={
                        handleBackToActivation
                      }
                      disabled={loading}
                      className="w-full text-sm font-medium text-slate-500 transition hover:text-[#B10F16]"
                    >
                      ← Change staff details
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