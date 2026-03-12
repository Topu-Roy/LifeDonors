"use client";

import { useState } from "react";
import { Droplet } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { extractConvexError } from "@/lib/helpers/convexErrorExtractor";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";

export default function SignInPage() {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isGithubLoading, setIsGithubLoading] = useState(false);

  async function signInWithGoogle() {
    setIsGoogleLoading(true);
    await authClient.signIn
      .social({
        provider: "google",
        callbackURL: "/profile/setup",
      })
      .catch(err => {
        if (err instanceof Error) {
          toast.error(extractConvexError(err));
        } else {
          toast.error("Error while signing in with Google!");
        }
      })
      .finally(() => {
        setIsGoogleLoading(false);
      });
  }

  async function signInWithGithub() {
    setIsGithubLoading(true);
    await authClient.signIn
      .social({
        provider: "github",
        callbackURL: "/profile/setup",
      })
      .catch(err => {
        if (err instanceof Error) {
          toast.error(extractConvexError(err) ?? "Error while signing in with Github!");
        } else {
          toast.error("Error while signing in with Github!");
        }
      })
      .finally(() => {
        setIsGithubLoading(false);
      });
  }

  return (
    <div className="flex h-full flex-col items-center justify-center px-4 py-14">
      <div className="shadow-primary/5 w-full max-w-md space-y-4 rounded-3xl border bg-white px-6 py-12 text-center shadow-xl dark:bg-slate-900">
        <div className="mx-auto flex w-full items-center justify-center gap-3 pb-2">
          <div className="bg-primary shadow-primary/20 flex h-10 w-10 items-center justify-center rounded-xl shadow-lg">
            <Droplet className="h-6 w-6 fill-current text-white" />
          </div>
          <span className="text-xl font-black tracking-tighter italic">LifeDonors</span>
        </div>

        <Separator />

        <div className="space-y-2 pb-4">
          <h1 className="text-3xl font-black tracking-tight">Welcome Back</h1>
          <p className="text-muted-foreground font-medium">Sign in to manage your donations and requests.</p>
        </div>
        <Button
          variant={"outline"}
          className="flex h-14 w-full items-center justify-center gap-4 text-lg font-semibold"
          onClick={signInWithGoogle}
        >
          {isGoogleLoading ? (
            <Spinner />
          ) : (
            <>
              <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <title>Google</title>
                <path
                  fill="currentColor"
                  d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                />
              </svg>
              Sign in with Google
            </>
          )}
        </Button>
        <Button
          variant={"outline"}
          className="flex h-14 w-full items-center justify-center gap-4 text-lg font-semibold"
          onClick={signInWithGithub}
        >
          {isGithubLoading ? (
            <Spinner />
          ) : (
            <>
              <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <title>GitHub</title>
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
              Sign in with GitHub
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
