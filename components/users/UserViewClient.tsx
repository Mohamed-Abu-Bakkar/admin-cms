"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Edit, Mail, Calendar, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface UserViewClientProps {
  userId: string;
}

const mockUsers = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "Admin",
    status: "Active",
    joinDate: "2024-01-15",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    role: "Editor",
    status: "Active",
    joinDate: "2024-02-20",
  },
  {
    id: 3,
    name: "Bob Johnson",
    email: "bob@example.com",
    role: "Viewer",
    status: "Inactive",
    joinDate: "2024-03-10",
  },
  {
    id: 4,
    name: "Alice Williams",
    email: "alice@example.com",
    role: "Admin",
    status: "Active",
    joinDate: "2024-04-05",
  },
  {
    id: 5,
    name: "Charlie Brown",
    email: "charlie@example.com",
    role: "Editor",
    status: "Active",
    joinDate: "2024-05-12",
  },
];

export default function UserViewClient({ userId }: UserViewClientProps) {
  const router = useRouter();
  const user = mockUsers.find((u) => u.id === parseInt(userId)) || mockUsers[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/users")}
            className="rounded-lg"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
              User Details
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400 mt-1">
              View user information
            </p>
          </div>
        </div>
        <Button
          onClick={() => router.push(`/users/${userId}/edit`)}
          className="bg-zinc-900 dark:bg-zinc-100 text-gray dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-300 rounded-lg gap-2"
        >
          <Edit className="h-4 w-4" />
          Edit User
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-zinc-200 dark:border-zinc-800 shadow-lg">
          <CardHeader>
            <CardTitle>User Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <p className="text-sm text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Full Name
                </p>
                <p className="font-medium text-zinc-900 dark:text-zinc-50 text-lg">
                  {user.name}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Address
                </p>
                <p className="font-medium text-zinc-900 dark:text-zinc-50">
                  {user.email}
                </p>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <p className="text-sm text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Role
                </p>
                <span className="inline-flex px-3 py-1 rounded-md text-sm font-medium bg-white-100 dark:bg-white-900 text-white-700 dark:text-white-300">
                  {user.role}
                </span>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Join Date
                </p>
                <p className="font-medium text-zinc-900 dark:text-zinc-50">
                  {user.joinDate}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Status</p>
              <span
                className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                  user.status === "Active"
                    ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                }`}
              >
                {user.status}
              </span>
            </div>

            <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
              <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-50 mb-3">
                Recent Activity
              </h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span className="text-zinc-600 dark:text-zinc-400">
                    Logged in 2 hours ago
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="h-2 w-2 rounded-full bg-white-500"></div>
                  <span className="text-zinc-600 dark:text-zinc-400">
                    Updated profile 3 days ago
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                  <span className="text-zinc-600 dark:text-zinc-400">
                    Created 5 products this month
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-zinc-200 dark:border-zinc-800 shadow-lg">
          <CardHeader>
            <CardTitle>Profile Picture</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-square rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
              <div className="text-center">
                <div className="h-24 w-24 rounded-full bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center mx-auto mb-3">
                  <span className="text-3xl font-bold text-gray dark:text-zinc-900">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  No profile picture
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
