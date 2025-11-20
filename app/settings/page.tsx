import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AppLayout } from "@/components/AppLayout";

export default async function SettingsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            Settings
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mt-2">
            Configure your application settings
          </p>
        </div>

        <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-gray dark:bg-zinc-900 p-6">
          <p className="text-zinc-600 dark:text-zinc-400">
            Settings page coming soon...
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
