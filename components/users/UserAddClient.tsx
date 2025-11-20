"use client";

import { useState } from "react";
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

export default function UserAddClient() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "user",
    status: "active",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone || undefined,
        role: formData.role,
        status: formData.status,
      };

      const response = await userApi.create(userData);

      if (response.success) {
        toast.success("User added successfully!");
        router.push("/users");
      } else {
        toast.error(response.message || "Failed to add user");
      }
    } catch (error) {
      toast.error("An error occurred while adding the user");
    } finally {
      setLoading(false);
    }
  };

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
            Add User
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mt-1">
            Create a new user account
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
                    <Label htmlFor="password">Password *</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      placeholder="Minimum 6 characters"
                      className="rounded-lg h-11"
                      minLength={6}
                      required
                    />
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
                    <p className="mb-2">Creating new user account</p>
                    <p className="text-xs text-zinc-500">
                      User will receive login credentials
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
                {loading ? "Creating..." : "Create User"}
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
