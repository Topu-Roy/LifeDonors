"use client";

import { useAvailableRequestsMutation } from "@/query/availableRequests";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import RequestCard from "./requestCard";
import { useUserStore } from "@/store/userData";

export default function Donate() {
  const userData = useUserStore((state) => state.userData);
  const { mutate, data, isPending, isError, error } =
    useAvailableRequestsMutation();

  useEffect(() => {
    if (userData) {
      mutate({ userId: userData.userId! });
    }
  }, [userData]);

  useEffect(() => {
    if (isError) {
      console.error(isError, error.message);
    }
  }, [isError, error]);

  return (
    <main className="min-h-[85dvh]">
      <div className="mx-auto max-w-7xl space-y-4">
        {data
          ? data.map((item) => <RequestCard item={item} key={item.id} />)
          : null}

        {isPending ? <Loader2 className="animate-spin" /> : null}
      </div>
    </main>
  );
}
