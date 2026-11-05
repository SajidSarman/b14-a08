import {
  BadgeCheckIcon,
  HeadsetIcon,
  PackageCheckIcon,
  ShieldCheckIcon,
} from "lucide-react";

const GUARANTEES = [
  {
    icon: ShieldCheckIcon,
    title: "Liability Protection",
    description:
      "Every booking is backed by protection covering incidents that happen inside the studio during your session.",
  },
  {
    icon: BadgeCheckIcon,
    title: "Verified Profiles",
    description:
      "Hosts and creators are verified before listing or booking, so you always know who is behind a space.",
  },
  {
    icon: PackageCheckIcon,
    title: "Equipment Safety",
    description:
      "Listed studios keep gear tested and well maintained, with safety standards checked before each booking.",
  },
  {
    icon: HeadsetIcon,
    title: "24/7 Host Support",
    description:
      "Our support team is available around the clock before, during, and after every studio session.",
  },
];

export function HostGuarantee() {
  return (
    <section
      id="host-guarantee"
      className="scroll-mt-24"
      aria-labelledby="host-guarantee-heading"
    >
      <div className="mx-auto w-full max-w-7xl px-4 py-16 md:px-6 md:py-20">
        <div className="mb-8 max-w-2xl space-y-2">
          <p className="text-sm font-semibold tracking-wide text-primary uppercase">
            Book with confidence
          </p>
          <h2
            id="host-guarantee-heading"
            className="text-3xl font-semibold tracking-tight"
          >
            Host Guarantee &amp; Creator Support
          </h2>
          <p className="text-muted-foreground">
            Protection and support built into every booking, for hosts and
            creators alike.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          {GUARANTEES.map(({ icon: Icon, title, description }) => (
            <article key={title} className="rounded-xl border bg-card p-6">
              <div className="mb-5 flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="size-5" />
              </div>
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
