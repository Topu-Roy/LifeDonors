"use client";

import { BloodRequestForm } from "@/app/requests/_components/BloodRequestForm";
import { ChevronLeft, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/Container";
import { Button } from "@/components/ui/button";

export default function CreateRequestPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen py-6 md:py-12">
      <Container maxWidth="2xl">
        <div className="mb-8">
          <Button
            variant="ghost"
            className="group hover:text-primary mb-6 h-auto p-0 text-slate-500 transition-colors"
            onClick={() => router.back()}
          >
            <ChevronLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Explorer
          </Button>

          <div className="mb-2 flex items-center gap-4">
            <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-2xl">
              <Plus className="text-primary h-6 w-6" />
            </div>
            <h1 className="text-xl font-black tracking-tight md:text-2xl lg:text-3xl">Post a Blood Request</h1>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed md:text-lg md:font-medium">
            Fill out the details below to find donors in your area.
          </p>
        </div>

        <div className="border-primary/10 bg-card rounded-lg border p-4 shadow-sm md:p-10">
          <BloodRequestForm onSuccess={() => router.push("/requests")} className="space-y-8" />
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm font-medium text-slate-400">
            By posting a request, you agree to our terms of service and privacy policy. Your contact details will
            only be visible to potential donors.
          </p>
        </div>
      </Container>
    </div>
  );
}
