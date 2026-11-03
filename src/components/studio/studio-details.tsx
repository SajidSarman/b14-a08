"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { categoryLabel } from "@/lib/categories";
import type { Studio } from "@/lib/api";
import { toast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";
import {
  CalendarDaysIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Clock3Icon,
  DollarSignIcon,
  MailIcon,
  MapPinIcon,
  UsersIcon,
  StarIcon,
} from "lucide-react";

function getGalleryImages(studio: Studio) {
  return [...new Set([...(studio.images ?? []), studio.imageUrl].filter(Boolean))] as string[];
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function StudioDetails({ studio }: { studio: Studio }) {
  const router = useRouter();
  const images = getGalleryImages(studio);
  const [activeImage, setActiveImage] = React.useState(0);
  const [bookingOpen, setBookingOpen] = React.useState(false);
  const [bookingError, setBookingError] = React.useState("");
  const [duration, setDuration] = React.useState(2);
  const [isBooking, setIsBooking] = React.useState(false);
  const hostName = studio.hostName || "Studio host";
  const estimatedTotal = studio.hourlyRate * duration;

  async function submitBooking(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBookingError("");

    const formData = new FormData(event.currentTarget);
    const date = String(formData.get("date") ?? "");
    const startTime = String(formData.get("startTime") ?? "");
    const guests = Number(formData.get("guests"));
    const startDate = new Date(`${date}T${startTime}`);

    if (Number.isNaN(startDate.getTime()) || startDate.getTime() <= Date.now()) {
      setBookingError("Choose a booking time in the future.");
      return;
    }

    setIsBooking(true);
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studioId: studio._id,
          date,
          startTime,
          startAt: startDate.toISOString(),
          duration,
          guests,
        }),
      });

      if (!response.ok) {
        const errorBody = (await response.json().catch(() => null)) as
          | { message?: string }
          | null;
        throw new Error(
          errorBody?.message ?? `Booking request failed (${response.status}).`
        );
      }

      toast.add({
        title: "Booking requested",
        description: "Your reservation is pending host confirmation.",
        type: "success",
      });
      setBookingOpen(false);
      router.push("/my-bookings");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Please try again.";
      setBookingError(message);
      toast.add({
        title: "Could not request booking",
        description: message,
        type: "error",
      });
    } finally {
      setIsBooking(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 md:px-6 md:py-12">
      <header className="mb-6 space-y-3">
        <Badge variant="secondary">{categoryLabel(studio.category)}</Badge>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
              {studio.title}
            </h1>
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPinIcon className="size-4 shrink-0" />
              {studio.location}
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <StarIcon className="size-4 fill-current text-amber-500" />
            {studio.rating ? (
              <span className="font-medium">{studio.rating.toFixed(1)}</span>
            ) : (
              <span className="font-medium">New listing</span>
            )}
            <span className="text-muted-foreground">· {studio.reviewCount ?? 0} reviews</span>
          </div>
        </div>
      </header>

      <section aria-label="Studio photo gallery" className="mb-10">
        <div className="relative overflow-hidden rounded-2xl bg-muted">
          {images.length > 0 ? (
            <img
              src={images[activeImage]}
              alt={`${studio.title} — photo ${activeImage + 1}`}
              className="aspect-[16/9] max-h-[400px] w-full object-cover"
            />
          ) : (
            <div className="flex aspect-[16/9] max-h-[400px] items-center justify-center bg-gradient-to-br from-muted to-secondary text-sm text-muted-foreground">
              Photos coming soon
            </div>
          )}
          {images.length > 1 && (
            <>
              <Button
                type="button"
                variant="secondary"
                size="icon"
                aria-label="Previous photo"
                className="absolute top-1/2 left-3 -translate-y-1/2 rounded-full bg-background/90 shadow"
                onClick={() =>
                  setActiveImage((current) => (current - 1 + images.length) % images.length)
                }
              >
                <ChevronLeftIcon />
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="icon"
                aria-label="Next photo"
                className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full bg-background/90 shadow"
                onClick={() => setActiveImage((current) => (current + 1) % images.length)}
              >
                <ChevronRightIcon />
              </Button>
              <span className="absolute right-4 bottom-4 rounded-full bg-black/65 px-3 py-1 text-xs text-white">
                {activeImage + 1} / {images.length}
              </span>
            </>
          )}
        </div>
        {images.length > 1 && (
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {images.map((image, index) => (
              <button
                key={image}
                type="button"
                aria-label={`Show photo ${index + 1}`}
                aria-pressed={activeImage === index}
                onClick={() => setActiveImage(index)}
                className={`shrink-0 overflow-hidden rounded-lg border-2 ${
                  activeImage === index ? "border-primary" : "border-transparent"
                }`}
              >
                <img
                  src={image}
                  alt=""
                  className="size-16 object-cover sm:size-20"
                />
              </button>
            ))}
          </div>
        )}
      </section>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-10">
          <section aria-labelledby="overview-heading" className="space-y-4">
            <h2 id="overview-heading" className="text-xl font-semibold">
              About this space
            </h2>
            <p className="leading-7 text-muted-foreground">
              {studio.overview || "The host hasn’t added a description yet."}
            </p>
          </section>

          <section aria-labelledby="specifications-heading" className="space-y-4">
            <h2 id="specifications-heading" className="text-xl font-semibold">
              Workspace specifications
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <Specification
                icon={<Clock3Icon />}
                label="Hourly rate"
                value={`$${studio.hourlyRate} / hour`}
              />
              <Specification
                icon={<UsersIcon />}
                label="Maximum capacity"
                value={studio.maxCapacity ? `${studio.maxCapacity} people` : "Not specified"}
              />
              <Specification
                icon={<MapPinIcon />}
                label="Location"
                value={studio.location}
              />
              <Specification
                icon={<DollarSignIcon />}
                label="Security deposit"
                value={`$${studio.securityDeposit ?? 0}`}
              />
            </div>
          </section>

          <section aria-labelledby="amenities-heading" className="space-y-4">
            <h2 id="amenities-heading" className="text-xl font-semibold">
              What this space offers
            </h2>
            {studio.amenities?.length ? (
              <ul className="grid gap-3 sm:grid-cols-2">
                {studio.amenities.map((amenity) => (
                  <li key={amenity} className="flex items-center gap-3 text-sm">
                    <CheckIcon className="size-4 text-primary" />
                    {amenity}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                The host hasn’t listed any amenities yet.
              </p>
            )}
          </section>

          <section aria-labelledby="host-heading" className="space-y-4 border-t pt-8">
            <h2 id="host-heading" className="text-xl font-semibold">
              Meet your host
            </h2>
            <div className="flex items-center gap-4">
              <div className="flex size-14 items-center justify-center rounded-full bg-secondary text-lg font-semibold">
                {getInitials(hostName) || "H"}
              </div>
              <div className="min-w-0">
                <p className="font-medium">{hostName}</p>
                <p className="text-sm text-muted-foreground">Studio host</p>
                {studio.hostEmail && (
                  <a
                    className="mt-1 inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
                    href={`mailto:${studio.hostEmail}`}
                  >
                    <MailIcon className="size-3.5" />
                    Contact host
                  </a>
                )}
              </div>
            </div>
          </section>

          <section aria-labelledby="reviews-heading" className="space-y-4 border-t pt-8">
            <h2 id="reviews-heading" className="text-xl font-semibold">
              Reviews
            </h2>
            {studio.rating ? (
              <p className="flex items-center gap-2 text-sm">
                <StarIcon className="size-4 fill-current text-amber-500" />
                <span className="font-medium">{studio.rating.toFixed(1)}</span>
                <span className="text-muted-foreground">
                  from {studio.reviewCount ?? 0} reviews
                </span>
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                This space hasn’t received any reviews yet.
              </p>
            )}
          </section>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border bg-card p-5 shadow-sm">
            <p className="text-2xl font-semibold">
              ${studio.hourlyRate}
              <span className="text-sm font-normal text-muted-foreground"> / hour</span>
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {studio.securityDeposit
                ? `$${studio.securityDeposit} security deposit`
                : "No security deposit listed"}
            </p>
            <Button
              type="button"
              className="mt-5 w-full"
              onClick={() => {
                setBookingError("");
                setBookingOpen(true);
              }}
            >
              Book Workspace Now
            </Button>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              You won’t be charged yet
            </p>
          </div>
        </aside>
      </div>

      <Dialog open={bookingOpen} onOpenChange={setBookingOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Request to book</DialogTitle>
            <DialogDescription>
              Choose your preferred date and hours at {studio.title}.
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={submitBooking}>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium">
                Date
                <Input name="date" type="date" required />
              </label>
              <label className="grid gap-2 text-sm font-medium">
                Start time
                <Input name="startTime" type="time" required />
              </label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium">
                Duration
                <select
                  className="h-9 rounded-lg border border-input bg-background px-3 text-sm"
                  value={duration}
                  onChange={(event) => setDuration(Number(event.target.value))}
                >
                  {[1, 2, 3, 4, 5, 6, 8].map((hours) => (
                    <option key={hours} value={hours}>
                      {hours} {hours === 1 ? "hour" : "hours"}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2 text-sm font-medium">
                Guests
                <Input
                  name="guests"
                  type="number"
                  min={1}
                  max={studio.maxCapacity}
                  defaultValue={1}
                  required
                />
              </label>
            </div>
            <div className="rounded-xl bg-muted p-4">
              <div className="flex items-center justify-between text-sm">
                <span>${studio.hourlyRate} × {duration} {duration === 1 ? "hour" : "hours"}</span>
                <span>${estimatedTotal}</span>
              </div>
              {studio.securityDeposit ? (
                <div className="mt-2 flex items-center justify-between text-sm text-muted-foreground">
                  <span>Refundable security deposit</span>
                  <span>${studio.securityDeposit}</span>
                </div>
              ) : null}
              <div className="mt-3 flex items-center justify-between border-t pt-3 font-semibold">
                <span>Estimated total</span>
                <span>${estimatedTotal + (studio.securityDeposit ?? 0)}</span>
              </div>
            </div>
            {bookingError && (
              <p role="alert" className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {bookingError}
              </p>
            )}
            <DialogFooter>
              <Button
                type="submit"
                className="w-full sm:w-auto"
                disabled={isBooking}
              >
                <CalendarDaysIcon />
                {isBooking ? "Sending request..." : "Request booking"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Specification({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-3 rounded-xl border p-4">
      <span className="mt-0.5 text-muted-foreground [&_svg]:size-4">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="mt-1 break-words text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}
