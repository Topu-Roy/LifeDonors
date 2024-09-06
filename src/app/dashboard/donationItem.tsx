import { cn } from "@/lib/utils";
import { CircleCheck } from "lucide-react";
import DonorDetailsPopup from "./donorDetails";

type Props = {
  item: {
    blood_group: string;
    blood_request_type: string;
    date_of_donation: string;
    details: string;
    district: string;
    donor: string;
    gender: "Male" | "Female";
    approve_donor_id: string;
  };
};

export default function DonationItem({ item }: Props) {
  return (
    <div className="py-2">
      <div className="flex items-center justify-between">
        <p className="w-full min-w-32 flex-1">{item.date_of_donation}</p>
        <p className="w-full min-w-32 flex-1 text-center">{item.blood_group}</p>
        <p className="w-full min-w-32 flex-1 text-center">{item.gender}</p>
        <p className="w-full min-w-32 flex-1 text-center">{item.district}</p>
        <div className="flex w-full min-w-32 flex-1 items-center justify-center">
          <DonorDetailsPopup
            status={item.blood_request_type}
            donor_id={parseInt(item.approve_donor_id)}
          />
        </div>
        <div
          className={cn(
            "flex w-full min-w-32 flex-1 items-center justify-center gap-2",
            item.blood_request_type === "Completed" ? "text-green-500" : "",
          )}
        >
          <p>{item.blood_request_type}</p>
          {item.blood_request_type === "Completed" ? <CircleCheck /> : null}
        </div>
      </div>
    </div>
  );
}
