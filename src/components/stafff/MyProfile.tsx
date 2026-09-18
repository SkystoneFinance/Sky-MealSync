import {
  Download,
  User,
  Building2,
  Hash,
  Phone,
  ShieldCheck,
  Loader2,
} from "lucide-react";

import { useAuth } from "../../hooks/useAuth";
import { useStaffProfile } from "../../hooks/useStaffProfile";

export default function MyProfile() {
  const { user } = useAuth();

  const {
    data: profile,
    isLoading,
    isError,
  } = useStaffProfile();

  // =================================
  // MAKE SURE THIS IS A STAFF ACCOUNT
  // =================================

  if (!user || user.role !== "USER") {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-slate-500">
          Staff profile unavailable.
        </p>
      </div>
    );
  }


  // =================================
  // LOADING
  // =================================

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">

        <div className="flex items-center gap-2 text-sm text-slate-500">

          <Loader2
            size={18}
            className="animate-spin"
          />

          Loading profile...

        </div>

      </div>
    );
  }


  // =================================
  // ERROR
  // =================================

  if (isError || !profile) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">

        <div className="text-center">

          <p className="text-sm font-medium text-slate-700">
            Unable to load your profile.
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Please try again later.
          </p>

        </div>

      </div>
    );
  }


  const fullName =
    `${profile.firstName} ${profile.lastName}`;


  // =================================
  // DOWNLOAD QR
  // =================================



  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">

      {/* PAGE HEADER */}

      <div>

        <p className="text-sm font-medium text-slate-500">
          Account
        </p>

        <h1 className="mt-1 text-2xl font-bold text-slate-900">
          My Profile
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          View and manage your MealSync staff information.
        </p>

      </div>


      {/* PROFILE HERO */}

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

        <div className="bg-gradient-to-r from-[#B10F16] to-[#920C12] px-6 py-7 sm:px-8">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-4">

              {/* AVATAR */}

              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-4 border-white/20 bg-white text-[#B10F16] shadow-sm">

                <User size={30} />

              </div>


              {/* NAME */}

              <div>

                <h2 className="text-xl font-bold text-white sm:text-2xl">
                  {fullName}
                </h2>

                <p className="mt-1 text-sm text-white/80">
                  {profile.department} Department
                </p>

              </div>

            </div>


            {/* STATUS */}

            <div className="flex w-fit items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">

              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  profile.isActive
                    ? "bg-green-400"
                    : "bg-red-300"
                }`}
              />

              {profile.isActive
                ? "Active"
                : "Inactive"}

            </div>

          </div>

        </div>


        {/* STAFF NUMBER */}

        <div className="flex flex-col gap-2 border-t border-slate-100 px-6 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">

          <div className="flex items-center gap-2 text-sm text-slate-500">

            <ShieldCheck
              size={16}
              className="text-[#B10F16]"
            />

            MealSync Staff Account

          </div>

          <p className="text-sm font-semibold text-slate-800">
            {profile.staffNumber}
          </p>

        </div>

      </div>


      {/* MAIN CONTENT */}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

        {/* STAFF INFORMATION */}

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">

          <div className="border-b border-slate-100 pb-5">

            <h2 className="text-lg font-bold text-slate-900">
              Staff Information
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Your official information registered on MealSync.
            </p>

          </div>


          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">

            <ProfileRow
              icon={<User size={18} />}
              label="Full Name"
              value={fullName}
            />

            <ProfileRow
              icon={<Hash size={18} />}
              label="Staff Number"
              value={profile.staffNumber}
            />

            <ProfileRow
              icon={<Building2 size={18} />}
              label="Department"
              value={profile.department}
            />

            <ProfileRow
              icon={<Phone size={18} />}
              label="Phone Number"
              value={
                profile.phoneNumber ||
                "Not provided"
              }
            />

          </div>

        </div>


        {/* QR CODE */}

        <div className="rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm">

          <div>

            <h2 className="text-lg font-bold text-slate-900">
              My QR Code
            </h2>

            <p className="mt-1 text-sm leading-5 text-slate-500">
              Use your personal QR code for meal attendance.
            </p>

          </div>


          {/* QR IMAGE */}

          <div className="mx-auto mt-6 flex h-52 w-52 items-center justify-center rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">

            {profile.qrImage ? (

              <img
                src={profile.qrImage}
                alt={`${fullName} MealSync QR Code`}
                className="h-full w-full object-contain"
              />

            ) : (

              <div className="flex flex-col items-center gap-2 text-slate-400">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">

                  <Hash size={24} />

                </div>

                <p className="text-sm">
                  QR code unavailable
                </p>

              </div>

            )}

          </div>


          {/* STAFF NUMBER */}

          <p className="mt-4 text-sm font-semibold text-slate-700">
            {profile.staffNumber}
          </p>


          {/* DOWNLOAD */}

          <a
            href={profile.qrImage}
            download={`${profile.staffNumber}-QR.png`}
            target="_blank"
            rel="noreferrer"
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#B10F16] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#920C12]"
          >
            <Download size={18} />
            Download QR Code
          </a>


          <p className="mt-3 text-xs leading-5 text-slate-400">
            Keep your QR code accessible when checking in for meals.
          </p>

        </div>

      </div>

    </div>
  );
}


function ProfileRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">

      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-slate-500 shadow-sm">

        {icon}

      </div>

      <div className="min-w-0">

        <p className="text-xs font-medium text-slate-400">
          {label}
        </p>

        <p className="mt-1 break-words text-sm font-semibold text-slate-800">
          {value}
        </p>

      </div>

    </div>
  );
}