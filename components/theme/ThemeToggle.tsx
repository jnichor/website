"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  const toggle = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={toggle}
      aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      title={isDark ? "Modo claro" : "Modo oscuro"}
      suppressHydrationWarning
    >
      <Sun
        className={`h-5 w-5 transition-all ${
          mounted && isDark ? "scale-0 -rotate-90" : "scale-100 rotate-0"
        }`}
        aria-hidden
      />
      <Moon
        className={`absolute h-5 w-5 transition-all ${
          mounted && isDark ? "scale-100 rotate-0" : "scale-0 rotate-90"
        }`}
        aria-hidden
      />
    </Button>
  );
}
