"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { userApi } from "@/lib/api-client";

interface UserEditClientProps {
  userId: string;
}

export default function UserEditClient({ userId }: UserEditClientProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "user",
    status: "active",
  });

  useEffect(() => {
    const fetchUser = async () => {
      setFetching(true);
      const response = await userApi.getById(userId);

      if (response.success && response.data) {
        const user = response.data;
        setFormData({
          name: user.name || "",
          email: user.email || "",
          password: "", // Don't populate password for security
          phone: user.phone || "",
          role: user.role || "user",
          status: user.status || "active",
        });
      } else {
        toast.error("Failed to load user");
        router.push("/users");
      }
      setFetching(false);
    };

    if (userId) {
      fetchUser();
    }
  }, [userId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userData: any = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        role: formData.role,
        status: formData.status,
      };

      // Only include password if it was changed
      if (formData.password && formData.password.length >= 6) {
        userData.password = formData.password;
      }

      const response = await userApi.update(userId, userData);

      if (response.success) {
        toast.success("User updated successfully!");
        router.push("/users");
      } else {
        toast.error(response.message || "Failed to update user");
      }
    } catch (error) {
      toast.error("An error occurred while updating the user");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-zinc-500 dark:text-zinc-400">Loading user...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
            Edit User
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mt-1">
            Update user information
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-zinc-200 dark:border-zinc-800 shadow-lg">
              <CardHeader>
                <CardTitle>User Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Enter full name"
                      className="rounded-lg h-11"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="user@example.com"
                      className="rounded-lg h-11"
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="password">
                      Password (Leave empty to keep current)
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      placeholder="Enter new password"
                      className="rounded-lg h-11"
                      minLength={6}
                    />
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      Minimum 6 characters if changing
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone (Optional)</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder="+1234567890"
                      className="rounded-lg h-11"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="role">Role *</Label>
                    <Select
                      value={formData.role}
                      onValueChange={(value) =>
                        setFormData({ ...formData, role: value })
                      }
                    >
                      <SelectTrigger className="rounded-lg h-11">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="user">User</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status *</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) =>
                        setFormData({ ...formData, status: value })
                      }
                    >
                      <SelectTrigger className="rounded-lg h-11">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-zinc-200 dark:border-zinc-800 shadow-lg">
              <CardHeader>
                <CardTitle>Account Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto">
                    <User className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="text-center text-sm text-zinc-600 dark:text-zinc-400">
                    <p className="mb-2">Updating user account</p>
                    <p className="text-xs text-zinc-500">
                      Changes will be saved to database
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col gap-3">
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 rounded-lg bg-green-600 hover:bg-green-700 text-gray"
              >
                {loading ? "Updating..." : "Update User"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/users")}
                className="w-full h-11 rounded-lg"
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
