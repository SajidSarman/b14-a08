import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12 md:px-6 md:py-16">
      <header className="mb-10 space-y-3">
        <p className="text-sm font-semibold tracking-wide text-primary uppercase">
          StudioSpace
        </p>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Privacy Policy
        </h1>
        <p className="text-muted-foreground">
          This page describes the information StudioSpace uses to provide the
          service.
        </p>
      </header>

      <div className="space-y-8 leading-7 text-muted-foreground">
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">
            Information we collect
          </h2>
          <p>
            When you create an account, we use information such as your name,
            email address, and authentication details to provide account
            features. If you sign in with Google, Google provides account
            information needed for that sign-in.
          </p>
          <p>
            If you publish a listing, we store its details, such as title,
            category, rate, location, photos, amenities, and description. If you
            request a booking, we store the studio, date, time, duration, guest
            count, price details, and booking status, along with the customer
            and host contact details needed to associate the request with their
            accounts.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">
            How we use information
          </h2>
          <p>
            We use this information to operate accounts, display listings,
            create and manage booking requests, communicate booking details to
            the relevant customer and host, and maintain the security and
            functionality of StudioSpace.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">
            Information sharing
          </h2>
          <p>
            Listing details are visible to people using the service. When a
            customer requests a booking, the details needed to handle that
            request are available to the customer and the host of the studio.
            We also use service providers that support the app, such as
            authentication, hosting, and database providers.
          </p>
          <p>
            StudioSpace currently does not collect booking payment details
            through the app.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">
            Data retention and account requests
          </h2>
          <p>
            We retain account, listing, and booking information as needed to
            operate the service and maintain its records. To request account
            access, correction, or deletion, contact the StudioSpace team using
            the contact channel through which you received or accessed this
            service.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">
            Security and policy updates
          </h2>
          <p>
            We use reasonable measures to protect information, but no online
            service can guarantee absolute security. We may update this policy
            as the service changes; the current version will be posted on this
            page.
          </p>
        </section>
      </div>
    </main>
  );
}
