"use client";

import { Card } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { MyFormField } from "@/components/MyFormField";
import Link from "next/link";

const FormSchema = z.object({
  email: z
    .string({
      required_error: "Please give an email",
    })
    .email(),

  password: z
    .string({
      required_error: "Please give a password.",
    })
    .min(1, { message: "Please give a password." }),
});

export default function LoginPage() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
  }

  return (
    <main className="min-h-[90dvh] w-full">
      <div className="mx-auto max-w-7xl py-4">
        <Card className="mx-auto max-w-xl px-4 py-4">
          <h2 className="py-4 text-center text-2xl font-semibold">Log In</h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="flex items-start justify-between gap-4"></div>
              <MyFormField
                inputClassName="w-full"
                className="w-full"
                key="email"
                control={form.control}
                label="Email"
                name="email"
                placeholder="example@example.com"
                type="email"
              />

              <MyFormField
                inputClassName="w-full"
                className="w-full"
                key="password"
                control={form.control}
                label="Password"
                name="password"
                placeholder="••••••••"
                type="password"
              />

              <p className="text-muted-foreground">
                Don&apos;t have an Account?{" "}
                <Link href={"/register"} className="font-semibold underline">
                  register here.
                </Link>
              </p>

              <div className="flex w-full items-center justify-end">
                <Button className="bg-destructive" type="submit">
                  Submit
                </Button>
              </div>
            </form>
          </Form>
        </Card>
      </div>
    </main>
  );
}
