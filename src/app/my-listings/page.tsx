import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { CameraIcon } from "lucide-react";
import { MyListingsManager } from "@/components/studio/my-listings-manager";
import { API_URL, type Studio } from "@/lib/api";
import { getCurrentSession } from "@/lib/session";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "My Studio Listings",
};

async function getMyStudios(ownerEmail: string) {
  const response = await fetch(`${API_URL}/studios`, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(
      `Failed to load studio listings: server responded with ${response.status}`
    );
  }

  const data = (await response.json()) as Studio[] | { studios?: Studio[] };
  const studios = Array.isArray(data) ? data : (data.studios ?? []);
  return studios.filter(
    (studio) =>
      (studio.ownerEmail ?? studio.hostEmail) === ownerEmail
  );
}

async function MyListingsContent() {
  const session = await getCurrentSession();
  if (!session) {
    redirect(`/login?callbackURL=${encodeURIComponent("/my-listings")}`);
  }

  let studios: Studio[];

  try {
    studios = await getMyStudios(session.user.email);
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

      <MyListingsManager initialStudios={studios} />
    </div>
  );
}

export default function MyListingsPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto w-full max-w-7xl px-4 py-10 md:px-6 md:py-12">
          <p className="text-sm text-muted-foreground">Loading your listings...</p>
        </div>
      }
    >
      <MyListingsContent />
    </Suspense>
  );
}
