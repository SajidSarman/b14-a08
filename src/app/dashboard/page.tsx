import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import {
  ArrowRightIcon,
  Building2Icon,
  CalendarCheckIcon,
  CalendarDaysIcon,
  CameraIcon,
  MapPinIcon,
  PlusIcon,
} from "lucide-react";
import { redirect } from "next/navigation";
import { PageLoading } from "@/components/page-loading";
import { API_URL, type Studio } from "@/lib/api";
import { getBackendAuthHeaders } from "@/lib/backend-auth";
import { getCurrentSession } from "@/lib/session";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export const metadata: Metadata = {
  title: "Dashboard",
};

async function getOwnerStudios(ownerEmail: string) {
  const response = await fetch(`${API_URL}/studios`, {
    headers: await getBackendAuthHeaders(),
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(`Studio server responded with ${response.status}`);
  }

  const data = (await response.json()) as Studio[] | { studios?: Studio[] };
  const studios = Array.isArray(data) ? data : (data.studios ?? []);
  return studios.filter(
    (studio) => (studio.ownerEmail ?? studio.hostEmail) === ownerEmail
  );
}

async function DashboardContent() {
  const session = await getCurrentSession();
  if (!session) {
    redirect(`/login?callbackURL=${encodeURIComponent("/dashboard")}`);
  }

  let studios: Studio[] = [];
  let studiosUnavailable = false;

  try {
    studios = await getOwnerStudios(session.user.email);
  } catch {
    studiosUnavailable = true;
  }

  const displayName = session.user.name.trim().split(/\s+/)[0] || "there";

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 md:px-6 md:py-12">
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">
            Host dashboard
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">
            Welcome, {displayName}
          </h1>
          <p className="text-muted-foreground">
            Manage your creative spaces and keep track of your activity.
          </p>
        </div>
        <Button nativeButton={false} render={<Link href="/add-studio" />}>
          <PlusIcon />
          Add New Studio
        </Button>
      </header>

      <section
        aria-label="Dashboard overview"
        className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <Card>
          <CardHeader>
            <CardDescription>Your listings</CardDescription>
            <CardTitle className="flex items-center justify-between text-3xl">
              {studiosUnavailable ? "—" : studios.length}
              <Building2Icon className="size-5 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              variant="link"
              className="h-auto p-0"
              nativeButton={false}
              render={<Link href="/my-listings" />}
            >
              Manage listings <ArrowRightIcon />
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Manage reservations for your listings</CardDescription>
            <CardTitle className="flex items-center justify-between text-xl">
              Host bookings
              <CalendarDaysIcon className="size-5 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Review requests and confirm completed studio sessions.
            </CardDescription>
            <Button
              variant="link"
              className="mt-2 h-auto p-0"
              nativeButton={false}
              render={<Link href="/host-bookings" />}
            >
              Manage host bookings <ArrowRightIcon />
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Your reservations</CardDescription>
            <CardTitle className="flex items-center justify-between text-xl">
              My bookings
              <CalendarCheckIcon className="size-5 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Check your booking requests and their current status.
            </CardDescription>
            <Button
              variant="link"
              className="mt-2 h-auto p-0"
              nativeButton={false}
              render={<Link href="/my-bookings" />}
            >
              View my bookings <ArrowRightIcon />
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Discover more spaces</CardDescription>
            <CardTitle className="flex items-center justify-between text-xl">
              Explore studios
              <CameraIcon className="size-5 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              variant="link"
              className="h-auto p-0"
              nativeButton={false}
              render={<Link href="/studios" />}
            >
              Browse studios <ArrowRightIcon />
            </Button>
          </CardContent>
        </Card>
      </section>

      <section aria-labelledby="recent-listings-heading">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h2
              id="recent-listings-heading"
              className="text-xl font-semibold tracking-tight"
            >
              Your recent listings
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Quick access to your latest studio spaces.
            </p>
          </div>
          <Button
            variant="outline"
            nativeButton={false}
            render={<Link href="/my-listings" />}
          >
            View all
          </Button>
        </div>

        {studiosUnavailable ? (
          <Empty className="rounded-xl border">
            <EmptyHeader>
              <EmptyTitle>Couldn&apos;t load your listings</EmptyTitle>
              <EmptyDescription>
                The studio server isn&apos;t responding. You can try again or
                manage your listings later.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button
                variant="outline"
                nativeButton={false}
                render={<Link href="/dashboard" />}
              >
                Try again
              </Button>
            </EmptyContent>
          </Empty>
        ) : studios.length === 0 ? (
          <Empty className="rounded-xl border">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Building2Icon />
              </EmptyMedia>
              <EmptyTitle>No studio listings yet</EmptyTitle>
              <EmptyDescription>
                Add your first studio listing to start hosting on StudioSpace.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button nativeButton={false} render={<Link href="/add-studio" />}>
                Add New Studio
              </Button>
            </EmptyContent>
          </Empty>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {studios.slice(0, 3).map((studio) => {
              const image = studio.imageUrl ?? studio.images?.[0];
              return (
                <article
                  key={studio._id}
                  className="overflow-hidden rounded-xl border bg-card"
                >
                  {image ? (
                    <img
                      src={image}
                      alt={studio.title}
                      className="aspect-video w-full object-cover"
                    />
                  ) : (
                    <div className="flex aspect-video items-center justify-center bg-muted text-sm text-muted-foreground">
                      No image yet
                    </div>
                  )}
                  <div className="space-y-3 p-4">
                    <div>
                      <h3 className="line-clamp-1 font-semibold">
                        {studio.title}
                      </h3>
                      <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPinIcon className="size-3.5 shrink-0" />
                        <span className="line-clamp-1">{studio.location}</span>
                      </p>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm">
                        <span className="font-semibold text-primary">
                          ${studio.hourlyRate}
                        </span>
                        <span className="text-muted-foreground"> / hr</span>
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        nativeButton={false}
                        render={
                          <Link
                            href={`/studios/edit/${encodeURIComponent(studio._id)}`}
                          />
                        }
                      >
                        Update
                      </Button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={<PageLoading label="Loading your dashboard" />}
    >
      <DashboardContent />
    </Suspense>
  );
}
