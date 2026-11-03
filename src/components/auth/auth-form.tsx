"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toast";
import { authClient } from "@/lib/auth-client";

import { FaGoogle } from "react-icons/fa";

type AuthFormProps = {
  mode: "login" | "register";
  googleEnabled: boolean;
};

const CONFIG = {
  login: {
    title: "Welcome back",
    subtitle: "Log in to book studios and manage your listings.",
    submit: "Login",
    footer: { prompt: "Don't have an account?", href: "/register", cta: "Register" },
  },
  register: {
    title: "Create your account",
    subtitle: "Join StudioSpace to book and host studio spaces.",
    submit: "Register",
    footer: { prompt: "Already have an account?", href: "/login", cta: "Login" },
  },
} as const;

function getCallbackPath() {
  const callbackURL = new URLSearchParams(window.location.search).get(
    "callbackURL"
  );
  if (
    !callbackURL?.startsWith("/") ||
    callbackURL.startsWith("//") ||
    callbackURL.includes("\\")
  ) {
    return "/";
  }
  return callbackURL;
}

export function AuthForm({ mode, googleEnabled }: AuthFormProps) {
  const config = CONFIG[mode];
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formError, setFormError] = React.useState("");
  const [passwordError, setPasswordError] = React.useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");
    setPasswordError("");

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    if (mode === "register") {
      const passwordProblem =
        password.length < 6
          ? "Password must be at least 6 characters."
          : !/[A-Z]/.test(password)
            ? "Password must include at least one uppercase letter."
            : !/[a-z]/.test(password)
              ? "Password must include at least one lowercase letter."
              : "";

      if (passwordProblem) {
        setPasswordError(passwordProblem);
        return;
      }
    }

    setIsSubmitting(true);

    try {
      if (mode === "register") {
        const name = String(formData.get("name") ?? "").trim();
        const image = String(formData.get("image") ?? "").trim();
        const { error } = await authClient.signUp.email({
          name,
          email,
          password,
          ...(image ? { image } : {}),
        });

        if (error) {
          throw new Error(error.message);
        }

        toast.add({
          title: "Account created",
          description: "You can now log in with your email and password.",
          type: "success",
        });
        router.push("/login");
        return;
      }

      const { error } = await authClient.signIn.email({ email, password });
      if (error) {
        throw new Error(error.message);
      }

      router.replace(getCallbackPath());
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.";
      setFormError(message);
      toast.add({
        title: mode === "login" ? "Login failed" : "Registration failed",
        description: message,
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!googleEnabled) return;

    setFormError("");
    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: new URL(getCallbackPath(), window.location.origin).toString(),
      });
      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Google sign-in failed. Please try again.";
      setFormError(message);
      toast.add({
        title: "Google sign-in failed",
        description: message,
        type: "error",
      });
    }
  };

  return (
    <div className="mx-auto w-full max-w-sm px-4 py-16 md:py-24">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">{config.title}</h1>
        <p className="text-sm text-muted-foreground">{config.subtitle}</p>
      </div>

      <form className="mt-8 grid gap-4" onSubmit={handleSubmit}>
        {mode === "register" && (
          <>
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                autoComplete="name"
                placeholder="Jane Doe"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="image">Photo URL</Label>
              <Input
                id="image"
                name="image"
                type="url"
                autoComplete="url"
                placeholder="https://example.com/photo.jpg"
              />
            </div>
          </>
        )}

        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="jane@example.com"
            required
          />
        </div>

        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            {mode === "login" && (
              <button
                type="button"
                className="text-sm text-primary hover:underline"
                onClick={() =>
                  toast.add({
                    title: "Password reset unavailable",
                    description:
                      "Password reset is not set up for this application yet.",
                    type: "info",
                  })
                }
              >
                Forgot password?
              </button>
            )}
          </div>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete={
              mode === "login" ? "current-password" : "new-password"
            }
            required
            aria-invalid={Boolean(passwordError)}
            aria-describedby={passwordError ? "password-error" : undefined}
          />
          {mode === "register" && (
            <p className="text-xs text-muted-foreground">
              Use at least 6 characters, including uppercase and lowercase
              letters.
            </p>
          )}
          {passwordError && (
            <p id="password-error" role="alert" className="text-sm text-destructive">
              {passwordError}
            </p>
          )}
        </div>

        {formError && (
          <p role="alert" className="text-sm text-destructive">
            {formError}
          </p>
        )}

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Please wait..." : config.submit}
        </Button>
      </form>

      <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        OR
        <span className="h-px flex-1 bg-border" />
      </div>
      <Button
        type="button"
        variant="outline"
        className="w-full"
        disabled={!googleEnabled || isSubmitting}
        onClick={handleGoogleSignIn}
      >
        {/* <span aria-hidden="true" className="font-bold text-base text-[#4285F4]">
          G
        </span> */}
        <FaGoogle className="size-4 shrink-0" />
        {googleEnabled ? "Continue with Google" : "Google sign-in unavailable"}
      </Button>
      {!googleEnabled && (
        <p className="mt-2 text-center text-xs text-muted-foreground">
          Google sign-in needs OAuth credentials configured by the site owner.
        </p>
      )}

      <p className="mt-6 text-center text-sm text-muted-foreground">
        {config.footer.prompt}{" "}
        <Link
          href={config.footer.href}
          className="font-medium text-primary hover:underline"
        >
          {config.footer.cta}
        </Link>
      </p>
    </div>
  );
}
