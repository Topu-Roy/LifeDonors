import { Suspense } from "react";
import { ProfileView } from "@/app/profile/_components/ProfileView";
import type { Metadata } from "next";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Profile | LifeDonors",
  description: "View and manage your donor profile and health statistics.",
};

export default function ProfilePage() {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <Suspense fallback={<Skeleton className="flex h-screen w-full items-center justify-center" />}>
        <ProfileView />
      </Suspense>
    </div>
  );
}
