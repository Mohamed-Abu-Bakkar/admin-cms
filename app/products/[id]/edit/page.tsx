"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AppLayout } from "@/components/AppLayout";
import Link from "next/link";
import { toast } from "sonner";
import { productApi } from "@/lib/api-client";
import ImageUpload from "@/components/ImageUpload";

export default function ProductEditPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id as string;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    description: "",
    status: "active",
    image: "",
  });

  useEffect(() => {
    const fetchProduct = async () => {
      setFetching(true);
      const response = await productApi.getById(productId);

      if (response.success && response.data) {
        const product = response.data;
        setFormData({
          name: product.name || "",
          category: product.category || "",
          price: product.price?.toString() || "",
          stock: product.stock?.toString() || "",
          description: product.description || "",
          status: product.status || "active",
          image: product.image || "",
        });
      } else {
        toast.error("Failed to load product");
        router.push("/products");
      }
      setFetching(false);
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData = {
        name: formData.name,
        category: formData.category,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        description: formData.description,
        status: formData.status,
        image: formData.image || undefined,
      };

      const response = await productApi.update(productId, productData);

      if (response.success) {
        toast.success("Product updated successfully!");
        router.push("/products");
      } else {
        toast.error(response.message || "Failed to update product");
      }
    } catch (error) {
      toast.error("An error occurred while updating the product");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-zinc-500 dark:text-zinc-400">Loading product...</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/products">
            <Button variant="ghost" size="icon" className="rounded-lg">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
              Edit Product
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400 mt-1">
              Update product information
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-none shadow-lg">
                <CardHeader>
                  <CardTitle>Product Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Product Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="Enter product name"
                        className="rounded-lg h-11"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                      <Input
                        id="category"
                        value={formData.category}
                        onChange={(e) =>
                          setFormData({ ...formData, category: e.target.value })
                        }
                        placeholder="e.g., Electronics"
                        className="rounded-lg h-11"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="price">Price *</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.price}
                        onChange={(e) =>
                          setFormData({ ...formData, price: e.target.value })
                        }
                        placeholder="0.00"
                        className="rounded-lg h-11"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stock">Stock Quantity *</Label>
                      <Input
                        id="stock"
                        type="number"
                        min="0"
                        value={formData.stock}
                        onChange={(e) =>
                          setFormData({ ...formData, stock: e.target.value })
                        }
                        placeholder="0"
                        className="rounded-lg h-11"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      placeholder="Enter product description"
                      className="rounded-lg min-h-32"
                      required
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="border-none shadow-lg">
                <CardHeader>
                  <CardTitle>Product Image</CardTitle>
                </CardHeader>
                <CardContent>
                  <ImageUpload
                    value={formData.image}
                    onChange={(url) => setFormData({ ...formData, image: url })}
                    disabled={loading}
                  />
                </CardContent>
              </Card>

              <Card className="border-none shadow-lg">
                <CardHeader>
                  <CardTitle>Product Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) =>
                        setFormData({ ...formData, status: value })
                      }
                    >
                      <SelectTrigger className="rounded-lg h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <div className="flex flex-col gap-3">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 rounded-lg bg-green-600 hover:bg-green-700 text-gray"
                >
                  {loading ? "Updating..." : "Update Product"}
                </Button>
                <Link href="/products" className="w-full">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-11 rounded-lg"
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
