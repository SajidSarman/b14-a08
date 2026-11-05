import { LoaderCircleIcon } from "lucide-react";
import { Logo } from "@/components/logo";

export function PageLoading({ label = "Loading page" }: { label?: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="mx-auto flex min-h-[50vh] w-full max-w-7xl flex-col items-center justify-center gap-4 px-4 py-12"
    >
      <Logo />
      <LoaderCircleIcon className="size-6 animate-spin text-primary" />
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
  );
}
