import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AppLayout } from "@/components/AppLayout";
import UserAddClient from "@/components/users/UserAddClient";

export default async function UserAddPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <AppLayout>
      <UserAddClient />
    </AppLayout>
  );
}
