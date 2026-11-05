import { API_URL, type Studio } from "@/lib/api";
import { getBackendAuthHeaders } from "@/lib/backend-auth";
import { getCurrentSession } from "@/lib/session";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function forwardResponse(response: Response) {
  return new Response(response.body, {
    status: response.status,
    headers: {
      "Content-Type": response.headers.get("Content-Type") ?? "application/json",
    },
  });
}

export async function GET() {
  const session = await getCurrentSession();
  if (!session) {
    return Response.json({ message: "Authentication required." }, { status: 401 });
  }

  const response = await fetch(
    `${API_URL}/bookings?customerEmail=${encodeURIComponent(session.user.email)}`,
    {
      headers: await getBackendAuthHeaders(),
      cache: "no-store",
    }
  );
  return forwardResponse(response);
}

export async function POST(request: Request) {
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
  if (!isRecord(body)) {
    return Response.json({ message: "Request body must be an object." }, { status: 400 });
  }

  const { studioId, date, startTime, startAt, duration, guests } = body;
  if (
    typeof studioId !== "string" ||
    typeof date !== "string" ||
    typeof startTime !== "string" ||
    typeof startAt !== "string" ||
    !Number.isInteger(duration) ||
    !Number.isInteger(guests) ||
    Number(duration) < 1 ||
    Number(duration) > 24 ||
    Number(guests) < 1
  ) {
    return Response.json({ message: "Please provide valid booking details." }, { status: 400 });
  }

  const startDate = new Date(startAt);
  if (Number.isNaN(startDate.getTime()) || startDate.getTime() <= Date.now()) {
    return Response.json(
      { message: "Choose a booking time in the future." },
      { status: 400 }
    );
  }

  const studioResponse = await fetch(
    `${API_URL}/studios/${encodeURIComponent(studioId)}`,
    {
      headers: await getBackendAuthHeaders(),
      cache: "no-store",
    }
  );
  if (studioResponse.status === 404) {
    return Response.json({ message: "Studio not found." }, { status: 404 });
  }
  if (!studioResponse.ok) {
    return Response.json(
      { message: `Studio server responded with ${studioResponse.status}.` },
      { status: 502 }
    );
  }

  const studio = (await studioResponse.json()) as Studio;
  if (studio.maxCapacity && Number(guests) > studio.maxCapacity) {
    return Response.json(
      { message: `This studio allows up to ${studio.maxCapacity} guests.` },
      { status: 400 }
    );
  }

  const endAt = new Date(
    startDate.getTime() + Number(duration) * 60 * 60 * 1000
  ).toISOString();
  const response = await fetch(`${API_URL}/bookings`, {
    method: "POST",
    headers: {
      ...(await getBackendAuthHeaders()),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      studioId,
      studioTitle: studio.title,
      studioImage: studio.imageUrl ?? studio.images?.[0],
      hostEmail: studio.ownerEmail ?? studio.hostEmail,
      customerName: session.user.name,
      customerEmail: session.user.email,
      date,
      startTime,
      startAt: startDate.toISOString(),
      endAt,
      duration: Number(duration),
      guests: Number(guests),
      hourlyRate: studio.hourlyRate,
      total: studio.hourlyRate * Number(duration),
      status: "Pending",
    }),
    cache: "no-store",
  });

  return forwardResponse(response);
}
