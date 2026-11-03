import Link from "next/link";
import { AudioLinesIcon, ArrowRightIcon, UsersIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AboutUs() {
  return (
    <section
      id="about"
      className="scroll-mt-24"
      aria-labelledby="about-heading"
    >
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-16 md:grid-cols-2 md:px-6 md:py-20">
        <div className="space-y-4">
          <span className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <UsersIcon className="size-5" />
          </span>
          <p className="text-sm font-semibold tracking-wide text-primary uppercase">
            About StudioSpace
          </p>
          <h2
            id="about-heading"
            className="text-3xl font-semibold tracking-tight"
          >
            A better space for every creative.
          </h2>
          <p className="leading-7 text-muted-foreground">
            StudioSpace brings creators and independent studio hosts together.
            We make it easier to discover welcoming, well-equipped spaces for
            photography, film, music, podcasts, and hands-on workshops.
          </p>
        </div>
        <div className="rounded-2xl border bg-card p-6 md:p-8">
          <span className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <AudioLinesIcon className="size-5" />
          </span>
          <h3 className="mt-5 text-2xl font-semibold tracking-tight">
            Have a creative space?
          </h3>
          <p className="mt-2 leading-7 text-muted-foreground">
            Share your studio with creators looking for the right place to bring
            their next project to life.
          </p>
          <Button
            className="mt-5"
            nativeButton={false}
            render={<Link href="/add-studio" />}
          >
            Host Your Space
            <ArrowRightIcon />
          </Button>
        </div>
      </div>
    </section>
  );
}
