"use client";

import * as React from "react";
import { SunMoonIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const THEME_STORAGE_KEY = "studiospace-theme";

export function ThemeToggle() {
  React.useEffect(() => {
    const theme = window.localStorage.getItem(THEME_STORAGE_KEY) ?? "light";
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.style.colorScheme = theme;
  }, []);

  function toggleTheme() {
    const isDark = document.documentElement.classList.toggle("dark");
    const theme = isDark ? "dark" : "light";
    document.documentElement.style.colorScheme = theme;
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label="Toggle light and dark theme"
      title="Toggle light and dark theme"
      onClick={toggleTheme}
    >
      <SunMoonIcon />
    </Button>
  );
}
