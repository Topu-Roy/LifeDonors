"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { History, MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { checkProfileCompletion } from "@/lib/helpers/checkProfileCompletion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DonationTab } from "./donationTab";
import { RequestTab } from "./requestTab";

export function DashboardTabs() {
  const profile = useQuery(api.users.getMyProfile);
  const router = useRouter();

  checkProfileCompletion(profile, router);

  return (
    <Tabs defaultValue={"requests"} className="w-full space-y-8">
      <TabsList className="bg-background h-12 w-full max-w-md rounded-full border p-1 shadow-sm md:h-14">
        <TabsTrigger
          value="requests"
          className="h-full gap-2 rounded-full px-4 text-xs font-bold transition-all md:px-8 md:text-sm"
        >
          <MessageSquare className="h-4 w-4" />
          My Requests
        </TabsTrigger>
        <TabsTrigger
          value="donations"
          className="h-full gap-2 rounded-full px-4 text-xs font-bold transition-all md:px-8 md:text-sm"
        >
          <History className="h-4 w-4" />
          My Donations
        </TabsTrigger>
      </TabsList>

      <TabsContent value="requests" className="space-y-6 focus-visible:outline-none">
        <RequestTab />
      </TabsContent>

      <TabsContent value="donations" className="space-y-6 focus-visible:outline-none">
        <DonationTab />
      </TabsContent>
    </Tabs>
  );
}
