import type { Metadata } from "next";
import { StudioForm } from "@/components/studio/studio-form";

export const metadata: Metadata = {
  title: "Add New Studio",
};

export default function AddStudioPage() {
  return <StudioForm />;
}
