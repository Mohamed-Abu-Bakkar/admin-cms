import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AppLayout } from "@/components/AppLayout";
import UserEditClient from "@/components/users/UserEditClient";

export default async function UserEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const { id } = await params;

  return (
    <AppLayout>
      <UserEditClient userId={id} />
    </AppLayout>
  );
}
