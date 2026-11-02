import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import {
  StudiosGrid,
  StudiosGridSkeleton,
} from "@/components/studio/studios-grid";
import { CATEGORIES } from "@/lib/categories";

export const metadata: Metadata = {
  title: "Explore Studios",
};

export default function ExploreStudiosPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 md:px-6 md:py-12">
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight">
            Explore Studios
          </h1>
          <p className="text-muted-foreground">
            Book creative spaces by the hour — shot, sound, podcast, music and
            more.
          </p>
        </div>
        <Button variant="outline" nativeButton={false} render={<Link href="/add-studio" />}>
          Host Your Space
        </Button>
      </header>

      <nav className="mb-8 flex flex-wrap gap-2">
        <Button
          size="sm"
          variant="ghost"
          nativeButton={false}
          render={<Link href="/studios" />}
        >
          All
        </Button>
        {CATEGORIES.map((category) => (
          <Button
            key={category.value}
            size="sm"
            variant="ghost"
            nativeButton={false}
            render={<Link href={`/studios?category=${category.value}`} />}
          >
            {category.label}
          </Button>
        ))}
      </nav>

      <Suspense fallback={<StudiosGridSkeleton />}>
        <StudiosGrid searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
