import {UNIVERSITY_NAME_EN } from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-du-line bg-du-paper">
      <div className="mx-auto max-w-5xl px-4 py-8 text-sm text-du-muted">
        <p className="font-serif text-du-purple">{UNIVERSITY_NAME_EN}</p>
        <p className="mt-4 max-w-2xl leading-6">
          Official portal for Registered Graduate membership and Senate elections.
          This demonstration uses mock data only; no SMS, payment, or academic
          records are transmitted.
        </p>
        <p className="mt-4 text-xs">© {new Date().getFullYear()} University of Dhaka</p>
      </div>
    </footer>
  );
}
