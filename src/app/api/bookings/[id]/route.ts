import { API_URL } from "@/lib/api";
import { getBackendAuthHeaders } from "@/lib/backend-auth";
import { getCurrentSession } from "@/lib/session";

export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getCurrentSession();
  if (!session) {
    return Response.json({ message: "Authentication required." }, { status: 401 });
  }

  const { id } = await params;
  const response = await fetch(
    `${API_URL}/bookings/${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      headers: {
        ...(await getBackendAuthHeaders()),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customerEmail: session.user.email,
        status: "Cancelled",
      }),
      cache: "no-store",
    }
  );

  return new Response(response.body, {
    status: response.status,
    headers: {
      "Content-Type": response.headers.get("Content-Type") ?? "application/json",
    },
  });
}
