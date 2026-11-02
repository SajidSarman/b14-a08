// Single source of truth for studio categories.
// `value` matches the slugs stored in MongoDB by the add-studio form.
export const CATEGORIES = [
  { value: "photo-studio", label: "Photo Studio" },
  { value: "film-stage", label: "Film Stage" },
  { value: "podcast-lounge", label: "Podcast Lounge" },
  { value: "music-suite", label: "Music Suite" },
  { value: "workshop", label: "Workshop" },
] as const;

export type CategorySlug = (typeof CATEGORIES)[number]["value"];

export function categoryLabel(slug: string) {
  return CATEGORIES.find((category) => category.value === slug)?.label ?? slug;
}
