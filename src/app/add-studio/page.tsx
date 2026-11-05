import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { PageLoading } from "@/components/page-loading";
import { StudioForm } from "@/components/studio/studio-form";
import { getCurrentSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "Add New Studio",
};

async function AddStudioContent() {
  const session = await getCurrentSession();
  if (!session) {
    redirect(`/login?callbackURL=${encodeURIComponent("/add-studio")}`);
  }

  return (
    <StudioForm
      user={{
        name: session.user.name,
        email: session.user.email,
      }}
    />
  );
}

export default function AddStudioPage() {
  return (
    <Suspense
      fallback={<PageLoading label="Preparing your studio form" />}
    >
      <AddStudioContent />
    </Suspense>
  );
}
