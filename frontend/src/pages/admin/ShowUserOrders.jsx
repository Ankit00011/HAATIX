import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api, getAuthConfig } from "@/lib/api";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

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

const ShowUserOrders = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState({
    user: null,
    orders: [],
    summary: {},
  });

  useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        const res = await api.get(`/admin/users/${userId}/orders`, getAuthConfig());
        if (res.data.success) {
          setData({
            user: res.data.user,
            orders: res.data.orders,
            summary: res.data.summary,
          });
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to load user orders");
      }
    };

    fetchUserOrders();
  }, [userId]);

  return (
    <div className="min-h-screen px-4 pb-10 pt-24 md:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Button variant="outline" onClick={() => navigate(-1)}>
              <ArrowLeft />
              Back
            </Button>
            <p className="mt-5 text-sm font-semibold uppercase tracking-[0.35em] text-rose-400">User order history</p>
            <h1 className="mt-3 text-4xl font-bold text-slate-950">{data.user?.firstName} {data.user?.lastName}</h1>
            <p className="mt-2 text-sm text-slate-600">{data.user?.email}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <Card className="bg-white/90"><CardContent className="p-4"><p className="text-xs uppercase tracking-[0.25em] text-slate-400">Orders</p><p className="mt-2 text-2xl font-bold text-slate-950">{data.summary.totalOrders || 0}</p></CardContent></Card>
            <Card className="bg-white/90"><CardContent className="p-4"><p className="text-xs uppercase tracking-[0.25em] text-slate-400">Paid</p><p className="mt-2 text-2xl font-bold text-emerald-600">{data.summary.paidOrders || 0}</p></CardContent></Card>
            <Card className="bg-white/90"><CardContent className="p-4"><p className="text-xs uppercase tracking-[0.25em] text-slate-400">Revenue</p><p className="mt-2 text-2xl font-bold text-slate-950">{formatCurrency(data.summary.totalRevenue || 0)}</p></CardContent></Card>
          </div>
        </div>

        <Card className="bg-white/95">
          <CardHeader>
            <CardTitle>Customer profile</CardTitle>
            <CardDescription>Quick account details for support and follow-up.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div><p className="text-xs uppercase tracking-[0.25em] text-slate-400">Role</p><p className="mt-2 font-semibold text-slate-950">{data.user?.role || "user"}</p></div>
            <div><p className="text-xs uppercase tracking-[0.25em] text-slate-400">Phone</p><p className="mt-2 font-semibold text-slate-950">{data.user?.phoneNo || "Not added"}</p></div>
            <div><p className="text-xs uppercase tracking-[0.25em] text-slate-400">City</p><p className="mt-2 font-semibold text-slate-950">{data.user?.city || "Not added"}</p></div>
            <div><p className="text-xs uppercase tracking-[0.25em] text-slate-400">Address</p><p className="mt-2 font-semibold text-slate-950">{data.user?.address || "Not added"}</p></div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {data.orders.length === 0 ? (
            <Card className="bg-white/95"><CardContent className="p-8 text-sm text-slate-500">This user has not placed any orders yet.</CardContent></Card>
          ) : (
            data.orders.map((order) => (
              <Card key={order._id} className="bg-white/95">
                <CardContent className="space-y-4 p-6">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Order ID</p>
                      <p className="mt-1 font-semibold text-slate-950">{order._id}</p>
                      <p className="mt-2 text-sm text-slate-500">{formatDate(order.createdAt)}</p>
                    </div>
                    <div className="text-left lg:text-right">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{order.status}</span>
                      <p className="mt-3 text-2xl font-bold text-slate-950">{formatCurrency(order.amount)}</p>
                    </div>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {order.products.map((item, index) => (
                      <div key={`${order._id}-${index}`} className="rounded-2xl border border-slate-100 p-3">
                        <div className="flex gap-3">
                          <img src={item.productId?.productImg?.[0]?.url} alt={item.productId?.productName} className="h-16 w-16 rounded-xl object-cover" />
                          <div>
                            <p className="font-semibold text-slate-900">{item.productId?.productName || "Removed product"}</p>
                            <p className="text-sm text-slate-500">{item.productId?.brand || "Unknown brand"}</p>
                            <p className="mt-2 text-xs uppercase tracking-[0.25em] text-slate-400">Quantity {item.quantity}</p>
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

export default ShowUserOrders;
