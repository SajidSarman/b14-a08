import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import { EditStudioForm } from "@/components/studio/edit-studio-form";
import { PageLoading } from "@/components/page-loading";
import { API_URL, type Studio } from "@/lib/api";
import { getBackendAuthHeaders } from "@/lib/backend-auth";
import { getCurrentSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "Edit Studio",
};

async function EditStudioContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getCurrentSession();
  if (!session) {
    redirect(
      `/login?callbackURL=${encodeURIComponent(`/studios/edit/${id}`)}`
    );
  }

  const response = await fetch(
    `${API_URL}/studios/${encodeURIComponent(id)}`,
    {
      headers: await getBackendAuthHeaders(),
      cache: "no-store",
    }
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
  if ((studio.ownerEmail ?? studio.hostEmail) !== session.user.email) {
    notFound();
  }

  return <EditStudioForm studio={studio} />;
}

export default function EditStudioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={<PageLoading label="Loading studio" />}
    >
      <EditStudioContent params={params} />
    </Suspense>
  );
}
