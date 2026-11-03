"use client";

import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";

const SLIDES = [
  {
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=2000&q=85",
    eyebrow: "Make room for your next big idea",
    title: "Find the space where creativity happens.",
    description:
      "Discover inspiring studios for photography, film, music, podcasts, and more.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=2000&q=85",
    eyebrow: "Create something unforgettable",
    title: "Your next shoot starts here.",
    description:
      "Book a creative space by the hour, with the gear and atmosphere your work needs.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=2000&q=85",
    eyebrow: "A space for every sound",
    title: "Bring your next track to life.",
    description:
      "Explore music and podcast studios ready for your next recording session.",
  },
];

export function HeroSlider() {
  return (
    <section aria-label="Featured creative spaces">
      <Carousel opts={{ loop: true }} className="group relative">
        <CarouselContent className="ml-0">
          {SLIDES.map((slide) => (
            <CarouselItem key={slide.title} className="basis-full pl-0">
              <div
                className="relative flex min-h-[520px] items-center bg-cover bg-center sm:min-h-[600px]"
                style={{ backgroundImage: `url("${slide.image}")` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/10" />
                <div className="relative mx-auto w-full max-w-7xl px-6 py-20 text-white md:px-10">
                  <div className="max-w-2xl space-y-5">
                    <p className="text-sm font-semibold tracking-[0.18em] text-white/85 uppercase">
                      {slide.eyebrow}
                    </p>
                    <h1 className="text-4xl leading-tight font-bold tracking-tight sm:text-5xl md:text-6xl">
                      {slide.title}
                    </h1>
                    <p className="max-w-xl text-base leading-7 text-white/85 sm:text-lg">
                      {slide.description}
                    </p>
                    <div className="flex flex-wrap gap-3 pt-2">
                      <Button
                        size="lg"
                        nativeButton={false}
                        render={<Link href="/studios" />}
                      >
                        Explore Studios
                      </Button>
                      <Button
                        size="lg"
                        variant="outline"
                        className="border-white/70 bg-white/10 text-white hover:bg-white/20 hover:text-white"
                        nativeButton={false}
                        render={<Link href="/add-studio" />}
                      >
                        Host Your Space
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4 z-10 border-white/40 bg-black/30 text-white hover:bg-black/50 hover:text-white sm:left-8" />
        <CarouselNext className="right-4 z-10 border-white/40 bg-black/30 text-white hover:bg-black/50 hover:text-white sm:right-8" />
      </Carousel>
    </section>
  );
}
