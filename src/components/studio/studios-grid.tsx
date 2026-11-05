import Link from "next/link";
import { StudioCard } from "@/components/studio/studio-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { CameraIcon } from "lucide-react";
import { categoryLabel } from "@/lib/categories";
import { fetchStudios } from "@/lib/api";

export function StudiosGridSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="rounded-xl border">
          <Skeleton className="aspect-video rounded-b-none" />
          <div className="space-y-3 p-4">
            <div className="flex justify-between">
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-5 w-10" />
            </div>
            <Skeleton className="h-4 w-1/2" />
            <div className="flex justify-between">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-8 w-24" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export async function StudiosGrid({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;

  let studios;
  try {
    studios = await fetchStudios(category);
  } catch {
    return (
      <Empty className="border rounded-xl">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <CameraIcon />
          </EmptyMedia>
          <EmptyTitle>Can&apos;t load studios</EmptyTitle>
          <EmptyDescription>
            The studio server isn&apos;t responding right now. Please try again soon.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button variant="outline" nativeButton={false} render={<Link href="/studios" />}>
            Retry
          </Button>
        </EmptyContent>
      </Empty>
    );
  }

  if (studios.length === 0) {
    return (
      <Empty className="border rounded-xl">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <CameraIcon />
          </EmptyMedia>
          <EmptyTitle>
            {category
              ? `No ${categoryLabel(category).toLowerCase()} listings yet`
              : "No studios listed yet"}
          </EmptyTitle>
          <EmptyDescription>
            {category
              ? "Try browsing all studios or check back soon."
              : "Be the first host on StudioSpace!"}
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button
            nativeButton={false}
            render={<Link href={category ? "/studios" : "/add-studio"} />}
          >
            {category ? "Browse all studios" : "Host your space"}
          </Button>
        </EmptyContent>
      </Empty>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {studios.map((studio) => (
        <StudioCard key={studio._id} studio={studio} />
      ))}
    </div>
  );
}
