import { API_URL, type Studio } from "@/lib/api";
import { getBackendAuthHeaders } from "@/lib/backend-auth";
import { getCurrentSession } from "@/lib/session";

type RouteContext = {
  params: Promise<{ id: string }>;
};

const EDITABLE_FIELDS = [
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

async function getOwnedStudio(id: string) {
  const session = await getCurrentSession();
  if (!session) {
    return {
      response: Response.json(
        { message: "Authentication required." },
        { status: 401 }
      ),
    };
  }

  const response = await fetch(
    `${API_URL}/studios/${encodeURIComponent(id)}`,
    {
      headers: await getBackendAuthHeaders(),
      cache: "no-store",
    }
  );
  if (response.status === 404) {
    return {
      response: Response.json({ message: "Studio not found." }, { status: 404 }),
    };
  }
  if (!response.ok) {
    return {
      response: Response.json(
        { message: `Studio server responded with ${response.status}.` },
        { status: 502 }
      ),
    };
  }

  const studio = (await response.json()) as Studio;
  if ((studio.ownerEmail ?? studio.hostEmail) !== session.user.email) {
    return {
      response: Response.json({ message: "Studio not found." }, { status: 404 }),
    };
  }

  return { studio };
}

async function forwardResponse(response: Response) {
  if (response.status === 204) {
    return new Response(null, { status: 204 });
  }
  return new Response(response.body, {
    status: response.status,
    headers: {
      "Content-Type": response.headers.get("Content-Type") ?? "application/json",
    },
  });
}

export async function PUT(request: Request, { params }: RouteContext) {
  const { id } = await params;
  const ownership = await getOwnedStudio(id);
  if (ownership.response) {
    return ownership.response;
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

  const updateData = Object.fromEntries(
    EDITABLE_FIELDS.filter((field) => field in body).map((field) => [
      field,
      body[field],
    ])
  );
  if (Object.keys(updateData).length === 0) {
    return Response.json({ message: "No editable fields provided." }, { status: 400 });
  }

  const response = await fetch(
    `${API_URL}/studios/${encodeURIComponent(id)}`,
    {
      method: "PUT",
      headers: {
        ...(await getBackendAuthHeaders()),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
      cache: "no-store",
    }
  );
  return forwardResponse(response);
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const { id } = await params;
  const ownership = await getOwnedStudio(id);
  if (ownership.response) {
    return ownership.response;
  }

  const response = await fetch(
    `${API_URL}/studios/${encodeURIComponent(id)}`,
    {
      method: "DELETE",
      headers: await getBackendAuthHeaders(),
      cache: "no-store",
    }
  );
  return forwardResponse(response);
}
