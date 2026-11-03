"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "cn";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { UserMenu, type HeaderUser } from "@/components/layout/user-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { authClient } from "@/lib/auth-client";
import { MenuIcon } from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/studios", label: "Explore Studios" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/#about", label: "About Us" },
];

function isActive(pathname: string, href: string) {
  if (href.includes("#")) return false;
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const { data: session, isPending } = authClient.useSession();
  const user: HeaderUser | null = session?.user
    ? {
        name: session.user.name,
        email: session.user.email,
        image: session.user.image ?? undefined,
      }
    : null;

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

        <div className="ml-auto hidden items-center gap-2 md:flex">
          <ThemeToggle />
          {isPending ? null : user ? (
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

        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="ml-auto md:hidden"
                aria-label="Open navigation menu"
              />
            }
          >
            <MenuIcon />
          </SheetTrigger>
          <SheetContent side="right" className="w-[min(20rem,85vw)]">
            <SheetHeader>
              <SheetTitle>Navigation</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-1 px-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    "rounded-lg px-3 py-2.5 text-sm transition-colors",
                    isActive(pathname, link.href)
                      ? "bg-primary/10 font-medium text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="mt-auto flex flex-col gap-2 border-t p-4">
              <div className="flex justify-end">
                <ThemeToggle />
              </div>
              {isPending ? null : user ? (
                <UserMenu user={user} />
              ) : (
                <>
                  <Button
                    variant="ghost"
                    nativeButton={false}
                    render={
                      <Link
                        href="/login"
                        onClick={() => setMenuOpen(false)}
                      />
                    }
                  >
                    Login
                  </Button>
                  <Button
                    nativeButton={false}
                    render={
                      <Link
                        href="/register"
                        onClick={() => setMenuOpen(false)}
                      />
                    }
                  >
                    Register
                  </Button>
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
