import { PlaceholderPage } from "@/components/placeholder-page";

export const metadata = { title: "My Bookings" };

export default function MyBookingsPage() {
  return (
    <PlaceholderPage
      title="My Bookings"
      message="Your upcoming and past bookings are coming soon."
      backLabel="Back to Dashboard"
      backHref="/dashboard"
    />
  );
}
