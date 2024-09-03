"use client";

import { Card } from "@/components/ui/card";
import { useProfileMutation } from "@/query/profile";
import { useUserStore } from "@/store/userData";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Suspense, useEffect } from "react";

function ProfilePage() {
  const router = useRouter();
  const userData = useUserStore((state) => state.userData);
  const { mutate, isPending, isError, data, error } = useProfileMutation();

  useEffect(() => {
    if (userData) {
      mutate({ id: parseInt(userData.userId!) });
    } else {
      router.push("/login");
    }
  }, [userData]);

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="min-h-[85dvh]">
      <div className="mx-auto max-w-7xl">
        <h2 className="mx-auto max-w-7xl py-8 text-center text-3xl font-bold">
          My Profile
        </h2>
        <div className="flex items-center justify-center">
          {data
            ? data.map((profile, index) => (
                <Card key={index} className="w-full max-w-xl p-4">
                  <div className="flex items-center justify-between py-3">
                    <p>Username</p>
                    <p>{profile.user}</p>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <p>Blood Group</p>
                    <p>Blood Group: {profile.blood_group}</p>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <p>District</p>
                    <p>District: {profile.district || "N/A"}</p>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <p>Last Donation</p>
                    <p>{profile.date_of_donation ?? "N/A"}</p>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <p>Gender</p>
                    <p>Gender: {profile.gender || "N/A"}</p>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <p>Available</p>
                    <p>Available: {profile.is_available ? "Yes" : "No"}</p>
                  </div>
                </Card>
              ))
            : null}

          {isPending ? (
            <div className="p-8">
              <Loader2 className="animate-spin" />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProfilePage />
    </Suspense>
  );
}
