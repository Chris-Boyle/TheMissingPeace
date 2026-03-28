"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navigationItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/consultation", label: "Consultation" },
  {
    href: "/birth-plan-builder",
    label: "Birth Plan Builder",
    emphasized: true,
  },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const shouldPrioritizeLogo = pathname !== "/" && pathname !== "/about";

  return (
    <header className="sticky top-0 z-50 border-b border-[#dccfc1] bg-[rgba(252,248,243,0.94)] backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-1.5 sm:px-6 lg:px-8">
        <Link
          href="/"
          onClick={() => setIsMenuOpen(false)}
          className="shrink-0"
          aria-label="The Missing Peace home"
        >
          <Image
            src="/the-missing-peace-logo.webp"
            alt="The Missing Peace Birth Doula"
            width={320}
            height={160}
            priority={shouldPrioritizeLogo}
            sizes="(min-width: 640px) 170px, 140px"
            className="h-auto w-[140px] sm:w-[170px]"
          />
        </Link>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-full border border-[#cdb8a5] px-3 py-1 text-sm font-medium text-[#5d3e27] transition hover:bg-[#f2e6da] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7d5c3c] md:hidden"
          aria-expanded={isMenuOpen}
          aria-controls="site-navigation"
          aria-label="Toggle navigation menu"
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          Menu
        </button>

        <nav
          id="site-navigation"
          className={`${isMenuOpen ? "flex" : "hidden"} absolute inset-x-4 top-full mt-2 flex-col rounded-3xl border border-[#dccfc1] bg-[#fffaf5] p-3 shadow-lg md:static md:mt-0 md:flex md:flex-row md:items-center md:gap-1 md:border-0 md:bg-transparent md:p-0 md:shadow-none`}
          aria-label="Primary navigation"
        >
          {navigationItems.map((item) => {
            const active = isActivePath(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                aria-current={active ? "page" : undefined}
                className={`rounded-full px-3 py-1 text-sm font-medium transition ${
                  active
                    ? "bg-[#7d5c3c] text-[#fff9f2]"
                    : item.emphasized
                      ? "bg-[#f2e3d4] text-[#6d4b36] hover:bg-[#ead7c4] hover:text-[#4e3323]"
                      : "text-[#5d3e27] hover:bg-[#f2e6da] hover:text-[#3f2818]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
