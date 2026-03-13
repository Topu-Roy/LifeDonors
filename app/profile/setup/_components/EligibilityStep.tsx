"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { api } from "@/convex/_generated/api";
import { currentStepAtom, setupFormAtom } from "@/state/setup/store";
import { useMutation } from "convex/react";
import { useAtom } from "jotai";
import { ArrowLeft, Calendar as CalendarIcon, CheckCircle2, Heart, Loader2, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import * as z from "zod";
import { extractConvexError } from "@/lib/helpers/convexErrorExtractor";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";

const healthConditions = [
  "Heart Disease or history of heart attack",
  "Diabetes (requiring insulin)",
  "Cancer (other than minor skin cancer)",
  "Hepatitis or Liver Disease",
  "HIV/AIDS",
  "Other",
];

const step3Schema = z.object({
  diseases: z.array(z.string()),
  lastDonationDate: z.number(),
});

export function EligibilityStep() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [formData] = useAtom(setupFormAtom);
  const [, setCurrentStep] = useAtom(currentStepAtom);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const updateProfile = useMutation(api.users.updateProfile);
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      diseases: formData.diseases ?? [],
      lastDonationDate: formData.lastDonationDate ?? 0,
    },
    validators: {
      onChange: step3Schema,
    },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true);
      try {
        // Aggregate all data from store + current step
        const finalData = {
          ...formData,
          ...value,
        };

        // BMI calculation: weight / (height/100)^2
        const heightInMeters = (finalData.height ?? 0) / 100;
        const bmi =
          heightInMeters > 0
            ? parseFloat(((finalData.weight ?? 0) / (heightInMeters * heightInMeters)).toFixed(1))
            : 0;

        await updateProfile({
          age: finalData.age ?? 0,
          bmi: bmi,
          bloodType: (finalData.bloodType as "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-") || "A+",
          hemoglobinLevel: finalData.hemoglobinLevel ?? 12.5,
          phoneNumber: finalData.phoneNumber ?? "",
          diseases: finalData.diseases ?? [],
          lastDonationDate: finalData.lastDonationDate ?? 0,
          division: finalData.division ?? "",
          district: finalData.district ?? "",
          subDistrict: finalData.subDistrict ?? "",
        }).then(() => {
          toast.success("Profile setup complete!");
          router.push("/profile");
        });
      } catch (error) {
        toast.error(error instanceof Error ? extractConvexError(error) : "Failed to save profile");
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        e.stopPropagation();
        void form.handleSubmit();
      }}
      className="animate-in fade-in slide-in-from-right-4 space-y-10 duration-500"
    >
      <FieldGroup>
        {/* Health Conditions */}
        <section className="space-y-6">
          <form.Field name="diseases">
            {field => (
              <Field>
                <div>
                  <FieldLabel className="flex items-center gap-2 text-xl font-black tracking-tight">
                    <Heart className="text-primary h-5 w-5" />
                    Health Conditions
                  </FieldLabel>
                  <FieldDescription className="text-muted-foreground mt-1 text-sm font-medium">
                    Please check any underlying health conditions you may have.
                  </FieldDescription>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                  {healthConditions.map(condition => (
                    <label
                      key={condition}
                      className="border-border hover:border-primary/20 hover:bg-primary/5 group flex cursor-pointer items-start gap-3 rounded-3xl border-2 p-4 transition-all md:p-5"
                    >
                      <Checkbox
                        checked={field.state.value?.includes(condition)}
                        onCheckedChange={checked => {
                          const current = field.state.value || [];
                          if (checked) {
                            field.handleChange([...current, condition]);
                          } else {
                            field.handleChange(current.filter((c: string) => c !== condition));
                          }
                        }}
                        className="border-primary/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary mt-1 border-2"
                      />
                      <span className="text-foreground group-hover:text-primary text-xs leading-tight font-bold transition-colors md:text-sm">
                        {condition}
                      </span>
                    </label>
                  ))}
                  <label className="border-primary/5 hover:border-primary/20 hover:bg-primary/5 group flex cursor-pointer items-start gap-3 rounded-3xl border-2 p-4 transition-all md:p-5">
                    <Checkbox
                      checked={(field.state.value || []).length === 0}
                      onCheckedChange={checked => {
                        if (checked) field.handleChange([]);
                      }}
                      className="border-primary/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary mt-1 border-2"
                    />
                    <span className="text-foreground group-hover:text-primary text-xs leading-tight font-bold transition-colors md:text-sm">
                      None of the above
                    </span>
                  </label>
                </div>
                {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                  <FieldError errors={field.state.meta.errors} />
                )}
              </Field>
            )}
          </form.Field>
        </section>

        {/* Last Donation Date */}
        <section className="space-y-6 pt-4">
          <Field>
            <div>
              <FieldLabel className="flex items-center gap-2 text-xl font-black tracking-tight">
                <CalendarIcon className="text-primary h-5 w-5" />
                Donation History
              </FieldLabel>
              <FieldDescription className="text-muted-foreground mt-1 text-sm font-medium">
                When was your last blood donation? (Leave blank if never)
              </FieldDescription>
            </div>

            <span className="text-foreground mt-2 block font-semibold">
              Last Donated: {date?.getDate()}/{date?.getMonth()}/{date?.getFullYear()}
            </span>

            <div className="mt-4 max-w-md">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                captionLayout="dropdown"
                className="bg-primary/5 border-primary/50 rounded-lg border"
              />
            </div>
          </Field>
        </section>

        {/* Initial Eligibility Status Preview */}
        <div className="bg-primary/5 border-primary/20 mt-8 flex flex-col items-start gap-4 rounded-3xl border-2 p-6 shadow-sm md:flex-row md:gap-5 md:p-8">
          <div className="bg-primary/20 text-primary shadow-primary/10 shrink-0 rounded-2xl p-2 shadow-lg md:p-3">
            <CheckCircle2 className="h-6 w-6 md:h-8 md:w-8" />
          </div>
          <div>
            <h3 className="text-foreground mb-1 text-lg font-black tracking-tight md:text-xl">
              Initial Eligibility Review
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed font-medium md:text-base">
              Based on your responses, <strong>you&apos;re on the right path!</strong> Final eligibility will be
              confirmed during pre-donation health screening at the center.
            </p>
          </div>
        </div>
      </FieldGroup>

      <div className="flex flex-col-reverse justify-between gap-4 border-t pt-8 sm:flex-row">
        <Button
          type="button"
          variant="outline"
          onClick={() => setCurrentStep(2)}
          disabled={isSubmitting}
          className={"flex h-12 w-full items-center justify-center gap-4 px-8 py-4 sm:w-auto md:h-14"}
        >
          <ArrowLeft className="h-5 w-5" />
          Back
        </Button>
        <form.Subscribe selector={state => [state.canSubmit, state.isSubmitting]}>
          {([canSubmit, isSubmitting]) => (
            <Button
              type="submit"
              disabled={!canSubmit || isSubmitting}
              className={"flex h-12 w-full items-center justify-center gap-4 px-8 py-4 sm:w-auto md:h-14"}
            >
              {isSubmitting ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  Complete Profile
                </>
              )}
            </Button>
          )}
        </form.Subscribe>
      </div>
    </form>
  );
}
