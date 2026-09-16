import {
  Download,
//   Mail,
  User,
  Building2,
  Hash,
} from "lucide-react";

import { useAuth } from "../../hooks/useAuth";

export default function MyProfile() {
  const { user } = useAuth();

  const staff =
    user &&
    "firstName" in user &&
    "lastName" in user &&
    "staffNumber" in user &&
    "department" in user
      ? user
      : null;

  if (!staff) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-slate-500">
          Staff profile unavailable.
        </p>
      </div>
    );
  }

  const fullName = `${staff.firstName} ${staff.lastName}`;

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">

      {/* HEADER */}

      <div>
        <p className="text-sm font-medium text-slate-500">
          Account
        </p>

        <h1 className="mt-1 text-2xl font-bold text-slate-900">
          My Profile
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          View your staff information and QR code.
        </p>
      </div>


      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

        {/* PROFILE CARD */}

        <div className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex items-center gap-4 border-b border-slate-100 pb-6">

            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#FDEBEC] text-[#B10F16]">
              <User size={28} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {fullName}
              </h2>

              <p className="text-sm text-slate-500">
                {staff.department}
              </p>
            </div>

          </div>


          <div className="mt-6 space-y-5">

            <ProfileRow
              icon={<User size={18} />}
              label="Full Name"
              value={fullName}
            />

            <ProfileRow
              icon={<Hash size={18} />}
              label="Staff Number"
              value={staff.staffNumber}
            />

            <ProfileRow
              icon={<Building2 size={18} />}
              label="Department"
              value={staff.department}
            />

          </div>

        </div>


        {/* QR CODE */}

        <div className="rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm">

          <h2 className="text-lg font-bold text-slate-900">
            My QR Code
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Use this QR code for meal attendance.
          </p>


          <div className="mx-auto mt-6 flex h-52 w-52 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50">

            <p className="text-sm text-slate-400">
              QR Code
            </p>

          </div>


          <button
            type="button"
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#B10F16] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#920C12]"
          >
            <Download size={18} />

            Download QR Code
          </button>

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
    <div className="flex items-center gap-4">

      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-500">
        {icon}
      </div>

      <div>
        <p className="text-xs font-medium text-slate-400">
          {label}
        </p>

        <p className="mt-0.5 text-sm font-semibold text-slate-800">
          {value}
        </p>
      </div>

    </div>
  );
}