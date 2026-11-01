"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type AuthFormProps = {
  mode: "login" | "register";
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

export function AuthForm({ mode }: AuthFormProps) {
  const config = CONFIG[mode];

  return (
    <div className="mx-auto w-full max-w-sm px-4 py-16 md:py-24">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">{config.title}</h1>
        <p className="text-sm text-muted-foreground">{config.subtitle}</p>
      </div>

      <form
        className="mt-8 grid gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          // TODO: wire to login/register server actions once MongoDB is set up
        }}
      >
        {mode === "register" ? (
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" placeholder="Jane Doe" required />
          </div>
        ) : null}
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="jane@example.com"
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            minLength={8}
            required
          />
        </div>
        <Button type="submit" className="w-full">
          {config.submit}
        </Button>
      </form>

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
