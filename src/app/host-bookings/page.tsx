import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { CalendarDaysIcon } from "lucide-react";
import { HostBookingsManager } from "@/components/booking/host-bookings-manager";
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
  title: "Host Bookings",
};

async function HostBookingsContent() {
  const session = await getCurrentSession();
  if (!session) {
    redirect(`/login?callbackURL=${encodeURIComponent("/host-bookings")}`);
  }

  let bookings: Booking[];
  try {
    const response = await fetch(
      `${API_URL}/bookings?hostEmail=${encodeURIComponent(session.user.email)}`,
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
            <EmptyTitle>Couldn&apos;t load host bookings</EmptyTitle>
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
        <h1 className="text-3xl font-semibold tracking-tight">Host Bookings</h1>
        <p className="text-muted-foreground">
          Review reservations for your studios and update their status.
        </p>
      </header>
      <HostBookingsManager initialBookings={bookings} />
    </div>
  );
}

export default function HostBookingsPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto w-full max-w-7xl px-4 py-10 md:px-6 md:py-12">
          <p className="text-sm text-muted-foreground">
            Loading host bookings...
          </p>
        </div>
      }
    >
      <HostBookingsContent />
    </Suspense>
  );
}
