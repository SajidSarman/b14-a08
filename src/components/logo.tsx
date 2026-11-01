import Link from "next/link";
import { Aperture } from "lucide-react";
import { cn } from "cn";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "flex items-center gap-2 text-lg font-semibold tracking-tight",
        className
      )}
    >
      <Aperture className="size-6 text-primary" strokeWidth={1.75} />
      StudioSpace
    </Link>
  );
}
