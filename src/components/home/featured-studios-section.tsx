import Link from "next/link";
import { Suspense } from "react";
import { ArrowRightIcon } from "lucide-react";
import { FeaturedStudios } from "@/components/home/featured-studios";
import { StudiosGridSkeleton } from "@/components/studio/studios-grid";
import { Button } from "@/components/ui/button";

export function FeaturedStudiosSection() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-16 md:px-6 md:py-20">
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-semibold tracking-wide text-primary uppercase">
            Handpicked for you
          </p>
          <h2 className="text-3xl font-semibold tracking-tight">
            Featured studios
          </h2>
          <p className="max-w-2xl text-muted-foreground">
            Explore standout creative spaces, selected from the latest listings
            and top-rated studios.
          </p>
        </div>
        <Button
          variant="outline"
          nativeButton={false}
          render={<Link href="/studios" />}
        >
          View all studios
          <ArrowRightIcon />
        </Button>
      </div>
      <Suspense fallback={<StudiosGridSkeleton />}>
        <FeaturedStudios />
      </Suspense>
    </section>
  );
}
