"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import React from "react";

const links = [
  { title: "Profile", href: "/user/profile" },
  { title: "Orders", href: "/user/orders" },
];

const MainNav = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) => {
  const pathname = usePathname();
  // const isActive = pathname === link.href;

  return (
    <nav className={cn("flex items-center space-x-4", className)} {...props}>
      {links.map((link) => {
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              pathname.includes(link.href) ? "text-primary" : "text-muted-foreground",
            )}
          >
            {link.title}
          </Link>
        );
      })}
    </nav>
  );
};

export default MainNav;
