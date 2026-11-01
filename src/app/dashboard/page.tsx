import { PlaceholderPage } from "@/components/placeholder-page";

export const metadata = { title: "Dashboard" };

export default function DashboardPage() {
  return (
    <PlaceholderPage
      title="Dashboard"
      message="Your host and booking overview is coming soon."
      backLabel="Back to Explore Studios"
      backHref="/studios"
    />
  );
}
