import {
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  Eye,
  EyeOff,
  Loader2,
  ShieldCheck,
  Users,
} from "lucide-react";

import {
  useAuth,
} from "../../hooks/useAuth";

import {
  authService,
} from "../../services/auth.service";


type LoginMode =
  | "staff"
  | "admin";


type StaffStep =
  | "details"
  | "otp";


export default function Login() {


  const navigate =
    useNavigate();


  const {
    login,
    staffLogin,
  } = useAuth();


  // ===================================
  // LOGIN MODE
  // ===================================

  const [
    mode,
    setMode,
  ] = useState<LoginMode>(
    "staff"
  );


  // ===================================
  // STAFF STEP
  // ===================================

  const [
    staffStep,
    setStaffStep,
  ] = useState<StaffStep>(
    "details"
  );


  // ===================================
  // ADMIN STATE
  // ===================================

  const [
    email,
    setEmail,
  ] = useState("");


  const [
    password,
    setPassword,
  ] = useState("");


  const [
    showPassword,
    setShowPassword,
  ] = useState(false);


  // ===================================
  // STAFF STATE
  // ===================================

  const [
    staffNumber,
    setStaffNumber,
  ] = useState("");


  const [
    phoneNumber,
    setPhoneNumber,
  ] = useState("");


  const [
    code,
    setCode,
  ] = useState("");


  // ===================================
  // GENERAL STATE
  // ===================================

  const [
    loading,
    setLoading,
  ] = useState(false);


  const [
    error,
    setError,
  ] = useState("");


  const [
    message,
    setMessage,
  ] = useState("");


  // ===================================
  // CHANGE MODE
  // ===================================

  function changeMode(
    newMode: LoginMode
  ) {

    setMode(newMode);

    setError("");

    setMessage("");

    setStaffStep("details");

  }


  // ===================================
  // ADMIN LOGIN
  // ===================================

  async function handleAdminLogin(
    e: React.FormEvent
  ) {

    e.preventDefault();

    setError("");

    setLoading(true);


    try {

      await login({

        email,

        password,

      });


      navigate("/");

    } catch {

      setError(
        "Invalid email or password"
      );

    } finally {

      setLoading(false);

    }

  }


  // ===================================
  // STAFF REQUEST OTP
  // ===================================

  async function handleRequestOtp(
    e: React.FormEvent
  ) {

    e.preventDefault();

    setError("");

    setMessage("");

    setLoading(true);


    try {

      const result =
        await authService.activateStaff({

          staffNumber:
            staffNumber.trim(),

          phoneNumber:
            phoneNumber.trim(),

        });


      setMessage(
        result.message ||
        "OTP sent successfully."
      );


      setStaffStep("otp");


    } catch (error: any) {

      setError(

        error?.response?.data?.message ||

        "Unable to generate OTP. Please check your details."

      );

    } finally {

      setLoading(false);

    }

  }


  // ===================================
  // STAFF VERIFY OTP
  // ===================================

  async function handleVerifyOtp(
    e: React.FormEvent
  ) {

    e.preventDefault();

    setError("");

    setLoading(true);


    try {

      const result =
        await authService.verifyStaffOtp({

          staffNumber:
            staffNumber.trim(),

          phoneNumber:
            phoneNumber.trim(),

          code:
            code.trim(),

        });


      staffLogin(
        result.user,
        result.token
      );


      navigate("/");


    } catch (error: any) {

      setError(

        error?.response?.data?.message ||

        "Invalid or expired OTP."

      );

    } finally {

      setLoading(false);

    }

  }


  return (

    <div
      className="
        min-h-screen
        flex
        items-center
        justify-center
        bg-gray-100
        px-4
      "
    >


      <div
        className="
          w-full
          max-w-[420px]
          rounded-3xl
          bg-white
          p-8
          shadow-xl
        "
      >


        {/* ===========================
            LOGO
        ============================ */}

        <div className="mb-8 text-center">

          <h1
            className="
              text-3xl
              font-bold
              text-[#B10F16]
            "
          >

            MealSync

          </h1>


          <p className="mt-2 text-gray-500">

            Login to continue

          </p>

        </div>


        {/* ===========================
            TOGGLE
        ============================ */}

        <div
          className="
            mb-7
            grid
            grid-cols-2
            rounded-xl
            bg-gray-100
            p-1
          "
        >


          {/* STAFF */}

          <button
            type="button"
            onClick={() =>
              changeMode("staff")
            }
            className={`
              flex
              items-center
              justify-center
              gap-2
              rounded-lg
              py-3
              text-sm
              font-semibold
              transition

              ${
                mode === "staff"

                  ? "bg-white text-[#B10F16] shadow-sm"

                  : "text-gray-500"

              }
            `}
          >

            <Users size={17} />

            Staff

          </button>


          {/* ADMIN */}

          <button
            type="button"
            onClick={() =>
              changeMode("admin")
            }
            className={`
              flex
              items-center
              justify-center
              gap-2
              rounded-lg
              py-3
              text-sm
              font-semibold
              transition

              ${
                mode === "admin"

                  ? "bg-white text-[#B10F16] shadow-sm"

                  : "text-gray-500"

              }
            `}
          >

            <ShieldCheck size={17} />

            Admin

          </button>


        </div>


        {/* ===========================
            ERROR
        ============================ */}

        {error && (

          <div
            className="
              mb-5
              rounded-xl
              bg-red-50
              px-4
              py-3
              text-sm
              text-red-600
            "
          >

            {error}

          </div>

        )}


        {/* ===========================
            SUCCESS MESSAGE
        ============================ */}

        {message && (

          <div
            className="
              mb-5
              rounded-xl
              bg-green-50
              px-4
              py-3
              text-sm
              text-green-700
            "
          >

            {message}

          </div>

        )}


        {/* ===========================
            ADMIN LOGIN
        ============================ */}

        {mode === "admin" && (

          <form
            onSubmit={
              handleAdminLogin
            }
            className="space-y-5"
          >


            <div>

              <label
                className="
                  mb-2
                  block
                  text-sm
                  font-medium
                  text-gray-700
                "
              >

                Email Address

              </label>


              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
                className="
                  w-full
                  rounded-xl
                  border
                  border-gray-300
                  px-4
                  py-3
                  outline-none
                  transition
                  focus:border-[#B10F16]
                "
              />

            </div>


            <div>

              <label
                className="
                  mb-2
                  block
                  text-sm
                  font-medium
                  text-gray-700
                "
              >

                Password

              </label>


              <div className="relative">

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  required
                  className="
                    w-full
                    rounded-xl
                    border
                    border-gray-300
                    px-4
                    py-3
                    pr-12
                    outline-none
                    transition
                    focus:border-[#B10F16]
                  "
                />


                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  className="
                    absolute
                    right-4
                    top-1/2
                    -translate-y-1/2
                    text-gray-400
                  "
                >

                  {showPassword

                    ? <EyeOff size={19} />

                    : <Eye size={19} />

                  }

                </button>

              </div>

            </div>


            <button
              disabled={loading}
              className="
                flex
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-[#B10F16]
                py-3
                font-semibold
                text-white
                transition
                hover:bg-[#8D0B11]
                disabled:opacity-60
              "
            >

              {loading && (

                <Loader2
                  size={18}
                  className="animate-spin"
                />

              )}

              {loading
                ? "Logging in..."
                : "Login"
              }

            </button>

          </form>

        )}


        {/* ===========================
            STAFF DETAILS
        ============================ */}

        {mode === "staff" &&
          staffStep === "details" && (

          <form
            onSubmit={
              handleRequestOtp
            }
            className="space-y-5"
          >


            <div>

              <label
                className="
                  mb-2
                  block
                  text-sm
                  font-medium
                  text-gray-700
                "
              >

                Staff Number

              </label>


              <input
                type="text"
                placeholder="e.g. STF001"
                value={staffNumber}
                onChange={(e) =>
                  setStaffNumber(
                    e.target.value
                  )
                }
                required
                className="
                  w-full
                  rounded-xl
                  border
                  border-gray-300
                  px-4
                  py-3
                  uppercase
                  outline-none
                  focus:border-[#B10F16]
                "
              />

            </div>


            <div>

              <label
                className="
                  mb-2
                  block
                  text-sm
                  font-medium
                  text-gray-700
                "
              >

                Phone Number

              </label>


              <input
                type="tel"
                placeholder="08012345678"
                value={phoneNumber}
                onChange={(e) =>
                  setPhoneNumber(
                    e.target.value
                  )
                }
                required
                className="
                  w-full
                  rounded-xl
                  border
                  border-gray-300
                  px-4
                  py-3
                  outline-none
                  focus:border-[#B10F16]
                "
              />

            </div>


            <button
              disabled={loading}
              className="
                flex
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-[#B10F16]
                py-3
                font-semibold
                text-white
                hover:bg-[#8D0B11]
                disabled:opacity-60
              "
            >

              {loading && (

                <Loader2
                  size={18}
                  className="animate-spin"
                />

              )}

              {loading
                ? "Generating OTP..."
                : "Continue"
              }

            </button>

          </form>

        )}


        {/* ===========================
            OTP
        ============================ */}

        {mode === "staff" &&
          staffStep === "otp" && (

          <form
            onSubmit={
              handleVerifyOtp
            }
            className="space-y-5"
          >


            <div className="text-center">

              <h2 className="text-xl font-bold">

                Verify OTP

              </h2>


              <p
                className="
                  mt-2
                  text-sm
                  text-gray-500
                "
              >

                Enter the 6-digit code sent to

                <br />

                <span className="font-semibold">

                  {phoneNumber}

                </span>

              </p>

            </div>


            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="000000"
              value={code}
              onChange={(e) =>
                setCode(

                  e.target.value
                    .replace(/\D/g, "")
                    .slice(0, 6)

                )
              }
              required
              className="
                w-full
                rounded-xl
                border
                border-gray-300
                px-4
                py-4
                text-center
                text-2xl
                font-bold
                tracking-[0.5em]
                outline-none
                focus:border-[#B10F16]
              "
            />


            <button
              disabled={
                loading ||
                code.length !== 6
              }
              className="
                flex
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-[#B10F16]
                py-3
                font-semibold
                text-white
                hover:bg-[#8D0B11]
                disabled:opacity-60
              "
            >

              {loading && (

                <Loader2
                  size={18}
                  className="animate-spin"
                />

              )}

              {loading
                ? "Verifying..."
                : "Verify & Login"
              }

            </button>


            <button
              type="button"
              onClick={() => {

                setStaffStep("details");

                setCode("");

                setMessage("");

              }}
              className="
                w-full
                text-sm
                font-medium
                text-gray-500
                hover:text-[#B10F16]
              "
            >

              ← Change details

            </button>

          </form>

        )}


      </div>

    </div>

  );

}