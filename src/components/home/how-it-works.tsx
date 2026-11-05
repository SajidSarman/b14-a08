import {
  CalendarCheckIcon,
  ClockIcon,
  SearchIcon,
  SparklesIcon,
} from "lucide-react";

const STEPS = [
  {
    icon: SearchIcon,
    title: "Discover Spaces",
    description:
      "Browse creative studios by category, location, and the features your project needs.",
  },
  {
    icon: ClockIcon,
    title: "Select Shoot Hours",
    description:
      "Pick your date and the hourly slots that fit your shooting schedule.",
  },
  {
    icon: CalendarCheckIcon,
    title: "Book Instantly",
    description:
      "Confirm your booking in a few clicks with transparent hourly pricing.",
  },
  {
    icon: SparklesIcon,
    title: "Create & Produce",
    description:
      "Meet your host at the studio and focus on bringing your idea to life.",
  },
];

export function HowItWorks() {
  return (
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
            Four simple steps from discovery to production.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-4">
          {STEPS.map(({ icon: Icon, title, description }, index) => (
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
  );
}
