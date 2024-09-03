"use client";

import { Card } from "@/components/ui/card";
import { useUserStore } from "@/store/userData";
import { Loader2 } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { z } from "zod";
import { useRouter } from "next/navigation";
import MyRequests from "./myRequests";
import CreateRequest from "./createRequest";

const userProfileSchema = z.object({
  user: z.string(),
  blood_group: z.string(),
  district: z.string(),
  date_of_donation: z.string().nullable(),
  gender: z.string(),
  is_available: z.boolean(),
});

const UserProfileSchemaArray = z.array(userProfileSchema);
type UserProfile = z.infer<typeof userProfileSchema>;

function DashboardPage() {
  const [profile, setProfile] = useState<UserProfile[] | null>(null);
  const authData = useUserStore((store) => store.userData);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const router = useRouter();

  async function getData() {
    if (!authData) return;
    setIsProfileLoading(true);

    const response_Profile = await fetch(
      `https://life-donors.onrender.com/users/profile/${authData.userId}/`,
    );

    if (response_Profile.ok) {
      setIsProfileLoading(false);
      const data: unknown = await response_Profile.json();
      const validatedData = UserProfileSchemaArray.parse(data);
      setProfile(validatedData);
    } else {
      setIsProfileLoading(false);
    }
  }

  useEffect(() => {
    if (!authData) {
      router.replace("/login");
    }
    void getData();
  }, [authData]);

  return (
    <main className="min-h-[85dvh] w-full">
      <h2 className="mx-auto max-w-7xl px-2 py-8 text-3xl font-bold xl:px-0">
        Dashboard
      </h2>

      <div className="mx-auto max-w-7xl px-2 pb-8 xl:px-0">
        <CreateRequest />
      </div>
      <MyRequests />
      <Card className="h-[19.2rem] max-w-lg p-4">
        <h2 className="py-2 text-lg font-semibold">My Details</h2>
        {isProfileLoading ? (
          <div className="flex w-full items-center justify-center py-8">
            <Loader2 className="animate-spin" size={20} />
          </div>
        ) : profile ? (
          profile?.map((item, index) => (
            <div key={index} className="divide divide-y divide-black/15">
              <div className="flex items-center justify-between py-3">
                <p>username</p>
                <p>{item.user}</p>
              </div>
              <div className="flex items-center justify-between py-3">
                <p>blood group</p>
                <p>{item.blood_group}</p>
              </div>
              <div className="flex items-center justify-between py-3">
                <p>district</p>
                <p>{item.district ? item.district : "N/A"}</p>
              </div>
              <div className="flex items-center justify-between py-3">
                <p>available</p>
                <p>{item.is_available ? "yes" : "no"}</p>
              </div>
            </div>
          ))
        ) : (
          <p>Data not found.</p>
        )}
      </Card>
    </main>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardPage />
    </Suspense>
  );
}
