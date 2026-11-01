"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";

export function NewsletterForm() {
  const [email, setEmail] = React.useState("");
  const [subscribed, setSubscribed] = React.useState(false);

  if (subscribed) {
    return (
      <p role="status" className="text-sm text-muted-foreground">
        Thanks! You are on the list.
      </p>
    );
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        setSubscribed(true);
      }}
      className="flex items-center gap-2"
    >
      <Input
        type="email"
        required
        placeholder="Enter your email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        className="flex-1"
      />
      <Button type="submit" size="icon" aria-label="Subscribe">
        <ArrowRight />
      </Button>
    </form>
  );
}
