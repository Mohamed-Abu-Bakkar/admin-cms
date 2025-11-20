import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AppLayout } from "@/components/AppLayout";
import UserListClient from "@/components/users/UserListClient";

export default async function UsersPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <AppLayout>
      <UserListClient />
    </AppLayout>
  );
}
