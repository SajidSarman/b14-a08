import { notFound } from "next/navigation";
import { StudioDetails } from "@/components/studio/studio-details";
import { API_URL, type Studio } from "@/lib/api";

export default async function StudioDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const response = await fetch(
    `${API_URL}/studios/${encodeURIComponent(id)}`,
    { cache: "no-store" }
  );

  if (response.status === 404) {
    notFound();
  }

  if (!response.ok) {
    throw new Error(
      `Failed to load studio: server responded with ${response.status}`
    );
  }

  const studio = (await response.json()) as Studio;

  return <StudioDetails studio={studio} />;
}
