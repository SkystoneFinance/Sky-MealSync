import { Download } from "lucide-react";

import { useStaffProfile } from "../../hooks/useStaffProfile";

import {
  Badge,
  Button,
  Callout,
  Card,
  PageHeader,
  PageLoader,
} from "../ui";

export default function MyProfile() {
  const { data: profile, isLoading, isError } = useStaffProfile();

  if (isLoading) {
    return <PageLoader />;
  }

  if (isError || !profile) {
    return (
      <Callout tone="danger" title="We couldn't load your profile">
        Check your connection and try again.
      </Callout>
    );
  }

  const download = () => {
    const link = document.createElement("a");
    link.href = profile.qrImage;
    link.download = `${profile.staffNumber}-QR.png`;
    link.click();
  };

  const details = [
    { label: "Staff number", value: profile.staffNumber },
    { label: "Department", value: profile.department },
    { label: "Phone", value: profile.phoneNumber || "Not provided" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="My QR code"
        description="Show this at the counter to collect your meal. Save it to your phone's photos or print it."
      />

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="flex flex-col items-center p-6 sm:p-8 lg:col-span-3">
          <div className="rounded-2xl border border-zinc-200 bg-white p-4">
            <img
              src={profile.qrImage}
              alt={`QR code for ${profile.firstName} ${profile.lastName}`}
              className="h-56 w-56 sm:h-64 sm:w-64"
              style={{ imageRendering: "pixelated" }}
            />
          </div>
          <p className="mt-4 text-lg font-semibold text-zinc-900">
            {profile.firstName} {profile.lastName}
          </p>
          <p className="text-sm text-zinc-500">{profile.staffNumber}</p>
          <Button
            variant="secondary"
            className="mt-5"
            icon={<Download size={16} />}
            onClick={download}
          >
            Save QR code
          </Button>
        </Card>

        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4">
            <h2 className="font-semibold text-zinc-900">Details</h2>
            {profile.isActive ? (
              <Badge tone="success">Active</Badge>
            ) : (
              <Badge tone="danger">Inactive</Badge>
            )}
          </div>
          <dl className="divide-y divide-zinc-100">
            {details.map((item) => (
              <div key={item.label} className="flex justify-between gap-4 px-5 py-3.5 text-sm">
                <dt className="text-zinc-500">{item.label}</dt>
                <dd className="text-right font-medium text-zinc-900">{item.value}</dd>
              </div>
            ))}
          </dl>
          <p className="px-5 pb-5 text-xs text-zinc-500">
            Details wrong? Ask an administrator to update them.
          </p>
        </Card>
      </div>
    </div>
  );
}
