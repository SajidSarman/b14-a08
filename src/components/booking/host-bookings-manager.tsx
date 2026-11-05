"use client";

import * as React from "react";
import Link from "next/link";
import { CalendarDaysIcon } from "lucide-react";
import type { Booking, BookingStatus } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { toast } from "@/components/ui/toast";

function statusClassName(status: BookingStatus) {
  switch (status) {
    case "Pending":
      return "border-amber-200 bg-amber-100 text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300";
    case "Confirmed":
      return "border-green-200 bg-green-100 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-300";
    case "Completed":
      return "border-blue-200 bg-blue-100 text-blue-800 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300";
    case "Cancelled":
      return "border-red-200 bg-red-100 text-red-600 dark:border-red-800 dark:bg-red-950 dark:text-red-300";
  }
}

export function HostBookingsManager({
  initialBookings,
}: {
  initialBookings: Booking[];
}) {
  const [bookings, setBookings] = React.useState(initialBookings);
  const [updatingId, setUpdatingId] = React.useState<string | null>(null);

  async function updateStatus(booking: Booking, status: BookingStatus) {
    setUpdatingId(booking._id);
    try {
      const response = await fetch(
        `/api/host/bookings/${encodeURIComponent(booking._id)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        }
      );

      if (!response.ok) {
        const errorBody = (await response.json().catch(() => null)) as
          | { message?: string }
          | null;
        throw new Error(
          errorBody?.message ?? `Could not update booking (${response.status}).`
        );
      }

      setBookings((current) =>
        current.map((item) =>
          item._id === booking._id ? { ...item, status } : item
        )
      );
      toast.add({
        title: "Booking updated",
        description: `Reservation marked ${status.toLowerCase()}.`,
        type: "success",
      });
    } catch (error) {
      toast.add({
        title: "Could not update booking",
        description:
          error instanceof Error ? error.message : "Please try again.",
        type: "error",
      });
    } finally {
      setUpdatingId(null);
    }
  }

  if (bookings.length === 0) {
    return (
      <Empty className="rounded-xl border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <CalendarDaysIcon />
          </EmptyMedia>
          <EmptyTitle>No reservations for your studios yet</EmptyTitle>
          <EmptyDescription>
            Customer booking requests for your listings will appear here.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button nativeButton={false} render={<Link href="/my-listings" />}>
            Manage my studios
          </Button>
        </EmptyContent>
      </Empty>
    );
  }

  return (
    <div className="grid gap-5 md:grid-cols-2">
      {bookings.map((booking) => (
        <article
          key={booking._id}
          className="overflow-hidden rounded-xl border bg-card"
        >
          <div className="flex items-start justify-between gap-4 p-5">
            <div>
              <h2 className="font-semibold">{booking.studioTitle}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Requested by {booking.customerName} ({booking.customerEmail})
              </p>
            </div>
            <Badge
              variant="outline"
              className={`h-6 shrink-0 px-3 text-sm ${statusClassName(booking.status)}`}
            >
              {booking.status}
            </Badge>
          </div>
          <div className="grid grid-cols-2 gap-4 border-t px-5 py-4 text-sm">
            <div>
              <p className="text-muted-foreground">Date</p>
              <p className="mt-1 font-medium">{booking.date}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Start time</p>
              <p className="mt-1 font-medium">{booking.startTime}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Duration</p>
              <p className="mt-1 font-medium">
                {booking.duration} {booking.duration === 1 ? "hour" : "hours"}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Guests</p>
              <p className="mt-1 font-medium">{booking.guests}</p>
            </div>
          </div>
          <div className="flex items-center justify-between gap-4 border-t px-5 py-4">
            <p className="text-sm">
              Total{" "}
              <span className="font-semibold text-primary">
                ${booking.total}
              </span>
            </p>
            {booking.status === "Pending" && (
              <Button
                size="sm"
                disabled={updatingId !== null}
                onClick={() => updateStatus(booking, "Confirmed")}
              >
                {updatingId === booking._id ? "Updating..." : "Confirm booking"}
              </Button>
            )}
            {booking.status === "Confirmed" && (
              <Button
                size="sm"
                disabled={updatingId !== null}
                onClick={() => updateStatus(booking, "Completed")}
              >
                {updatingId === booking._id ? "Updating..." : "Mark completed"}
              </Button>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
