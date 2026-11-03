"use client";

import * as React from "react";
import Link from "next/link";
import { CalendarDaysIcon } from "lucide-react";
import type { Booking } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { toast } from "@/components/ui/toast";

function statusClassName(status: Booking["status"]) {
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

export function MyBookingsManager({
  initialBookings,
}: {
  initialBookings: Booking[];
}) {
  const [bookings, setBookings] = React.useState(initialBookings);
  const [bookingToCancel, setBookingToCancel] =
    React.useState<Booking | null>(null);
  const [isCancelling, setIsCancelling] = React.useState(false);
  const [cancelError, setCancelError] = React.useState("");

  const cancelBooking = async () => {
    if (!bookingToCancel) return;

    setIsCancelling(true);
    setCancelError("");
    try {
      const response = await fetch(
        `/api/bookings/${encodeURIComponent(bookingToCancel._id)}`,
        { method: "PATCH" }
      );
      if (!response.ok) {
        const errorBody = (await response.json().catch(() => null)) as
          | { message?: string }
          | null;
        throw new Error(
          errorBody?.message ?? `Cancellation failed (${response.status}).`
        );
      }

      setBookings((current) =>
        current.map((booking) =>
          booking._id === bookingToCancel._id
            ? { ...booking, status: "Cancelled" }
            : booking
        )
      );
      setBookingToCancel(null);
      toast.add({
        title: "Booking cancelled",
        description: "Your pending reservation has been cancelled.",
        type: "success",
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Please try again.";
      setCancelError(message);
      toast.add({
        title: "Could not cancel booking",
        description: message,
        type: "error",
      });
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <>
      {bookings.length === 0 ? (
        <Empty className="rounded-xl border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <CalendarDaysIcon />
            </EmptyMedia>
            <EmptyTitle>No bookings yet</EmptyTitle>
            <EmptyDescription>
              When you request a studio reservation, it will appear here.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button nativeButton={false} render={<Link href="/studios" />}>
              Explore Studios
            </Button>
          </EmptyContent>
        </Empty>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {bookings.map((booking) => (
            <article
              key={booking._id}
              className="overflow-hidden rounded-xl border bg-card"
            >
              <div className="flex items-start justify-between gap-4 p-5">
                <div>
                  <h2 className="font-semibold">{booking.studioTitle}</h2>
                </div>
                <Badge
                  variant="outline"
                  className={`h-6 px-3 text-sm ${statusClassName(booking.status)}`}
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
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      setCancelError("");
                      setBookingToCancel(booking);
                    }}
                  >
                    Cancel Booking
                  </Button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}

      <AlertDialog
        open={bookingToCancel !== null}
        onOpenChange={(open) => {
          if (!open && !isCancelling) {
            setBookingToCancel(null);
            setCancelError("");
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel this booking request?</AlertDialogTitle>
            <AlertDialogDescription>
              Cancel your pending reservation for{" "}
              <span className="font-medium">{bookingToCancel?.studioTitle}</span>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          {cancelError && (
            <p role="alert" className="text-sm text-destructive">
              {cancelError}
            </p>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isCancelling}>
              Keep booking
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={cancelBooking}
              disabled={isCancelling}
            >
              {isCancelling ? "Cancelling..." : "Cancel booking"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
