import { Suspense } from "react";
import { SetupWizard } from "@/app/profile/setup/_components/SetupWizard";
import { Droplet } from "lucide-react";
import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Profile Setup | LifeDonors",
  description: "Complete your donor profile to start saving lives.",
};

export default function ProfileSetupPage() {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <Container as="main" className="flex flex-1 flex-col gap-6 py-6 md:gap-8 md:py-8">
        {/* Header Section */}
        <header className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 border-primary/20 shrink-0 rounded-xl border p-2 shadow-sm">
                <Droplet className="text-primary h-6 w-6" />
              </div>
              <h1 className="text-foreground text-3xl font-black tracking-tight md:text-4xl">Profile Setup</h1>
            </div>
          </div>
        </header>

        <Suspense
          fallback={
            <div className="space-y-4">
              <Skeleton className="h-20 w-full rounded-3xl" />
              <Skeleton className="h-20 w-full rounded-3xl" />
              <Skeleton className="h-20 w-full rounded-3xl" />
            </div>
          }
        >
          <SetupWizard />
        </Suspense>

        {/* Motivation Footer */}
        <footer className="py-4 text-center">
          <p className="text-muted-foreground text-sm font-medium italic">
            &quot;Your 15 minutes can save 3 lives. Thank you for being a hero.&quot;
          </p>
        </footer>
      </Container>
    </div>
  );
}
