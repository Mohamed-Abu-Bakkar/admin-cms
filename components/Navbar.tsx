"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth-client";
import { useEffect, useState } from "react";
import type { User } from "@/lib/auth-client";
import { ThemeToggle } from "./ThemeToggle";

interface NavbarProps {
  onMenuClick: () => void;
}

export const Navbar = ({ onMenuClick }: NavbarProps) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    getCurrentUser().then(setUser);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-green-200 dark:border-green-800 bg-white dark:bg-gray-900 px-4 md:px-6 shadow-sm">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="md:hidden text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          Dashboard
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <ThemeToggle />
        {user && (
          <div className="hidden sm:flex items-center gap-2">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                {user.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {user.email}
              </p>
            </div>
            <div className="h-10 w-10 rounded-full bg-green-500 dark:bg-green-600 flex items-center justify-center text-white font-semibold shadow-md">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
