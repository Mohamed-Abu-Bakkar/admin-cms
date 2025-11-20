"use client";

import { NavLink } from "@/components/NavLink";
import {
  LayoutDashboard,
  Package,
  Users,
  MessageSquare,
  Mail,
  FolderTree,
  Settings,
  LogOut,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { logoutUser } from "@/lib/auth-client";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: Package, label: "Products", path: "/products" },
  { icon: Users, label: "Users", path: "/users" },
  { icon: MessageSquare, label: "Testimonials", path: "/testimonials" },
  { icon: Mail, label: "Newsletter", path: "/newsletter" },
  { icon: FolderTree, label: "Categories", path: "/categories" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logoutUser();
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-full w-64 bg-white dark:bg-gray-900 border-r border-green-200 dark:border-green-800 shadow-lg transition-transform duration-300 md:sticky md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-between px-6 border-b border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/20">
            <span className="font-bold text-xl text-green-700 dark:text-green-400">
              Admin CMS
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="md:hidden text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Menu items */}
          <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                href={item.path}
                end={item.path === "/"}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-700 dark:hover:text-green-400 transition-all duration-200"
                activeClassName="bg-green-500 dark:bg-green-600 text-white shadow-md hover:bg-green-600 dark:hover:bg-green-700"
                onClick={() => onClose()}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Logout button */}
          <div className="p-4 border-t border-green-200 dark:border-green-800">
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950/20"
            >
              <LogOut className="h-5 w-5" />
              <span className="font-medium">Logout</span>
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
};
