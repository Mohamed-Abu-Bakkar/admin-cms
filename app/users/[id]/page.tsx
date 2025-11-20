import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AppLayout } from "@/components/AppLayout";
import UserViewClient from "@/components/users/UserViewClient";

export default async function UserViewPage({
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
      <UserViewClient userId={id} />
    </AppLayout>
  );
}
