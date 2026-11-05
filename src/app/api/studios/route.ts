import { API_URL } from "@/lib/api";
import { getBackendAuthHeaders } from "@/lib/backend-auth";
import { getCurrentSession } from "@/lib/session";

const STUDIO_FIELDS = [
  "title",
  "category",
  "hourlyRate",
  "securityDeposit",
  "maxCapacity",
  "location",
  "imageUrl",
  "amenities",
  "overview",
] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
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

  const studioData = Object.fromEntries(
    STUDIO_FIELDS.filter((field) => field in body).map((field) => [
      field,
      body[field],
    ])
  );
  const response = await fetch(`${API_URL}/add-studio`, {
    method: "POST",
    headers: {
      ...(await getBackendAuthHeaders()),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...studioData,
      hostName: session.user.name,
      hostEmail: session.user.email,
      ownerEmail: session.user.email,
    }),
    cache: "no-store",
  });

  return new Response(response.body, {
    status: response.status,
    headers: {
      "Content-Type": response.headers.get("Content-Type") ?? "application/json",
    },
  });
}
