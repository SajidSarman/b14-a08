import Link from "next/link";
import { Suspense } from "react";
import {
  ArrowRightIcon,
  CameraIcon,
  ClapperboardIcon,
  HeadphonesIcon,
  Music2Icon,
  PaletteIcon,
} from "lucide-react";
import { AboutUs } from "@/components/home/about-us";
import { FeaturedStudios } from "@/components/home/featured-studios";
import { HeroSlider } from "@/components/home/hero-slider";
import { HowItWorks } from "@/components/home/how-it-works";
import { StudiosGridSkeleton } from "@/components/studio/studios-grid";
import { Button } from "@/components/ui/button";
import { CATEGORIES } from "@/lib/categories";

const CATEGORY_ICONS = {
  "photo-studio": CameraIcon,
  "film-stage": ClapperboardIcon,
  "podcast-lounge": HeadphonesIcon,
  "music-suite": Music2Icon,
  workshop: PaletteIcon,
} as const;

const CATEGORY_DESCRIPTIONS = {
  "photo-studio": "Bright studios and ready-to-shoot sets",
  "film-stage": "Production stages for your next scene",
  "podcast-lounge": "Sound-ready rooms for every conversation",
  "music-suite": "Rehearsal and recording spaces",
  workshop: "Hands-on creative spaces and ateliers",
} as const;

export default function Home() {
  return (
    <>
      <HeroSlider />

      <section className="mx-auto w-full max-w-7xl px-4 py-16 md:px-6 md:py-20">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <p className="text-sm font-semibold tracking-wide text-primary uppercase">
              Handpicked for you
            </p>
            <h2 className="text-3xl font-semibold tracking-tight">
              Featured studios
            </h2>
            <p className="max-w-2xl text-muted-foreground">
              Explore standout creative spaces, selected from the latest
              listings and top-rated studios.
            </p>
          </div>
          <Button
            variant="outline"
            nativeButton={false}
            render={<Link href="/studios" />}
          >
            View all studios
            <ArrowRightIcon />
          </Button>
        </div>
        <Suspense fallback={<StudiosGridSkeleton />}>
          <FeaturedStudios />
        </Suspense>
      </section>

      <section className="bg-muted/50">
        <div className="mx-auto w-full max-w-7xl px-4 py-16 md:px-6 md:py-20">
          <div className="mb-8 space-y-2">
            <p className="text-sm font-semibold tracking-wide text-primary uppercase">
              Find your kind of space
            </p>
            <h2 className="text-3xl font-semibold tracking-tight">
              Browse by category
            </h2>
            <p className="text-muted-foreground">
              From a quiet recording room to a full production stage, find the
              setup that fits your project.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {CATEGORIES.map((category) => {
              const Icon = CATEGORY_ICONS[category.value];

              return (
                <Link
                  key={category.value}
                  href={`/studios?category=${category.value}`}
                  className="group rounded-xl border bg-card p-5 transition-colors hover:border-primary/40 hover:bg-primary/5"
                >
                  <span className="mb-5 flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </span>
                  <h3 className="font-semibold">{category.label}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {CATEGORY_DESCRIPTIONS[category.value]}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                    Explore
                    <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <HowItWorks />
      <AboutUs />
    </>
  );
}
