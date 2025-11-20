import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AppLayout } from "@/components/AppLayout";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import User from "@/models/User";
import Newsletter from "@/models/Newsletter";
import Testimonial from "@/models/Testimonial";

async function getStats() {
  try {
    await connectDB();

    const [
      totalProducts,
      totalUsers,
      totalNewsletter,
      totalTestimonials,
      activeProducts,
      activeUsers,
      recentProducts,
      recentUsers,
      recentTestimonials,
    ] = await Promise.all([
      Product.countDocuments(),
      User.countDocuments(),
      Newsletter.countDocuments({ status: "subscribed" }),
      Testimonial.countDocuments({ status: "approved" }),
      Product.countDocuments({ status: "active" }),
      User.countDocuments({ status: "active" }),
      Product.find().sort({ createdAt: -1 }).limit(3).select("name createdAt"),
      User.find()
        .sort({ createdAt: -1 })
        .limit(3)
        .select("name email createdAt"),
      Testimonial.find()
        .sort({ createdAt: -1 })
        .limit(3)
        .select("name createdAt status"),
    ]);

    return {
      products: {
        total: totalProducts,
        active: activeProducts,
      },
      users: {
        total: totalUsers,
        active: activeUsers,
      },
      newsletter: {
        total: totalNewsletter,
      },
      testimonials: {
        total: totalTestimonials,
      },
      recentActivity: [
        ...recentProducts.map((p) => ({
          type: "product",
          title: `New product: ${p.name}`,
          time: p.createdAt,
        })),
        ...recentUsers.map((u) => ({
          type: "user",
          title: `New user: ${u.name}`,
          time: u.createdAt,
        })),
        ...recentTestimonials.map((t) => ({
          type: "testimonial",
          title: `New testimonial from ${t.name}`,
          time: t.createdAt,
        })),
      ]
        .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
        .slice(0, 5),
    };
  } catch (error) {
    console.error("Error fetching stats:", error);
    return null;
  }
}

export default async function Home() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const stats = await getStats();

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            Welcome back, {user.name}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Here's what's happening with your admin dashboard today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-green-200 dark:border-green-800 bg-white dark:bg-gray-900 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Products
              </p>
              <svg
                className="h-4 w-4 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
            <p className="text-2xl font-bold mt-2 text-gray-800 dark:text-gray-100">
              {stats?.products?.total || 0}
            </p>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
              {stats?.products?.active || 0} active
            </p>
          </div>

          <div className="rounded-lg border border-green-200 dark:border-green-800 bg-white dark:bg-gray-900 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Users
              </p>
              <svg
                className="h-4 w-4 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
            <p className="text-2xl font-bold mt-2 text-gray-800 dark:text-gray-100">
              {stats?.users?.total || 0}
            </p>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
              {stats?.users?.active || 0} active
            </p>
          </div>

          <div className="rounded-lg border border-green-200 dark:border-green-800 bg-white dark:bg-gray-900 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Newsletter
              </p>
              <svg
                className="h-4 w-4 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <p className="text-2xl font-bold mt-2 text-gray-800 dark:text-gray-100">
              {stats?.newsletter?.total || 0}
            </p>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
              Subscribers
            </p>
          </div>

          <div className="rounded-lg border border-green-200 dark:border-green-800 bg-white dark:bg-gray-900 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Testimonials
              </p>
              <svg
                className="h-4 w-4 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <p className="text-2xl font-bold mt-2 text-gray-800 dark:text-gray-100">
              {stats?.testimonials?.total || 0}
            </p>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
              Approved
            </p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-lg border border-green-200 dark:border-green-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
            Recent Activity
          </h2>
          <div className="space-y-4">
            {stats?.recentActivity && stats.recentActivity.length > 0 ? (
              stats.recentActivity.map((activity, index) => {
                const getIcon = () => {
                  switch (activity.type) {
                    case "product":
                      return (
                        <svg
                          className="h-5 w-5 text-green-600 dark:text-green-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                          />
                        </svg>
                      );
                    case "user":
                      return (
                        <svg
                          className="h-5 w-5 text-green-600 dark:text-green-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      );
                    case "testimonial":
                      return (
                        <svg
                          className="h-5 w-5 text-green-600 dark:text-green-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                          />
                        </svg>
                      );
                    default:
                      return null;
                  }
                };

                const getTimeAgo = (date: Date) => {
                  const seconds = Math.floor(
                    (new Date().getTime() - new Date(date).getTime()) / 1000
                  );
                  const intervals = {
                    year: 31536000,
                    month: 2592000,
                    week: 604800,
                    day: 86400,
                    hour: 3600,
                    minute: 60,
                  };

                  for (const [unit, secondsInUnit] of Object.entries(
                    intervals
                  )) {
                    const interval = Math.floor(seconds / secondsInUnit);
                    if (interval >= 1) {
                      return `${interval} ${unit}${
                        interval === 1 ? "" : "s"
                      } ago`;
                    }
                  }
                  return "just now";
                };

                return (
                  <div
                    key={index}
                    className={`flex items-center gap-4 ${
                      index < stats.recentActivity.length - 1
                        ? "pb-4 border-b border-green-100 dark:border-green-900"
                        : ""
                    }`}
                  >
                    <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                      {getIcon()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">
                        {activity.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {getTimeAgo(activity.time)}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                No recent activity
              </p>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
