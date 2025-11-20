"use client";

import { useRouter } from "next/navigation";
import { logoutUser } from "@/lib/auth-client";

export default function LogoutButton() {
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
    <button
      onClick={handleLogout}
      className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
    >
      Logout
    </button>
  );
}
