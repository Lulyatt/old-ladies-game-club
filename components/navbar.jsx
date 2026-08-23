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
  return `block rounded-md px-3 py-2 text-lg tracking-wide transition-colors ${
    pathname === href
      ? "font-semibold text-club-poster-text"
      : "text-club-text-muted hover:text-club-poster-text"
  }`;
}

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b-4 border-club-wood-dark bg-club-wood">
      <div className="relative w-full">
        <img
          src="/pagedivider.png"
          alt=""
          aria-hidden
          className="block w-full h-auto"
        />
  
  <nav className="absolute inset-0 flex w-full items-center justify-between px-4 sm:px-6 lg:px-12">
          <Link
            href="/"
            className={`${robotoSlab.className} shrink-0 text-sm font-black uppercase tracking-wider text-club-poster-text transition-opacity hover:opacity-90 sm:text-base`}
          >
            <span className="sm:hidden">TOLGC</span>
            <span className="hidden sm:inline text-lg">The Old Ladies Game Club</span>
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
            className="rounded-md px-3 py-2 text-sm font-semibold text-club-poster-text md:hidden"
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