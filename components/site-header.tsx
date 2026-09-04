"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { APP_NAME, MOTTO_BN, UNIVERSITY_NAME_BN, UNIVERSITY_NAME_EN } from "@/lib/constants";
import { useAppState } from "@/lib/app-context";
import { nextPath } from "@/lib/flow";

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { state, signOut } = useAppState();
  const [open, setOpen] = useState(false);

  const links = state.loggedIn
    ? [
        { href: "/", label: "Home" },
        { href: nextPath(state), label: state.payment ? "Dashboard" : "Continue application" },
      ]
    : [
        { href: "/", label: "Home" },
        { href: "/#notices", label: "Notices" },
        { href: "/register", label: "Register" },
        { href: "/login", label: "Login" },
      ];

  return (
    <header className="border-b border-du-line bg-du-paper">
      <div className="h-1 bg-du-gold" />
      <div className="mx-auto flex max-w-5xl items-center gap-4 px-4 py-3">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <Image
            src="/image.png"
            alt="University of Dhaka crest"
            width={48}
            height={64}
            className="h-14 w-auto"
            priority
          />
          <span className="min-w-0">
            <span className="block font-bengali text-sm text-du-purple sm:text-base">
              {UNIVERSITY_NAME_BN}
            </span>
            <span className="block font-serif text-base font-semibold text-du-purple-deep sm:text-lg">
              {UNIVERSITY_NAME_EN}
            </span>
            <span className="block truncate text-xs text-du-muted">{APP_NAME}</span>
          </span>
        </Link>
        <p className="ml-auto hidden font-bengali text-sm text-du-gold-deep md:block">{MOTTO_BN}</p>
        <button
          type="button"
          className="ml-auto border border-du-line px-3 py-1.5 text-sm md:hidden"
          aria-expanded={open}
          aria-controls="site-nav"
          onClick={() => setOpen((v) => !v)}
        >
          Menu
        </button>
      </div>
      <nav id="site-nav" className="bg-du-purple text-white" aria-label="Primary">
        <ul className={`${open ? "flex" : "hidden"} mx-auto max-w-5xl flex-col md:flex md:flex-row`}>
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className={`block px-4 py-2.5 text-sm ${active ? "bg-du-purple-deep" : "hover:bg-du-purple-deep"}`}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
          {state.loggedIn ? (
            <li className="md:ml-auto">
              <button
                type="button"
                className="block w-full px-4 py-2.5 text-left text-sm hover:bg-du-purple-deep md:text-right"
                onClick={() => {
                  signOut();
                  setOpen(false);
                  router.push("/");
                }}
              >
                Sign out
              </button>
            </li>
          ) : null}
        </ul>
      </nav>
    </header>
  );
}
