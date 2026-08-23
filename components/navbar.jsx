"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { robotoSlab } from "@/lib/fonts";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Forum", href: "/forum" },
  { label: "Reviews", href: "/reviews" },
  { label: "My Games", href: "/my-games" },
  { label: "Login", href: "/login" },
];

function linkClassName(pathname, href) {
  return `block rounded-md px-3 py-2 text-sm tracking-wide transition-colors ${
    pathname === href
      ? "font-semibold text-club-poster-text"
      : "text-club-text-muted hover:text-club-poster-text"
  }`;
}

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 shrink-0 border-b-4 border-club-wood-dark bg-club-wood">
      <div className="relative h-[var(--nav-height)] max-md:overflow-hidden md:h-auto">
        <img
          src="/pagedivider.png"
          alt=""
          aria-hidden
          className="block h-full w-full object-cover md:h-auto"
        />

        <nav className="absolute inset-0 flex items-center justify-between px-3 md:px-6 lg:px-12">
          <Link
            href="/"
            className={`${robotoSlab.className} text-xs font-black uppercase tracking-wider text-club-poster-text transition-opacity hover:opacity-90 md:text-base`}
          >
            <span className="md:hidden">TOLGC</span>
            <span className="hidden md:inline">The Old Ladies Game Club</span>
          </Link>

          <ul className="hidden items-center gap-1 md:flex lg:gap-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={linkClassName(pathname, link.href)}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <button
            type="button"
            className="rounded-md px-2 py-1 text-xs font-semibold text-club-poster-text md:hidden"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? "Close" : "Menu"}
          </button>
        </nav>
      </div>

      {menuOpen && (
        <ul className="border-t border-club-wood-dark/50 bg-club-wood px-4 py-2 md:hidden">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={linkClassName(pathname, link.href)}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
