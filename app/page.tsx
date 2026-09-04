import Image from "next/image";
import Link from "next/link";
import { NOTICES, UNIVERSITY_NAME_BN, UNIVERSITY_NAME_EN } from "@/lib/constants";

export default function HomePage() {
  return (
    <div>
      <section className="border-b border-du-line bg-du-paper">
        <div className="mx-auto grid max-w-5xl gap-8 px-4 py-10 sm:grid-cols-[auto_1fr] sm:items-center sm:py-14">
          <Image
            src="/image.png"
            alt="University of Dhaka crest"
            width={120}
            height={160}
            className="h-36 w-auto sm:h-40"
            priority
          />
          <div>
            <p className="font-bengali text-du-purple">{UNIVERSITY_NAME_BN}</p>
            <h1 className="mt-1 max-w-xl text-3xl text-du-purple-deep sm:text-4xl">
              Registered Graduate &amp; Senate Election System
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-du-muted sm:text-base">
              The official channel for {UNIVERSITY_NAME_EN} graduates to verify
              academic eligibility, complete Registered Graduate membership, and
              prepare for the election of 25 Senate members.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex h-11 items-center justify-center bg-du-purple px-5 text-sm font-semibold text-white hover:bg-du-purple-deep"
              >
                Begin registration
              </Link>
              <Link
                href="/login"
                className="inline-flex h-11 items-center justify-center border border-du-purple px-5 text-sm font-semibold text-du-purple hover:bg-du-purple-soft"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-10">
        <h2 className="text-xl text-du-purple-deep">Eligibility</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-du-muted">
          Applicants must satisfy both conditions before any record lookup or payment:
        </p>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-6 text-du-ink">
          <li>The degree programme lasted at least one academic year.</li>
          <li>Graduation was at least three years before the date of application.</li>
        </ol>
        <p className="mt-3 text-sm text-du-muted">
          Applicants who do not meet these rules are stopped immediately and are
          not asked for a profile or payment.
        </p>
      </section>

      <section className="border-y border-du-line bg-du-paper">
        <div className="mx-auto max-w-5xl px-4 py-10">
          <h2 className="text-xl text-du-purple-deep">How to apply</h2>
          <ol className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["1. Account", "Register with a Bangladesh mobile number and confirm the OTP."],
              ["2. Academic identity", "Enter registration number, session, degree, and department."],
              ["3. Eligibility gate", "The portal checks duration and the three-year waiting period."],
              ["4. Record lookup", "Eligible graduates are matched against four university sources."],
              ["5. Membership", "Choose Session (annual) or Lifetime membership."],
              ["6. Payment", "Pay through SSLCommerz (bKash, Nagad, card, or internet banking)."],
            ].map(([title, body]) => (
              <li key={title} className="border border-du-line p-4">
                <p className="font-serif text-du-purple">{title}</p>
                <p className="mt-1 text-sm leading-6 text-du-muted">{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="notices" className="mx-auto max-w-5xl px-4 py-10">
        <h2 className="text-xl text-du-purple-deep">Notices &amp; circulars</h2>
        <ul className="mt-5 divide-y divide-du-line border-y border-du-line">
          {NOTICES.map((notice) => (
            <li key={notice.title} className="py-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-du-gold-deep">
                {notice.date}
              </p>
              <h3 className="mt-1 font-serif text-lg text-du-ink">{notice.title}</h3>
              <p className="mt-1 text-sm leading-6 text-du-muted">{notice.body}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
