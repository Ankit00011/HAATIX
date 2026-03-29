import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import React, { useEffect, useState } from "react";
import { api, getAuthConfig } from "@/lib/api";
import { toast } from "sonner";
import { Search } from "lucide-react";

const formatCurrency = (value = 0) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

const formatDateTime = (value) =>
  new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [summary, setSummary] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/admin/orders", getAuthConfig());
        if (res.data.success) {
          setOrders(res.data.orders);
          setSummary(res.data.summary);
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to load admin orders");
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    const searchable = [
      order._id,
      order.razorpayOrderId,
      order.razorpayPaymentId,
      order.user?.firstName,
      order.user?.lastName,
      order.user?.email,
      ...order.products.map((item) => item.productId?.productName),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const matchesSearch = searchable.includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" ? true : order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen px-4 pb-10 pt-24 md:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-rose-400">Order management</p>
            <h1 className="mt-3 text-4xl font-bold text-slate-950">Orders</h1>
            <p className="mt-2 text-sm text-slate-600">Monitor payments, customers, and product lines from a single queue.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-4">
            <Card className="bg-white/90"><CardContent className="p-4"><p className="text-xs uppercase tracking-[0.25em] text-slate-400">All</p><p className="mt-2 text-2xl font-bold text-slate-950">{summary.totalOrders || 0}</p></CardContent></Card>
            <Card className="bg-white/90"><CardContent className="p-4"><p className="text-xs uppercase tracking-[0.25em] text-slate-400">Paid</p><p className="mt-2 text-2xl font-bold text-emerald-600">{summary.paidOrders || 0}</p></CardContent></Card>
            <Card className="bg-white/90"><CardContent className="p-4"><p className="text-xs uppercase tracking-[0.25em] text-slate-400">Pending</p><p className="mt-2 text-2xl font-bold text-amber-500">{summary.pendingOrders || 0}</p></CardContent></Card>
            <Card className="bg-white/90"><CardContent className="p-4"><p className="text-xs uppercase tracking-[0.25em] text-slate-400">Revenue</p><p className="mt-2 text-2xl font-bold text-slate-950">{formatCurrency(summary.totalRevenue || 0)}</p></CardContent></Card>
          </div>
        </div>

        <Card className="bg-white/95">
          <CardHeader>
            <CardTitle>Filter orders</CardTitle>
            <CardDescription>Search by customer, order id, payment id, or product name.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-[1fr_220px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <Input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search orders..." className="pl-10" />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger><SelectValue placeholder="Filter by status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="Paid">Paid</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <Card className="bg-white/95"><CardContent className="p-8 text-sm text-slate-500">No orders matched your filters.</CardContent></Card>
          ) : (
            filteredOrders.map((order) => (
              <Card key={order._id} className="bg-white/95">
                <CardContent className="space-y-5 p-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-lg font-bold text-slate-950">{order.user?.firstName} {order.user?.lastName}</h2>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{order.status}</span>
                      </div>
                      <p className="mt-1 text-sm text-slate-500">{order.user?.email || "No email"}</p>
                      <p className="mt-2 text-xs text-slate-400">Order ID: {order._id}</p>
                      <p className="mt-1 text-xs text-slate-400">Razorpay: {order.razorpayOrderId || "Not created"}</p>
                    </div>
                    <div className="text-left lg:text-right">
                      <p className="text-sm text-slate-500">{formatDateTime(order.createdAt)}</p>
                      <p className="mt-2 text-2xl font-bold text-slate-950">{formatCurrency(order.amount)}</p>
                      <p className="text-xs text-slate-400">Tax {formatCurrency(order.tax)} • Shipping {formatCurrency(order.shipping)}</p>
                    </div>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {order.products.map((item, index) => (
                      <div key={`${order._id}-${index}`} className="rounded-2xl border border-slate-100 p-3">
                        <div className="flex gap-3">
                          <img src={item.productId?.productImg?.[0]?.url} alt={item.productId?.productName} className="h-16 w-16 rounded-xl object-cover" />
                          <div className="min-w-0">
                            <p className="line-clamp-2 font-semibold text-slate-900">{item.productId?.productName || "Removed product"}</p>
                            <p className="mt-1 text-sm text-slate-500">{item.productId?.brand || "Unknown brand"}</p>
                            <p className="mt-2 text-xs uppercase tracking-[0.25em] text-slate-400">Qty {item.quantity}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
