"use client";

import { useAvailableRequestsQuery } from "@/query/availableRequests";
import { Loader2 } from "lucide-react";
import RequestCard from "./requestCard";
import { useUserStore } from "@/store/userData";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Donate() {
  const userData = useUserStore((state) => state.userData);
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const { data, isLoading, isError, error } = useAvailableRequestsQuery(
    userData?.userId ?? undefined,
  );

  useEffect(() => {
    setIsMounted(true);
    if (!userData && isMounted) {
      router.push("login");
    }
  }, [isMounted, userData]);

  if (isError) {
    console.error("Error fetching available requests:", error);
  }

  return (
    <main className="flex min-h-[85dvh] items-center justify-center bg-gray-100">
      <div className="mx-auto max-w-7xl space-y-4 p-4">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : data && data.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data.map((item) => (
              <RequestCard item={item} key={item.id} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No requests available.</p>
        )}
      </div>
    </main>
  );
}
