import { getCurrentSession } from "@/lib/session";

const MAX_FILE_SIZE = 4 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function POST(request: Request) {
  const session = await getCurrentSession();
  if (!session) {
    return Response.json({ message: "Authentication required." }, { status: 401 });
  }

  const apiKey = process.env.IMGBB_API_KEY;
  if (!apiKey) {
    return Response.json(
      { message: "Image uploads are not configured. Set IMGBB_API_KEY." },
      { status: 503 }
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return Response.json({ message: "A valid image file is required." }, { status: 400 });
  }

  const image = formData.get("image");
  if (!(image instanceof File) || image.size === 0) {
    return Response.json({ message: "Choose an image to upload." }, { status: 400 });
  }
  if (!ALLOWED_TYPES.includes(image.type)) {
    return Response.json(
      { message: "Choose a JPG, PNG, WebP, or GIF image." },
      { status: 400 }
    );
  }
  if (image.size > MAX_FILE_SIZE) {
    return Response.json(
      { message: "Image must be 4 MB or smaller." },
      { status: 413 }
    );
  }

  const uploadData = new FormData();
  uploadData.append("image", image, image.name);
  const response = await fetch(
    `https://api.imgbb.com/1/upload?key=${encodeURIComponent(apiKey)}`,
    {
      method: "POST",
      body: uploadData,
    }
  );
  if (!response.ok) {
    return Response.json(
      { message: "ImgBB could not upload the image. Please try again." },
      { status: 502 }
    );
  }

  const result: unknown = await response.json();
  if (
    typeof result !== "object" ||
    result === null ||
    !("data" in result) ||
    typeof result.data !== "object" ||
    result.data === null ||
    !("url" in result.data) ||
    typeof result.data.url !== "string"
  ) {
    return Response.json(
      { message: "ImgBB returned an invalid image URL." },
      { status: 502 }
    );
  }

  return Response.json({ imageUrl: result.data.url });
}
