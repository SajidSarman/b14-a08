import { PlaceholderPage } from "@/components/placeholder-page";

export const metadata = { title: "My Studio Listings" };

export default function MyListingsPage() {
  return (
    <PlaceholderPage
      title="My Studio Listings"
      message="Manage your listed studios here — coming soon."
      backLabel="Back to Dashboard"
      backHref="/dashboard"
    />
  );
}
