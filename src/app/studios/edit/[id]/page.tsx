import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EditStudioForm } from "@/components/studio/edit-studio-form";
import { API_URL, type Studio } from "@/lib/api";

export const metadata: Metadata = {
  title: "Edit Studio",
};

export default async function EditStudioPage({
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
      `Failed to load studio for editing: server responded with ${response.status}`
    );
  }

  const studio = (await response.json()) as Studio;

  return <EditStudioForm studio={studio} />;
}
