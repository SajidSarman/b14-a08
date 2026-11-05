import Link from "next/link";
import { CameraIcon, ClapperboardIcon, Music2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[65vh] w-full max-w-3xl flex-col items-center justify-center px-4 py-16 text-center">
      <div
        aria-hidden="true"
        className="relative mb-8 flex size-48 items-center justify-center rounded-full bg-primary/10"
      >
        <div className="absolute -top-1 left-4 rounded-xl border bg-card p-3 text-primary shadow-sm">
          <ClapperboardIcon className="size-7" />
        </div>
        <div className="rounded-2xl border bg-card p-6 text-primary shadow-md">
          <CameraIcon className="size-16" strokeWidth={1.4} />
        </div>
        <div className="absolute right-2 bottom-1 rounded-xl border bg-card p-3 text-primary shadow-sm">
          <Music2Icon className="size-7" />
        </div>
      </div>
      <p className="text-4xl font-semibold tracking-widest text-primary uppercase">
       - 404 -
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
        This space isn&apos;t on the map
      </h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        The page you&apos;re looking for may have moved or doesn&apos;t exist.
        Let&apos;s get you back to the studios.
      </p>
      <Button className="mt-7" nativeButton={false} render={<Link href="/" />}>
        Return to Home
      </Button>
    </main>
  );
}
