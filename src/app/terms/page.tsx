import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
};

export default function TermsPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12 md:px-6 md:py-16">
      <header className="mb-10 space-y-3">
        <p className="text-sm font-semibold tracking-wide text-primary uppercase">
          StudioSpace
        </p>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Terms of Service
        </h1>
        <p className="text-muted-foreground">
          These terms explain the basic rules for using StudioSpace.
        </p>
      </header>

      <div className="space-y-8 leading-7 text-muted-foreground">
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">
            Using StudioSpace
          </h2>
          <p>
            StudioSpace helps people discover creative spaces and lets hosts
            publish studio listings. By using the service, you agree to use it
            lawfully, provide accurate information, and respect other users.
          </p>
          <p>
            You are responsible for keeping your account credentials secure and
            for activity carried out through your account. Contact the
            StudioSpace team if you believe your account has been used without
            permission.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">
            Studio listings
          </h2>
          <p>
            Hosts are responsible for the accuracy and legality of their
            listings, including descriptions, photos, rates, capacity, location,
            amenities, and their right to offer the space. StudioSpace may
            remove listings that are misleading or violate these terms.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">
            Booking requests and status
          </h2>
          <p>
            A booking request is initially marked Pending. It is not confirmed
            until the host changes its status to Confirmed. Hosts may mark a
            confirmed booking Completed after the reservation. Customers may
            cancel Pending requests through the app; confirmed reservations
            cannot currently be cancelled through that action.
          </p>
          <p>
            StudioSpace currently records booking requests and displayed
            reservation details; it does not process booking payments. Any
            arrangements outside the app are between the customer and host.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">
            User conduct and availability
          </h2>
          <p>
            Do not misuse the service, interfere with its operation, attempt
            unauthorized access, or submit content that is unlawful,
            fraudulent, or infringes someone else&apos;s rights. We may suspend
            access for misuse or to protect users and the service.
          </p>
          <p>
            We work to keep StudioSpace available and accurate, but the service
            may change or be unavailable at times. Listings and booking details
            are provided by users and should be confirmed directly with the
            other party when needed.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">
            Changes to these terms
          </h2>
          <p>
            We may update these terms as StudioSpace changes. The current
            version will be posted on this page. Continued use after an update
            means you accept the revised terms.
          </p>
        </section>
      </div>
    </main>
  );
}
