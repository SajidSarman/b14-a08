import Link from "next/link";
import { Suspense } from "react";
import {
  ArrowRightIcon,
  AudioLinesIcon,
  CameraIcon,
  ClapperboardIcon,
  HeadphonesIcon,
  Music2Icon,
  PaletteIcon,
  SearchIcon,
  CalendarCheckIcon,
  SparklesIcon,
  UsersIcon,
} from "lucide-react";
import { FeaturedStudios } from "@/components/home/featured-studios";
import { HeroSlider } from "@/components/home/hero-slider";
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

      <section
        id="how-it-works"
        className="scroll-mt-24 bg-muted/50"
        aria-labelledby="how-it-works-heading"
      >
        <div className="mx-auto w-full max-w-7xl px-4 py-16 md:px-6 md:py-20">
          <div className="mb-8 max-w-2xl space-y-2">
            <p className="text-sm font-semibold tracking-wide text-primary uppercase">
              Simple from start to finish
            </p>
            <h2
              id="how-it-works-heading"
              className="text-3xl font-semibold tracking-tight"
            >
              How It Works
            </h2>
            <p className="text-muted-foreground">
              Find a place that fits your project, then book directly with the
              host.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                icon: SearchIcon,
                title: "Find your space",
                description:
                  "Browse creative studios by category, location, and the features your project needs.",
              },
              {
                icon: CalendarCheckIcon,
                title: "Choose the details",
                description:
                  "Compare the hourly rate, capacity, amenities, and studio information before you book.",
              },
              {
                icon: SparklesIcon,
                title: "Make something great",
                description:
                  "Meet your host at the studio and focus on bringing your idea to life.",
              },
            ].map(({ icon: Icon, title, description }, index) => (
              <article key={title} className="rounded-xl border bg-card p-6">
                <div className="mb-5 flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </div>
                <p className="mb-2 text-sm font-medium text-muted-foreground">
                  Step {index + 1}
                </p>
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="about"
        className="scroll-mt-24"
        aria-labelledby="about-heading"
      >
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-16 md:grid-cols-2 md:px-6 md:py-20">
          <div className="space-y-4">
            <span className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <UsersIcon className="size-5" />
            </span>
            <p className="text-sm font-semibold tracking-wide text-primary uppercase">
              About StudioSpace
            </p>
            <h2
              id="about-heading"
              className="text-3xl font-semibold tracking-tight"
            >
              A better space for every creative.
            </h2>
            <p className="leading-7 text-muted-foreground">
              StudioSpace brings creators and independent studio hosts
              together. We make it easier to discover welcoming, well-equipped
              spaces for photography, film, music, podcasts, and hands-on
              workshops.
            </p>
          </div>
          <div className="rounded-2xl border bg-card p-6 md:p-8">
            <span className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <AudioLinesIcon className="size-5" />
            </span>
            <h3 className="mt-5 text-2xl font-semibold tracking-tight">
              Have a creative space?
            </h3>
            <p className="mt-2 leading-7 text-muted-foreground">
              Share your studio with creators looking for the right place to
              bring their next project to life.
            </p>
            <Button
              className="mt-5"
              nativeButton={false}
              render={<Link href="/add-studio" />}
            >
              Host Your Space
              <ArrowRightIcon />
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
