"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Building2,
  CalendarCheck,
  CirclePlus,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import { useRouter } from "next/navigation";

export type HeaderUser = {
  name: string;
  email: string;
  image?: string;
};

const MENU_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/studios/new", label: "Add New Studio", icon: CirclePlus },
  { href: "/dashboard/listings", label: "My Studio Listings", icon: Building2 },
  { href: "/dashboard/bookings", label: "My Bookings", icon: CalendarCheck },
];

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join("");
}

export function UserMenu({ user }: { user: HeaderUser }) {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            className="flex items-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-3"
            aria-label="Open user menu"
          />
        }
      >
        <Avatar>
          {user.image ? <AvatarImage src={user.image} alt={user.name} /> : null}
          <AvatarFallback>{initials(user.name)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <p className="text-sm font-medium">{user.name}</p>
          <p className="text-xs text-muted-foreground">{user.email}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {MENU_ITEMS.map((item) => (
          <DropdownMenuItem
            key={item.href}
            onClick={() => router.push(item.href)}
          >
            <item.icon />
            {item.label}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
          {/* TODO: sign out via server action once sessions are wired up */}
          <LogOut />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
