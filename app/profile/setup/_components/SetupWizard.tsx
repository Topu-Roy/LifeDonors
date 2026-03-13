"use client";

import { useEffect } from "react";
import { BasicInfoStep } from "@/app/profile/setup/_components/BasicInfoStep";
import { EligibilityStep } from "@/app/profile/setup/_components/EligibilityStep";
import { HealthDetailsStep } from "@/app/profile/setup/_components/HealthDetailsStep";
import { api } from "@/convex/_generated/api";
import { currentStepAtom } from "@/state/setup/store";
import { useQuery } from "convex/react";
import { useAtom } from "jotai";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { type ProfileType } from "../../_components/ProfileView";

const steps = [
  { id: 1, title: "Basic Information", description: "Age, Phone & Location" },
  { id: 2, title: "Health Details", description: "Blood Type & Vitals" },
  { id: 3, title: "Eligibility", description: "Review & Complete" },
];

const isProfileComplete = (p: ProfileType) => {
  if (!p) return false;

  return (
    p.age !== undefined &&
    p.bmi !== undefined &&
    p.bloodType !== undefined &&
    p.hemoglobinLevel !== undefined &&
    p.phoneNumber !== undefined &&
    p.division !== undefined &&
    p.district !== undefined &&
    p.subDistrict !== undefined
  );
};

export function SetupWizard() {
  const profile = useQuery(api.users.getMyProfile);
  const [currentStep] = useAtom(currentStepAtom);
  const router = useRouter();

  useEffect(() => {
    if (profile !== undefined && isProfileComplete(profile)) {
      router.replace("/profile");
    }
  }, [profile, router]);

  if (profile === undefined) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-20 w-full rounded-3xl" />
        <Skeleton className="h-20 w-full rounded-3xl" />
        <Skeleton className="h-20 w-full rounded-3xl" />
      </div>
    );
  }

  return (
    <>
      {/* Header Info (Dynamic Part) */}
      <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <p className="text-muted-foreground ml-1 text-base font-medium md:text-lg">
          {steps[currentStep - 1].title}: <span>{steps[currentStep - 1].description}</span>
        </p>

        <div className="flex items-center justify-between gap-3">
          <p className="text-muted-foreground text-sm font-black tracking-widest uppercase">
            Step {currentStep} of 3
          </p>
          <div className="bg-primary/10 border-primary/5 h-3 w-32 overflow-hidden rounded-full border">
            <div
              className="bg-primary h-full transition-all duration-500 ease-out"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Step Indicator (Visual) */}
      <div className="relative mb-12 flex justify-between px-2 md:mb-16">
        {/* Background track */}
        <div className="bg-primary/10 absolute top-1/2 left-0 z-0 h-1 w-[95%] -translate-y-1/2 rounded-full md:h-2" />
        {/* Fill track */}
        <div
          className={cn(
            "bg-primary absolute top-1/2 left-2 z-0 h-1 -translate-y-1/2 rounded-full transition-all duration-500 ease-out md:h-2",
            currentStep === 1 ? "w-[0%]" : currentStep === 2 ? "w-[50%]" : "w-[95%]"
          )}
        />
        {steps.map(step => (
          <div key={step.id} className="relative z-10 flex flex-col items-center justify-center">
            <div
              className={cn(
                "flex size-8 cursor-default items-center justify-center rounded-full border-2 text-xs font-bold transition-all duration-500 md:size-12 md:border-4 md:text-base",
                currentStep > step.id
                  ? "bg-primary border-primary shadow-primary/30 text-primary-foreground shadow-lg"
                  : currentStep === step.id
                    ? "bg-background border-primary text-primary ring-primary/20 scale-110 shadow-xl ring-4"
                    : "bg-background border-muted text-muted-foreground"
              )}
            >
              {currentStep > step.id ? <Check className="h-4 w-4 md:h-6 md:w-6" strokeWidth={3} /> : step.id}
            </div>
            {step.title === "Basic Information" ? (
              <>
                <span
                  className={cn(
                    "absolute -bottom-6 text-[10px] font-black tracking-widest whitespace-nowrap uppercase transition-all duration-300 md:-bottom-8 md:text-xs xl:hidden",
                    currentStep >= step.id ? "text-primary" : "text-muted-foreground opacity-50"
                  )}
                >
                  {step.title.split(" ")[0]}
                </span>

                <span
                  className={cn(
                    "absolute -bottom-6 hidden text-[10px] font-black tracking-widest whitespace-nowrap uppercase transition-all duration-300 md:-bottom-8 md:text-xs xl:block",
                    currentStep >= step.id ? "text-primary" : "text-muted-foreground opacity-50"
                  )}
                >
                  {step.title}
                </span>
              </>
            ) : (
              <span
                className={cn(
                  "absolute -bottom-6 text-[10px] font-black tracking-widest whitespace-nowrap uppercase transition-all duration-300 md:-bottom-8 md:text-xs",
                  currentStep >= step.id ? "text-primary" : "text-muted-foreground opacity-50"
                )}
              >
                {step.title}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Form Container */}
      <div className="bg-card border-primary/5 shadow-primary/5 rounded-3xl border p-6 shadow-2xl md:p-12">
        {currentStep === 1 && <BasicInfoStep />}
        {currentStep === 2 && <HealthDetailsStep />}
        {currentStep === 3 && <EligibilityStep />}
      </div>
    </>
  );
}
