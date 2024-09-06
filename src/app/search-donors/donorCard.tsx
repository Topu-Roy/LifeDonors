import { Card } from "@/components/ui/card";
import { UserRound } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Props = {
  donor: {
    user: string;
    blood_group: string;
    district: string;
    date_of_donation: string | null;
    gender: string;
    is_available: boolean;
    mobile_number: string | null;
    email: string | null;
  };
};

export default function DonorCard({ donor }: Props) {
  return (
    <Card className="flex flex-col items-center space-y-4 rounded-lg border border-gray-200 bg-white p-6 shadow-md">
      <div className="flex size-16 items-center justify-center rounded-full bg-rose-100">
        <UserRound size={40} className="text-destructive/80" />
      </div>
      <div className="w-full divide-y divide-black/10">
        <InfoRow label="Name" value={donor.user} />
        <InfoRow label="Blood Group" value={donor.blood_group} />
        <InfoRow label="District" value={donor.district ?? "N/A"} />
        <InfoRow
          label="Gender"
          value={donor.gender === "" ? "N/A" : donor.gender}
        />
        <InfoRow label="Availability" value={donor.district ? "Yes" : "No"} />

        <Tooltip>
          <TooltipTrigger className="w-full">
            <div className="flex items-start justify-between py-2">
              <p className="font-medium text-gray-700">Email</p>
              <div className="max-w-[60%] overflow-hidden">
                <p className="truncate font-semibold text-gray-600">
                  {donor.email ?? "N/A"}
                </p>
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent className="duration-100">
            {donor.email ?? "N/A"}
          </TooltipContent>
        </Tooltip>

        <InfoRow label="Mobile" value={donor.mobile_number ?? "N/A"} />
      </div>
    </Card>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between py-2">
      <p className="font-medium text-gray-600">{label}</p>
      <p className="text-right font-semibold text-gray-600">{value}</p>
    </div>
  );
}
