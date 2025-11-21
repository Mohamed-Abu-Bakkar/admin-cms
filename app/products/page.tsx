"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Eye, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
}

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);
    const response = await productApi.getAll(searchQuery);
    if (response.success && response.data) {
      setProducts(response.data);
    } else {
      toast.error(response.message || "Failed to fetch products");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearch = () => {
    fetchProducts();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) {
      return;
    }

    const response = await productApi.delete(id);
    if (response.success) {
      toast.success("Product deleted successfully!");
      fetchProducts();
    } else {
      toast.error(response.message || "Failed to delete product");
    }
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
              Products
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400 mt-1">
              Manage your product inventory
            </p>
          </div>
          <Link href="/products/add">
            <Button className="dark:bg-zinc-100 text-gray dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-200 rounded-lg gap-2">
              <Plus className="h-4 w-4" />
              Add Product
            </Button>
          </Link>
        </div>

        <Card className="border-none shadow-lg p-6">
          <div className="mb-6">
            <div className="relative flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="pl-9 rounded-lg h-11"
                />
              </div>
              <Button
                onClick={handleSearch}
                className="bg-green-600 hover:bg-green-700"
              >
                Search
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-zinc-500 dark:text-zinc-400">
                Loading products...
              </p>
            </div>
          ) : (
            <>
              {/* Product Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <Card
                    key={product._id}
                    className="border-none shadow-lg hover:shadow-xl transition-shadow overflow-hidden"
                  >
                    {/* Product Image */}
                    <div className="relative aspect-square bg-gray-50">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <span className="text-gray-400 text-sm">
                            No image
                          </span>
                        </div>
                      )}
                      {/* Status Badge */}
                      <div className="absolute top-3 right-3">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                            product.status === "active"
                              ? "bg-green-500 text-white"
                              : "bg-gray-500 text-white"
                          }`}
                        >
                          {product.status}
                        </span>
                      </div>
                    </div>

                    {/* Product Info */}
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div>
                          <h3 className="font-semibold text-lg text-zinc-900 dark:text-zinc-50 line-clamp-1">
                            {product.name}
                          </h3>
                          <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-1">
                            {product.category}
                          </p>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">
                              Price
                            </p>
                            <p className="text-xl font-bold text-green-600">
                              ${product.price.toFixed(2)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">
                              Stock
                            </p>
                            <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                              {product.stock}
                            </p>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-2 border-t border-zinc-200 dark:border-zinc-800">
                          <Link
                            href={`/products/${product._id}`}
                            className="flex-1"
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full gap-2"
                            >
                              <Eye className="h-4 w-4" />
                              View
                            </Button>
                          </Link>
                          <Link
                            href={`/products/${product._id}/edit`}
                            className="flex-1"
                          >
                            <Button
                              size="sm"
                              className="w-full gap-2 bg-green-600 hover:bg-green-700"
                            >
                              <Edit className="h-4 w-4" />
                              Edit
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDelete(product._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredProducts.length === 0 && !loading && (
                <div className="text-center py-12">
                  <p className="text-zinc-500 dark:text-zinc-400">
                    No products found
                  </p>
                </div>
              )}
            </>
          )}
        </Card>
      </div>
    </AppLayout>
  );
}
