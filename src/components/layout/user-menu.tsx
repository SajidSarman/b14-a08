"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Building2,
  CalendarCheck,
  CalendarDays,
  CirclePlus,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "@/components/ui/toast";

export type HeaderUser = {
  name: string;
  email: string;
  image?: string;
};

const MENU_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/add-studio", label: "Add New Studio", icon: CirclePlus },
  { href: "/my-listings", label: "My Studio Listings", icon: Building2 },
  { href: "/host-bookings", label: "Host Bookings", icon: CalendarDays },
  { href: "/my-bookings", label: "My Bookings", icon: CalendarCheck },
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

  const handleSignOut = async () => {
    try {
      const { error } = await authClient.signOut();
      if (error) {
        throw new Error(error.message);
      }

      router.replace("/");
      router.refresh();
    } catch (error) {
      toast.add({
        title: "Sign out failed",
        description:
          error instanceof Error ? error.message : "Please try again.",
        type: "error",
      });
    }
  };

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
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
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
        <DropdownMenuItem variant="destructive" onClick={handleSignOut}>
          <LogOut />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
