export const API_URL = process.env.API_URL ?? "http://localhost:5000";

export type Studio = {
  _id: string;
  title: string;
  category: string;
  hourlyRate: number;
  securityDeposit?: number;
  maxCapacity?: number;
  location: string;
  rating?: number;
  imageUrl?: string;
  images?: string[];
};

// The API may return a bare array or an object like { studios: [...] } — accept both.
export async function fetchStudios(category?: string): Promise<Studio[]> {
  const res = await fetch(`${API_URL}/studios`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Server responded with ${res.status}`);
  }
  const data = (await res.json()) as Studio[] | { studios?: Studio[] };
  const studios = Array.isArray(data) ? data : (data.studios ?? []);
  return category
    ? studios.filter((studio) => studio.category === category)
    : studios;
}
