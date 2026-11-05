import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function getBackendAuthHeaders(): Promise<Record<string, string>> {
  const token = await auth.api.getToken({ headers: await headers() });
  if (!token?.token) {
    throw new Error("Could not create an authentication token for the backend.");
  }

  return { Authorization: `Bearer ${token.token}` };
}
