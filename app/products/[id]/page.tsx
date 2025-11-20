"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AppLayout } from "@/components/AppLayout";
import Link from "next/link";
import { toast } from "sonner";
import { productApi } from "@/lib/api-client";

interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  status: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export default function ProductViewPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      const response = await productApi.getById(productId);

      if (response.success && response.data) {
        setProduct(response.data);
      } else {
        toast.error("Failed to load product");
        router.push("/products");
      }
      setLoading(false);
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId, router]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this product?")) {
      return;
    }

    const response = await productApi.delete(productId);
    if (response.success) {
      toast.success("Product deleted successfully!");
      router.push("/products");
    } else {
      toast.error(response.message || "Failed to delete product");
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-zinc-500 dark:text-zinc-400">Loading product...</p>
        </div>
      </AppLayout>
    );
  }

  if (!product) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-zinc-500 dark:text-zinc-400">Product not found</p>
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
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
              {product.name}
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400 mt-1">
              Product Details
            </p>
          </div>
          <div className="flex gap-2">
            <Link href={`/products/${productId}/edit`}>
              <Button className="bg-green-600 hover:bg-green-700 gap-2">
                <Edit className="h-4 w-4" />
                Edit
              </Button>
            </Link>
            <Button
              variant="outline"
              className="text-red-600 hover:text-red-700 hover:bg-red-50 gap-2"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle>Product Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                    Name
                  </label>
                  <p className="text-base text-zinc-900 dark:text-zinc-50 mt-1">
                    {product.name}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                    Description
                  </label>
                  <p className="text-base text-zinc-900 dark:text-zinc-50 mt-1 whitespace-pre-wrap">
                    {product.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                      Category
                    </label>
                    <p className="text-base text-zinc-900 dark:text-zinc-50 mt-1">
                      {product.category}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                      Status
                    </label>
                    <p className="mt-1">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                          product.status === "active"
                            ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                            : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                        }`}
                      >
                        {product.status}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                      Price
                    </label>
                    <p className="text-base text-zinc-900 dark:text-zinc-50 mt-1 font-semibold">
                      ${product.price.toFixed(2)}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                      Stock Quantity
                    </label>
                    <p className="text-base text-zinc-900 dark:text-zinc-50 mt-1">
                      {product.stock} units
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle>Timestamps</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                      Created At
                    </label>
                    <p className="text-base text-zinc-900 dark:text-zinc-50 mt-1">
                      {new Date(product.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                      Last Updated
                    </label>
                    <p className="text-base text-zinc-900 dark:text-zinc-50 mt-1">
                      {new Date(product.updatedAt).toLocaleString()}
                    </p>
                  </div>
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
                {product.image ? (
                  <div className="space-y-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-auto rounded-lg border-2 border-green-200"
                    />
                    <a
                      href={product.image}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-green-600 hover:text-green-700 hover:underline block"
                    >
                      View full size →
                    </a>
                  </div>
                ) : (
                  <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                    <p className="text-gray-400">No image available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
