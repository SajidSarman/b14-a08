import Link from "next/link";
import { Button } from "@/components/ui/button";

export function PlaceholderPage({
  title,
  message,
  backHref = "/",
  backLabel = "Back to Home",
}: {
  title: string;
  message: string;
  backHref?: string;
  backLabel?: string;
}) {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-24 text-center">
      <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-3 text-muted-foreground">{message}</p>
      <Button
        variant="outline"
        nativeButton={false}
        className="mt-8"
        render={<Link href={backHref} />}
      >
        {backLabel}
      </Button>
    </div>
  );
}
