"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface NavLinkProps extends React.ComponentPropsWithoutRef<typeof Link> {
  className?: string;
  activeClassName?: string;
  end?: boolean;
}

export const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
  ({ className, activeClassName, end = false, href, ...props }, ref) => {
    const pathname = usePathname();

    // Check if the link is active
    const isActive = end
      ? pathname === href
      : pathname.startsWith(href.toString());

    return (
      <Link
        ref={ref}
        href={href}
        className={cn(className, isActive && activeClassName)}
        {...props}
      />
    );
  }
);

NavLink.displayName = "NavLink";
