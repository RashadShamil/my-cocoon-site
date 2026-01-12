"use client";

import { usePathname } from "next/navigation";

export default function WebsiteOnly({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // If the URL starts with "/studio", DO NOT show the children (Header/Footer)
  if (pathname.startsWith("/studio")) {
    return null;
  }

  // Otherwise, show them normally
  return <>{children}</>;
}