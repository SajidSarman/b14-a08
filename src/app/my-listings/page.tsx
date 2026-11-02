import type { Metadata } from "next";
import Link from "next/link";
import { CameraIcon, MapPinIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { API_URL, type Studio } from "@/lib/api";
import { categoryLabel } from "@/lib/categories";

export const metadata: Metadata = {
  title: "My Studio Listings",
};

const DEMO_HOST_EMAIL = "demo@studiospace.com";

async function getMyStudios() {
  const response = await fetch(`${API_URL}/studios`, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(
      `Failed to load studio listings: server responded with ${response.status}`
    );
  }

  const data = (await response.json()) as Studio[] | { studios?: Studio[] };
  const studios = Array.isArray(data) ? data : (data.studios ?? []);
  return studios.filter((studio) => studio.hostEmail === DEMO_HOST_EMAIL);
}

export default async function MyListingsPage() {
  let studios: Studio[];

  try {
    studios = await getMyStudios();
  } catch {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-10 md:px-6 md:py-12">
        <Empty className="rounded-xl border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <CameraIcon />
            </EmptyMedia>
            <EmptyTitle>Can&apos;t load your listings</EmptyTitle>
            <EmptyDescription>
              The studio server isn&apos;t responding right now. Please try again
              soon.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button
              variant="outline"
              nativeButton={false}
              render={<Link href="/my-listings" />}
            >
              Retry
            </Button>
          </EmptyContent>
        </Empty>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 md:px-6 md:py-12">
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight">
            My Studio Listings
          </h1>
          <p className="text-muted-foreground">
            Manage the studios you have listed on StudioSpace.
          </p>
        </div>
        <Button nativeButton={false} render={<Link href="/add-studio" />}>
          Add New Studio
        </Button>
      </header>

      {studios.length === 0 ? (
        <Empty className="rounded-xl border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <CameraIcon />
            </EmptyMedia>
            <EmptyTitle>No studio listings yet</EmptyTitle>
            <EmptyDescription>
              Add your first studio to start managing your spaces here.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button nativeButton={false} render={<Link href="/add-studio" />}>
              Add New Studio
            </Button>
          </EmptyContent>
        </Empty>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {studios.map((studio) => {
            const image = studio.imageUrl ?? studio.images?.[0];

            return (
              <article
                key={studio._id}
                className="flex flex-col overflow-hidden rounded-xl border bg-card"
              >
                <div className="aspect-video overflow-hidden bg-muted">
                  {image ? (
                    <img
                      src={image}
                      alt={studio.title}
                      className="size-full object-cover"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center text-sm text-muted-foreground">
                      No image yet
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-3 p-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {categoryLabel(studio.category)}
                    </p>
                    <h2 className="mt-1 line-clamp-1 font-semibold">
                      {studio.title}
                    </h2>
                  </div>
                  <p className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPinIcon className="size-3.5 shrink-0" />
                    <span className="line-clamp-1">{studio.location}</span>
                  </p>
                  <div className="mt-auto flex items-center justify-between gap-3">
                    <p className="text-sm">
                      <span className="text-lg font-semibold text-primary">
                        ${studio.hourlyRate}
                      </span>
                      <span className="text-muted-foreground"> / hr</span>
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      nativeButton={false}
                      render={
                        <Link href={`/studios/edit/${encodeURIComponent(studio._id)}`} />
                      }
                    >
                      Edit Listing
                    </Button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
