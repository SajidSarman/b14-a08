import { API_URL } from "@/lib/api";
import { getCurrentSession } from "@/lib/session";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getCurrentSession();
  if (!session) {
    return Response.json({ message: "Authentication required." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ message: "Request body must be valid JSON." }, { status: 400 });
  }

  if (
    typeof body !== "object" ||
    body === null ||
    !("status" in body) ||
    typeof body.status !== "string" ||
    (body.status !== "Confirmed" && body.status !== "Completed")
  ) {
    return Response.json(
      { message: "Choose Confirmed or Completed as the booking status." },
      { status: 400 }
    );
  }

  const { id } = await params;
  const response = await fetch(
    `${API_URL}/bookings/${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        hostEmail: session.user.email,
        status: body.status,
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
