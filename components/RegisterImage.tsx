"use client";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function RegisterImage({ darkSrc, lightSrc }: { darkSrc: string; lightSrc: string }) {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Resolve actual theme (system or chosen)
  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";

  return (
    <Image
      src={isDark ? darkSrc : lightSrc}
      alt="Registration illustration"
      width={1000}
      height={2000}
      priority
      className="side-img max-w-[35%] rounded-3xl shadow-lg"
    />
  );
}