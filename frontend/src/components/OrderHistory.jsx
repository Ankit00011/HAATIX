import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PackageCheck, PackageSearch, RefreshCw, Truck } from "lucide-react";
import { api, getAuthConfig } from "@/lib/api";
import { toast } from "sonner";

const formatCurrency = (value = 0) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

const formatDate = (value) =>
  new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);

  const getMyOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get("/order/my-orders", getAuthConfig());
      if (res.data.success) {
        setOrders(res.data.orders);
        setSummary(res.data.summary);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load order history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMyOrders();
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-white/95">
          <CardContent className="p-5">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Total Orders</p>
            <p className="mt-2 text-3xl font-bold text-slate-950">{summary.totalOrders || 0}</p>
          </CardContent>
        </Card>
        <Card className="bg-white/95">
          <CardContent className="p-5">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Ongoing</p>
            <p className="mt-2 text-3xl font-bold text-amber-500">{summary.activeOrders || 0}</p>
          </CardContent>
        </Card>
        <Card className="bg-white/95">
          <CardContent className="p-5">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Delivered</p>
            <p className="mt-2 text-3xl font-bold text-emerald-600">{summary.deliveredOrders || 0}</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-950">Order History</h2>
          <p className="mt-1 text-sm text-slate-600">See every order you have placed and track active ones.</p>
        </div>
        <Button variant="outline" onClick={getMyOrders} disabled={loading}>
          <RefreshCw className={loading ? "animate-spin" : ""} />
          Refresh
        </Button>
      </div>

      {loading ? (
        <Card className="bg-white/95">
          <CardContent className="p-8 text-sm text-slate-500">Loading your orders...</CardContent>
        </Card>
      ) : orders.length === 0 ? (
        <Card className="bg-white/95">
          <CardContent className="flex flex-col items-center gap-4 p-10 text-center">
            <PackageSearch className="size-12 text-slate-300" />
            <div>
              <h3 className="text-lg font-semibold text-slate-950">No orders yet</h3>
              <p className="mt-1 text-sm text-slate-500">Your order history will appear here after your first purchase.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-5">
          {orders.map((order) => (
            <Card key={order._id} className="overflow-hidden bg-white/95">
              <CardHeader className="border-b border-slate-100">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <CardTitle className="text-xl">Order #{order._id.slice(-8).toUpperCase()}</CardTitle>
                    <CardDescription className="mt-2">Placed on {formatDate(order.createdAt)}</CardDescription>
                    <p className="mt-2 text-sm text-slate-500">Payment: {order.status} • Fulfillment: {order.tracking.fulfillmentStatus}</p>
                  </div>
                  <div className="text-left lg:text-right">
                    <p className="text-2xl font-bold text-slate-950">{formatCurrency(order.amount)}</p>
                    <p className="text-sm text-slate-500">Tax {formatCurrency(order.tax)} • Shipping {formatCurrency(order.shipping)}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {order.products.map((item, index) => (
                    <div key={`${order._id}-${index}`} className="rounded-2xl border border-slate-100 p-3">
                      <div className="flex gap-3">
                        <img
                          src={item.productId?.productImg?.[0]?.url}
                          alt={item.productId?.productName}
                          className="h-16 w-16 rounded-xl object-cover"
                        />
                        <div className="min-w-0">
                          <p className="line-clamp-2 font-semibold text-slate-900">{item.productId?.productName || "Removed product"}</p>
                          <p className="mt-1 text-sm text-slate-500">{item.productId?.brand || "Unknown brand"}</p>
                          <p className="mt-2 text-xs uppercase tracking-[0.25em] text-slate-400">Qty {item.quantity}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="rounded-3xl border border-slate-100 bg-slate-50/60 p-5">
                  <div className="flex items-center gap-2">
                    {order.tracking.isOngoing ? (
                      <Truck className="size-5 text-amber-500" />
                    ) : (
                      <PackageCheck className="size-5 text-emerald-600" />
                    )}
                    <h3 className="font-semibold text-slate-950">
                      {order.tracking.isOngoing ? "Live tracking" : "Order timeline"}
                    </h3>
                  </div>
                  <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {order.tracking.steps.map((step) => (
                      <div
                        key={step.key}
                        className={`rounded-2xl border p-4 ${
                          step.active
                            ? "border-amber-300 bg-amber-50"
                            : step.completed
                              ? "border-emerald-200 bg-emerald-50/80"
                              : "border-slate-200 bg-white"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-semibold text-slate-950">{step.label}</p>
                          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                            {step.active ? "Current" : step.completed ? "Done" : "Pending"}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-slate-600">{step.description}</p>
                        {step.timestamp ? <p className="mt-3 text-xs text-slate-400">{formatDate(step.timestamp)}</p> : null}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
