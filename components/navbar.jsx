"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "All Games", href: "/all-games" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Forum", href: "/forum" },
  { label: "Reviews", href: "/reviews" },
  { label: "My Games", href: "/my-games" },
  { label: "Login", href: "/login" },
];

function linkClassName(pathname, href) {
  return `block rounded-md px-3 py-2 text-sm transition-colors ${
    pathname === href
      ? "font-semibold text-foreground"
      : "text-muted-foreground hover:text-foreground"
  }`;
}

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 shrink-0 border-b border-border">
      <div className="relative h-[var(--nav-height)] overflow-hidden">
        <img
          src="/backgrounds/navbar.png"
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover object-center"
        />

        <nav className="relative z-10 flex h-full items-center justify-between px-3 md:px-6 lg:px-12">
          <Link
            href="/"
            className="text-xs font-bold uppercase tracking-wider text-foreground transition-opacity hover:opacity-80 md:text-base"
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
            className="rounded-md px-2 py-1 text-xs font-semibold text-foreground md:hidden"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? "Close" : "Menu"}
          </button>
        </nav>
      </div>

      {menuOpen && (
        <ul className="border-t border-border bg-background px-4 py-2 md:hidden">
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
