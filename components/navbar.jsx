"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-6 border-club-wood-dark bg-club-wood shadow-[0_2px_8px_#2a1810aa]">
      <nav className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-3">
        <Link
          href="/"
          className="text-base font-bold uppercase tracking-wider text-club-poster-text transition-opacity hover:opacity-90"
        >
          The Old Ladies Game Club
        </Link>

        <ul className="flex gap-1 sm:gap-2">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`rounded-md px-3 py-1.5 text-sm tracking-wide transition-colors ${
                  pathname === link.href
                    ? "font-semibold text-club-poster-text"
                    : "text-club-text-muted hover:text-club-poster-text"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
