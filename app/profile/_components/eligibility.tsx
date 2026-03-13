import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { AlertCircle, Calendar, CheckCircle2, Link } from "lucide-react";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";

export function Eligibility() {
  const eligibility = useQuery(api.users.checkEligibility);

  if (!eligibility) return <Spinner />;

  return (
    <section
      className={cn(
        "relative flex flex-col items-start justify-between gap-6 overflow-hidden rounded-3xl border p-8 shadow-xl md:flex-row md:items-center",
        eligibility.eligible ? "border-green-500/20 bg-green-400/5" : "border-primary/20 bg-primary/10"
      )}
    >
      <div className="relative z-10 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          {eligibility.eligible ? (
            <CheckCircle2 className="h-6 w-6 shrink-0 text-green-500" />
          ) : (
            <AlertCircle className="text-primary h-6 w-6 shrink-0" />
          )}
          <h3 className="text-xl font-black tracking-tight md:text-2xl">
            Eligibility: {eligibility.eligible ? "Eligible" : "Pending"}
          </h3>
        </div>
        <p className="text-muted-foreground max-w-2xl text-base leading-relaxed font-medium md:text-lg">
          {eligibility.eligible
            ? "Great news! You are currently eligible to make a life-saving blood donation today. Your community needs you."
            : (eligibility.reason ??
              "You are currently in a waiting period. Check back later to see when you can donate again.")}
        </p>
      </div>

      <Link
        href={eligibility.eligible ? "/requests" : "#"}
        className={cn(
          "pointer-events-none h-12 w-full shrink-0 rounded-2xl px-8 font-black whitespace-nowrap text-green-500 shadow-lg transition-all md:w-auto",
          !eligibility.eligible && "text-primary"
        )}
      >
        <Calendar className="mr-2 h-5 w-5" />
        {eligibility.eligible ? "Find Urgent Requests" : "Wait for Rest"}
      </Link>
    </section>
  );
}
