import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { categoryLabel } from "@/lib/categories";
import type { Studio } from "@/lib/api";
import { MapPinIcon, StarIcon } from "lucide-react";

export function StudioCard({ studio }: { studio: Studio }) {
  const image = studio.imageUrl ?? studio.images?.[0];

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-md">
      <div className="relative aspect-video overflow-hidden bg-muted">
        {image ? (
          <img
            src={image}
            alt={studio.title}
            className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex size-full items-center justify-center bg-muted text-sm text-muted-foreground">
            No image yet
          </div>
        )}
        <Badge className="absolute top-3 left-3 shadow-sm">
          {categoryLabel(studio.category)}
        </Badge>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 font-semibold">{studio.title}</h3>
          <Badge variant="secondary" className="shrink-0 gap-1">
            <StarIcon className="size-3 fill-current" />
            {studio.rating ? studio.rating.toFixed(1) : "New"}
          </Badge>
        </div>

        <p className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPinIcon className="size-3.5" />
          <span className="line-clamp-1">{studio.location}</span>
        </p>

        <div className="mt-auto flex items-center justify-between gap-2">
          <p className="text-sm">
            <span className="text-lg font-semibold text-primary">
              ${studio.hourlyRate}
            </span>
            <span className="text-muted-foreground"> / hr</span>
          </p>
          <Button
            size="sm"
            variant="outline"
            nativeButton={false}
            render={<Link href={`/studios/${studio._id}`} />}
          >
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
}
