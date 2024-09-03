"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useDashboardQuery } from "@/query/dashboard";
import { useUserStore } from "@/store/userData";
import { CircleCheck, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { z } from "zod";

const RequestSchema = z.object({
  blood_group: z.string(),
  blood_request_type: z.string(),
  date_of_donation: z.string().nullable(),
  details: z.string(),
  district: z.string(),
  donor: z.string(),
  gender: z.enum(["Male", "Female", "Other"]),
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ApiResponseSchema = z.object({
  donor_id: z.number(),
  my_requests: z.array(RequestSchema).nullable(),
});

type UserRequestsType = z.infer<typeof RequestSchema>;

export default function MyRequests() {
  const { data, isLoading, isError, refetch } = useDashboardQuery();
  const [userRequests, setUserRequests] = useState<UserRequestsType[] | null>(
    null,
  );
  const authData = useUserStore((store) => store.userData);
  const { toast } = useToast();

  useEffect(() => {
    if (isError) {
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: "Could not get the data from server.",
      });
    }
  }, [isError]);

  useEffect(() => {
    if (authData) {
      void refetch();
    }
  }, [authData]);

  useEffect(() => {
    if (data) {
      setUserRequests(data.my_requests);
    }
  }, [data]);

  return (
    <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-8 px-2 pb-8 md:grid-cols-2 lg:grid-cols-3 xl:px-0">
      <h2 className="pt-2 text-xl font-semibold">My Requests</h2>
      <Card className="col-span-3 p-4">
        {isLoading ? (
          <div className="flex w-full items-center justify-center py-8">
            <Loader2 className="animate-spin" size={20} />
          </div>
        ) : userRequests && userRequests?.length > 0 ? (
          <div className="divide w-full space-y-3 divide-y divide-black/15">
            <div className="flex items-start justify-between py-2">
              <p className="w-full flex-1 font-medium">Date</p>
              <p className="w-full flex-1 text-center font-medium">Group</p>
              <p className="w-full flex-1 text-center font-medium">Gender</p>
              <p className="w-full flex-1 text-center font-medium">District</p>
              <p className="w-full flex-1 text-center font-medium">
                Donor Details
              </p>
              <p className="w-full flex-1 text-center font-medium">Status</p>
              <p className="w-full flex-1 text-center font-medium">Actions</p>
            </div>
            <div className="divide flex w-full flex-col-reverse gap-2 divide-y divide-black/15">
              {userRequests?.map((item, index) => (
                <div key={`${item.donor}-${index}`} className="py-2">
                  <div className="flex items-center justify-between">
                    <p className="w-full flex-1">{item.date_of_donation}</p>
                    <p className="w-full flex-1 text-center">
                      {item.blood_group}
                    </p>
                    <p className="w-full flex-1 text-center">{item.gender}</p>
                    <p className="w-full flex-1 text-center">{item.district}</p>
                    <p className="w-full flex-1 text-center">
                      <Button disabled={true} variant={"ghost"} className="">
                        No donor
                      </Button>
                    </p>
                    <p className="w-full flex-1 text-center">
                      {item.blood_request_type}
                    </p>
                    <div className="flex w-full flex-1 items-center justify-center">
                      <Button
                        disabled={
                          item.blood_request_type === "Completed" ||
                          item.blood_request_type === "Running"
                            ? false
                            : true
                        }
                        variant={
                          item.blood_request_type === "Running"
                            ? "destructive"
                            : "ghost"
                        }
                        className={cn(
                          "flex items-center justify-center gap-2",
                          item.blood_request_type === "Completed"
                            ? "italic text-green-400"
                            : "",
                        )}
                      >
                        {item.blood_request_type === "Completed" ? (
                          <>
                            <span>Approved</span>
                            <CircleCheck />
                          </>
                        ) : null}

                        {item.blood_request_type === "Pending" ? (
                          <>
                            <span>Unavailable</span>
                          </>
                        ) : null}

                        {item.blood_request_type === "Running" ? (
                          <>
                            <span>Approve</span>
                          </>
                        ) : null}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p>No requests are made yet.</p>
        )}
      </Card>
    </div>
  );
}
