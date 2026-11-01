"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "cn";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { UserMenu, type HeaderUser } from "@/components/layout/user-menu";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/studios", label: "Explore Studios" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/about", label: "About Us" },
];

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function SiteHeader({ user }: { user?: HeaderUser | null }) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-2 px-4 md:px-6">
        <Logo />

        <nav className="ml-6 hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-full px-3 py-1.5 text-sm transition-colors",
                isActive(pathname, link.href)
                  ? "bg-primary/10 font-medium text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {user ? (
            <UserMenu user={user} />
          ) : (
            <>
              <Button variant="ghost" nativeButton={false} render={<Link href="/login" />}>
                Login
              </Button>
              <Button nativeButton={false} render={<Link href="/register" />}>
                Register
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
