import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { CalendarDaysIcon } from "lucide-react";
import { MyBookingsManager } from "@/components/booking/my-bookings-manager";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { API_URL, type Booking } from "@/lib/api";
import { getBackendAuthHeaders } from "@/lib/backend-auth";
import { getCurrentSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "My Bookings",
};

async function MyBookingsContent() {
  const session = await getCurrentSession();
  if (!session) {
    redirect(`/login?callbackURL=${encodeURIComponent("/my-bookings")}`);
  }

  let bookings: Booking[];
  try {
    const response = await fetch(
      `${API_URL}/bookings?customerEmail=${encodeURIComponent(session.user.email)}`,
      {
        headers: await getBackendAuthHeaders(),
        cache: "no-store",
      }
    );
    if (!response.ok) {
      throw new Error(`Booking server responded with ${response.status}`);
    }

    const data = (await response.json()) as
      | Booking[]
      | { bookings?: Booking[] };
    bookings = Array.isArray(data) ? data : (data.bookings ?? []);
  } catch {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-10 md:px-6 md:py-12">
        <Empty className="rounded-xl border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <CalendarDaysIcon />
            </EmptyMedia>
            <EmptyTitle>Couldn&apos;t load your bookings</EmptyTitle>
            <EmptyDescription>
              The booking server isn&apos;t responding. Please try again later.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    );
  }

  bookings.sort(
    (first, second) =>
      new Date(first.startAt).getTime() - new Date(second.startAt).getTime()
  );

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 md:px-6 md:py-12">
      <header className="mb-8 space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">My Bookings</h1>
        <p className="text-muted-foreground">
          View your reservation requests and their current status.
        </p>
      </header>
      <MyBookingsManager initialBookings={bookings} />
    </div>
  );
}

export default function MyBookingsPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto w-full max-w-7xl px-4 py-10 md:px-6 md:py-12">
          <p className="text-sm text-muted-foreground">
            Loading your bookings...
          </p>
        </div>
      }
    >
      <MyBookingsContent />
    </Suspense>
  );
}
