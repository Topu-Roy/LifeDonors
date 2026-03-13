"use client";

import { api } from "@/convex/_generated/api";
import { type Doc } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { ChevronRight, Clock, Hospital, MapPin, TrendingUp, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { isCompatible } from "@/lib/blood-compatibility";
import { extractConvexError } from "@/lib/helpers/convexErrorExtractor";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";

type RequestCardProps = {
  request: Doc<"requests"> & {
    volunteers?: (Doc<"donations"> & {
      donor?: Doc<"profiles"> | null;
    })[];
  };
  isOwner?: boolean;
};

const URGENCY_STYLES = {
  Low: "border-slate-200 dark:border-slate-800",
  Medium: "border-orange-200 dark:border-orange-900/50",
  High: "border-red-200 dark:border-red-900/50",
  Critical: "border-red-400 dark:border-red-800 bg-accent dark:bg-primary/10",
} as const;

const URGENCY_BADGE_STYLES = {
  Low: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
  Medium: "bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300",
  High: "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300",
  Critical: "bg-red-600 text-white animate-pulse",
} as const;

function timeAgo(date: number) {
  const seconds = Math.floor((Date.now() - date) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function RequestHeader({
  request,
  userVolunteered,
}: {
  request: RequestCardProps["request"];
  userVolunteered?: boolean;
}) {
  return (
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-4">
        <div className="bg-primary flex size-16 items-center justify-center rounded-3xl text-2xl font-black text-white shadow-inner">
          {request.bloodTypeNeeded}
        </div>
        <div>
          <div className="flex flex-wrap gap-2">
            <Badge
              className={cn(
                "mb-1.5 rounded-full border-none px-3 py-1 text-[10px] font-black tracking-widest uppercase",
                URGENCY_BADGE_STYLES[request.urgency]
              )}
            >
              {request.urgency}
            </Badge>
            {userVolunteered && (
              <Badge className="bg-primary border-primary/20 mb-1.5 rounded-full border px-3 py-1 text-[10px] font-black tracking-widest text-slate-900 uppercase">
                Volunteered
              </Badge>
            )}
          </div>
          <p className="flex items-center gap-1 text-sm font-bold text-slate-500 dark:text-slate-400">
            <TrendingUp className="text-primary h-3 w-3" />
            {request.numberOfBags} {request.numberOfBags > 1 ? "Bags" : "Bag"} Needed
          </p>
        </div>
      </div>
      <div className="flex flex-col items-end gap-2">
        <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold tracking-tighter text-slate-400 dark:bg-slate-800/50 dark:text-slate-500">
          {timeAgo(request.createdAt)}
        </span>
        {request.isSeed && (
          <Badge className="rounded-full border-none bg-blue-100 px-2 py-0.5 text-[8px] font-black tracking-widest text-blue-600 dark:bg-blue-900/40 dark:text-blue-300">
            Demo
          </Badge>
        )}
      </div>
    </div>
  );
}

function RequestBody({ request }: { request: RequestCardProps["request"] }) {
  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-start gap-3">
        <div className="bg-foreground/10 text-foreground/40 shrink-0 rounded-xl p-2">
          <Hospital className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="text-foreground/70 truncate text-lg font-black tracking-tight">{request.hospitalName}</p>
          <p className="text-muted-foreground flex items-center gap-1 text-xs font-medium">
            <MapPin className="h-3 w-3 shrink-0" />
            <span className="truncate">
              {request.hospitalLocation}, {request.district}
            </span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col justify-center gap-1 rounded-2xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/50">
          <div className="flex items-center gap-2">
            <User className="text-primary h-4 w-4 shrink-0" />
            <p className="truncate text-sm font-bold text-slate-600 dark:text-slate-400">{request.patientName}</p>
          </div>
          {(request.patientGender ?? request.patientAge) && (
            <p className="text-muted-foreground ml-6 truncate text-xs font-semibold">
              {request.patientGender && `${request.patientGender}`}
              {request.patientAge && request.patientGender && `, ${request.patientAge} yrs`}
              {request.patientAge && !request.patientGender && `${request.patientAge} yrs`}
            </p>
          )}
        </div>
        <div className="flex flex-col justify-center gap-1 rounded-2xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/50">
          <div className="flex items-center gap-2">
            <Clock className="text-primary h-4 w-4 shrink-0" />
            <p className="truncate text-sm font-bold text-slate-600 dark:text-slate-400">
              By{" "}
              {new Date(request.createdAt + 86400000).toLocaleDateString([], {
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
          {request.cause && <p className="text-primary ml-6 truncate text-xs font-black">{request.cause}</p>}
        </div>
      </div>
    </div>
  );
}

function RequestActions({
  requestId,
  isOwner,
  userVolunteered,
  onAccept,
  isDonorCompatible,
}: {
  requestId: string;
  isOwner: boolean;
  userVolunteered?: boolean;
  onAccept: (e: React.MouseEvent) => void;
  isDonorCompatible?: boolean;
}) {
  if (isOwner) {
    return (
      <Link href={`/requests/${requestId}`}>
        <Button
          className={
            "shadow-primary/20 group h-14 w-full gap-2 text-base font-black shadow-lg transition-all hover:scale-[1.02] active:scale-95"
          }
        >
          Review Request
          <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
        </Button>
      </Link>
    );
  }

  return (
    <div className="flex gap-2">
      <Link
        href={`/requests/${requestId}`}
        className={cn(
          buttonVariants({ variant: "outline" }),
          "border-primary/20 hover:bg-primary/5 h-14 flex-1 rounded-2xl font-bold"
        )}
      >
        Details
      </Link>
      {isDonorCompatible && (
        <Button
          onClick={onAccept}
          disabled={userVolunteered}
          className={cn(
            "shadow-primary/20 bg-primary h-14 flex-2 gap-2 rounded-2xl text-base font-black shadow-lg transition-all hover:scale-[1.02] active:scale-95",
            userVolunteered && "cursor-not-allowed opacity-70 shadow-none"
          )}
        >
          {userVolunteered ? "Volunteered" : "Volunteer Now"}
        </Button>
      )}
    </div>
  );
}

export function RequestCard({ request, isOwner: isOwnerProp }: RequestCardProps) {
  const user = useQuery(api.users.getMyProfile);
  const acceptRequest = useMutation(api.donations.offerDonation);
  const userVolunteered = useQuery(api.donations.hasVolunteered, { requestId: request._id });
  const router = useRouter();

  const isOwner = isOwnerProp ?? user?._id === request.requesterId;

  const handleAccept = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      router.push("/sign-in");
      return;
    }

    try {
      await acceptRequest({ requestId: request._id }).then(() => toast.success("You have volunteered to help!"));
    } catch (err) {
      if (err instanceof Error) {
        toast.error(extractConvexError(err));
      } else {
        toast.error("Failed to volunteer");
      }
    }
  };

  return (
    <div
      className={cn(
        "group bg-card flex flex-col overflow-hidden rounded-3xl border-2 p-1 shadow-sm hover:shadow-xl",
        URGENCY_STYLES[request.urgency]
      )}
    >
      <div className="flex h-full flex-col gap-6 p-6">
        <RequestHeader request={request} userVolunteered={userVolunteered} />
        <RequestBody request={request} />
        <div className="pt-2">
          <RequestActions
            requestId={request._id}
            isOwner={isOwner}
            userVolunteered={userVolunteered}
            onAccept={handleAccept}
            isDonorCompatible={isCompatible(user?.bloodType, request.bloodTypeNeeded)}
          />
        </div>
      </div>
    </div>
  );
}
