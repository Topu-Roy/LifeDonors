"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import useAcceptRequestMutation from "@/query/acceptRequest";
import { type RequestType } from "@/query/availableRequests";
import { useUserStore } from "@/store/userData";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

type Props = {
  item: RequestType;
};

export default function RequestCard({ item }: Props) {
  const userData = useUserStore((state) => state.userData);
  const { mutate, isPending, isError, error } = useAcceptRequestMutation();
  const router = useRouter();

  function handleClick() {
    if (!userData) return router.push("/login");
    mutate({ donorId: parseInt(userData.userId!), requestId: item.id });
  }

  useEffect(() => {
    if (isError) {
      console.error(isError, error.message);
    }
  }, [isError]);

  return (
    <Card className="p-4" key={item.id}>
      <p>{item.blood_group}</p>
      <p>{item.details}</p>
      <p>{item.district}</p>
      <p>{item.donor}</p>
      <p>{item.gender}</p>
      <p>{item.accepted_donor_id}</p>
      <Button
        onClick={() => handleClick()}
        disabled={isPending || item.blood_request_type !== "Pending"}
      >
        {isPending ? (
          <Loader2 className="animate-spin" />
        ) : item.blood_request_type === "Running" ? (
          "Running"
        ) : item.blood_request_type === "Completed" ? (
          "Completed"
        ) : (
          "Accept"
        )}
      </Button>
    </Card>
  );
}
