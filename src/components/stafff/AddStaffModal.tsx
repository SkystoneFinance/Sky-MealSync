import { useState } from "react";
import { X, UserPlus } from "lucide-react";
import toast from "react-hot-toast";

import { useCreateStaff } from "../../hooks/useStaff";

interface Props {
  open: boolean;
  close: () => void;
}

export default function AddStaffModal({
  open,
  close,
}: Props) {
  const { mutate, isPending } = useCreateStaff();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    staffNumber: "",
    department: "",
  });

  if (!open) return null;

  function submit(e: React.FormEvent) {
    e.preventDefault();

    mutate(form, {
      onSuccess() {
        toast.success("Staff created successfully!");

        setForm({
          firstName: "",
          lastName: "",
          staffNumber: "",
          department: "",
        });

        close();
      },

      onError(error: any) {
        console.error(error);

        toast.error(
          error?.response?.data?.message ??
            "Unable to create staff."
        );
      },
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">

      <div className="w-full max-w-lg rounded-3xl bg-white shadow-2xl">

        {/* Header */}

        <div className="flex items-center justify-between border-b px-6 py-5">

          <div className="flex items-center gap-3">

            <div className="rounded-2xl bg-red-800/10 p-3">

              <UserPlus className="text-red-800" />

            </div>

            <div>

              <h2 className="text-2xl font-bold">

                Add New Staff

              </h2>

              <p className="text-sm text-gray-500">

                Register a new staff member.

              </p>

            </div>

          </div>

          <button
            onClick={close}
            className="rounded-xl p-2 transition hover:bg-gray-100"
          >
            <X />
          </button>

        </div>

        {/* Form */}

        <form
          onSubmit={submit}
          className="space-y-5 p-6"
        >

          <div>

            <label className="mb-2 block text-sm font-medium">

              First Name

            </label>

            <input
              value={form.firstName}
              onChange={(e) =>
                setForm({
                  ...form,
                  firstName: e.target.value,
                })
              }
              placeholder="John"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-red-800 focus:ring-2 focus:ring-red-800/20"
            />

          </div>

          <div>

            <label className="mb-2 block text-sm font-medium">

              Last Name

            </label>

            <input
              value={form.lastName}
              onChange={(e) =>
                setForm({
                  ...form,
                  lastName: e.target.value,
                })
              }
              placeholder="Doe"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#B10F16] focus:ring-2 focus:ring-[#B10F16]/20"
            />

          </div>

          <div>

            <label className="mb-2 block text-sm font-medium">

              Staff Number

            </label>

            <input
              value={form.staffNumber}
              onChange={(e) =>
                setForm({
                  ...form,
                  staffNumber: e.target.value,
                })
              }
              placeholder="MS001"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#B10F16] focus:ring-2 focus:ring-[#B10F16]/20"
            />

          </div>

          <div>

            <label className="mb-2 block text-sm font-medium">

              Department

            </label>

            <input
              value={form.department}
              onChange={(e) =>
                setForm({
                  ...form,
                  department: e.target.value,
                })
              }
              placeholder="Kitchen"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#B10F16] focus:ring-2 focus:ring-[#B10F16]/20"
            />

          </div>

          <button
            type="submit"
            disabled={isPending}
            className="mt-2 w-full active:scale-95 bg-red-800  rounded-xl py-3 text-lg font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
          >
            {isPending ? "Creating Staff..." : "Create Staff"}
          </button>

        </form>

      </div>

    </div>
  );
}