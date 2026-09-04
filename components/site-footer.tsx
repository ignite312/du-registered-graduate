import Image from "next/image";
import Link from "next/link";
import { APP_NAME, UNIVERSITY_NAME_BN, UNIVERSITY_NAME_EN } from "@/lib/constants";

const PORTAL_LINKS = [
  { href: "/", label: "Home" },
  { href: "/#notices", label: "Notices" },
  { href: "/register", label: "Register" },
  { href: "/login", label: "Login" },
];

const UNIVERSITY_LINKS = [
  { href: "https://www.du.ac.bd/", label: "University website" },
  { href: "https://www.du.ac.bd/index.php/offices/ORG", label: "Office of the Registrar" },
  { href: "https://www.du.ac.bd/onlineServices", label: "Online services" },
];

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-du-line bg-du-paper">
      <div className="mx-auto grid max-w-5xl gap-8 px-4 py-8 sm:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/image.png"
              alt="University of Dhaka crest"
              width={40}
              height={54}
              className="h-12 w-auto"
            />
            <span className="min-w-0">
              <span className="block font-bengali text-sm text-du-purple">{UNIVERSITY_NAME_BN}</span>
              <span className="block font-serif text-base font-semibold text-du-purple-deep">
                {UNIVERSITY_NAME_EN}
              </span>
              <span className="block text-xs text-du-muted">{APP_NAME}</span>
            </span>
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-6 text-du-muted">
            Official portal for Registered Graduate membership and Senate elections.
            This demonstration uses mock data only; no SMS, payment, or academic
            records are transmitted.
          </p>
        </div>

        <nav aria-label="Portal">
          <h2 className="font-serif text-sm font-semibold text-du-purple-deep">Portal</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {PORTAL_LINKS.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="text-du-muted hover:text-du-purple hover:underline">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="University">
          <h2 className="font-serif text-sm font-semibold text-du-purple-deep">University</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {UNIVERSITY_LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="text-du-muted hover:text-du-purple hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="h-1 bg-du-gold" />
      <p className="mx-auto max-w-5xl px-4 py-3 text-xs text-du-muted">
        © {new Date().getFullYear()} {UNIVERSITY_NAME_EN}
      </p>
    </footer>
  );
}
