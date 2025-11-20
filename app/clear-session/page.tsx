import { clearAuthCookie } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ClearCookiePage() {
  await clearAuthCookie();
  redirect("/login");
}
