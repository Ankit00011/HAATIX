import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, BadgeIndianRupee, Package, ShoppingCart, TrendingUp, Users } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, getAuthConfig } from "@/lib/api";
import { toast } from "sonner";

const formatCurrency = (value = 0) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

const formatDate = (value) =>
  new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const statsConfig = [
  { key: "totalRevenue", label: "Revenue", icon: BadgeIndianRupee, accent: "from-amber-100 to-orange-100", formatter: formatCurrency },
  { key: "totalOrders", label: "Orders", icon: ShoppingCart, accent: "from-rose-100 to-pink-100" },
  { key: "paidOrders", label: "Paid Orders", icon: TrendingUp, accent: "from-emerald-100 to-teal-100" },
  { key: "totalUsers", label: "Customers", icon: Users, accent: "from-sky-100 to-cyan-100" },
  { key: "totalProducts", label: "Products", icon: Package, accent: "from-violet-100 to-fuchsia-100" },
];

const AdminSales = () => {
  const [overview, setOverview] = useState({
    stats: {},
    recentOrders: [],
    monthlySales: [],
    bestSellingProducts: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const res = await api.get("/admin/overview", getAuthConfig());
        if (res.data.success) {
          setOverview(res.data.overview);
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to load dashboard overview");
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, []);

  return (
    <div className="min-h-screen px-4 pb-10 pt-24 md:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="rounded-[32px] border border-orange-100 bg-[linear-gradient(135deg,#fff7ed_0%,#fff1f2_45%,#ffffff_100%)] p-8 shadow-[0_30px_80px_rgba(251,113,133,0.10)]">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-rose-400">Admin overview</p>
          <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-slate-950">Business dashboard</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                Track revenue, order health, and product momentum from one place.
              </p>
            </div>
            <div className="rounded-3xl bg-slate-950 px-5 py-4 text-white">
              <p className="text-sm text-white/70">Payment success rate</p>
              <p className="mt-1 text-3xl font-bold">{overview.stats.conversionRate || 0}%</p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {statsConfig.map(({ key, label, icon: Icon, accent, formatter }) => (
            <Card key={key} className="border-white/60 bg-white/90 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
              <CardContent className="p-5">
                <div className={`flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br ${accent}`}>
                  <Icon className="size-5 text-slate-900" />
                </div>
                <p className="mt-4 text-sm text-slate-500">{label}</p>
                <h2 className="mt-2 text-3xl font-bold text-slate-950">
                  {loading ? "..." : formatter ? formatter(overview.stats[key]) : overview.stats[key] || 0}
                </h2>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <Card className="border-white/70 bg-white/95">
            <CardHeader>
              <CardTitle>Sales trend</CardTitle>
              <CardDescription>Last six months of paid order revenue.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {overview.monthlySales.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-sm text-slate-500">
                  No paid order history yet.
                </div>
              ) : (
                overview.monthlySales.map((month) => (
                  <div key={month.label} className="rounded-2xl border border-slate-100 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{month.label}</p>
                        <p className="text-xs text-slate-500">{month.orders} orders</p>
                      </div>
                      <p className="text-lg font-bold text-slate-950">{formatCurrency(month.revenue)}</p>
                    </div>
                    <div className="mt-4 h-2 rounded-full bg-slate-100">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-orange-400 via-rose-400 to-pink-500"
                        style={{
                          width: `${Math.max(
                            10,
                            (month.revenue / Math.max(...overview.monthlySales.map((item) => item.revenue), 1)) * 100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="border-white/70 bg-white/95">
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
              <div>
                <CardTitle>Recent orders</CardTitle>
                <CardDescription>Newest transactions in the store.</CardDescription>
              </div>
              <Button asChild variant="outline">
                <Link to="/dashboard/orders">
                  View all
                  <ArrowRight />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {overview.recentOrders.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-sm text-slate-500">
                  No orders available right now.
                </div>
              ) : (
                overview.recentOrders.map((order) => (
                  <div key={order._id} className="rounded-2xl border border-slate-100 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-slate-900">
                          {order.user?.firstName} {order.user?.lastName}
                        </p>
                        <p className="text-xs text-slate-500">{order.user?.email || "No email"}</p>
                      </div>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                        {order.status}
                      </span>
                    </div>
                    <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
                      <span>{formatDate(order.createdAt)}</span>
                      <span className="font-semibold text-slate-950">{formatCurrency(order.amount)}</span>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="border-white/70 bg-white/95">
          <CardHeader>
            <CardTitle>Best selling products</CardTitle>
            <CardDescription>Products generating the strongest momentum from paid orders.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {overview.bestSellingProducts.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-sm text-slate-500">
                Best seller data will appear after successful orders.
              </div>
            ) : (
              overview.bestSellingProducts.map((product) => (
                <div key={product._id} className="rounded-3xl border border-slate-100 p-4">
                  <div className="flex gap-4">
                    <img
                      src={product.productImg?.[0]?.url}
                      alt={product.productName}
                      className="h-20 w-20 rounded-2xl object-cover"
                    />
                    <div className="min-w-0">
                      <p className="line-clamp-2 font-semibold text-slate-950">{product.productName}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.25em] text-slate-400">{product.category}</p>
                      <p className="mt-4 text-sm text-slate-500">{product.unitsSold} units sold</p>
                      <p className="text-lg font-bold text-slate-950">{formatCurrency(product.revenue)}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminSales;
