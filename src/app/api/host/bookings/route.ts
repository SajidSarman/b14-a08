import { API_URL } from "@/lib/api";
import { getCurrentSession } from "@/lib/session";

export async function GET() {
  const session = await getCurrentSession();
  if (!session) {
    return Response.json({ message: "Authentication required." }, { status: 401 });
  }

  const response = await fetch(
    `${API_URL}/bookings?hostEmail=${encodeURIComponent(session.user.email)}`,
    { cache: "no-store" }
  );

  return new Response(response.body, {
    status: response.status,
    headers: {
      "Content-Type": response.headers.get("Content-Type") ?? "application/json",
    },
  });
}
