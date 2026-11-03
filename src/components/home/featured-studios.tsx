import Link from "next/link";
import { CameraIcon } from "lucide-react";
import { StudioCard } from "@/components/studio/studio-card";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { API_URL, type Studio } from "@/lib/api";

async function getFeaturedStudios() {
  const response = await fetch(`${API_URL}/top6studios`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Studio server responded with ${response.status}`);
  }

  const data = (await response.json()) as Studio[] | { studios?: Studio[] };
  const studios = Array.isArray(data) ? data : (data.studios ?? []);

  return studios;
}

export async function FeaturedStudios() {
  let studios: Studio[];

  try {
    studios = await getFeaturedStudios();
  } catch {
    return (
      <Empty className="rounded-xl border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <CameraIcon />
          </EmptyMedia>
          <EmptyTitle>Featured studios are unavailable</EmptyTitle>
          <EmptyDescription>
            The studio server isn&apos;t responding right now. Please try again
            soon.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button
            variant="outline"
            nativeButton={false}
            render={<Link href="/studios" />}
          >
            Browse all studios
          </Button>
        </EmptyContent>
      </Empty>
    );
  }

  if (studios.length === 0) {
    return (
      <Empty className="rounded-xl border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <CameraIcon />
          </EmptyMedia>
          <EmptyTitle>No studios listed yet</EmptyTitle>
          <EmptyDescription>
            Check back soon or be the first to host a creative space.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button nativeButton={false} render={<Link href="/add-studio" />}>
            Host Your Space
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
