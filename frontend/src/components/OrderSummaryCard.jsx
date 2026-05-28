import React from "react";
import { ShieldCheck, Truck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const formatPrice = (value = 0) => `Rs. ${Number(value || 0).toLocaleString("en-IN")}`;

const OrderSummaryCard = ({ itemCount = 0, subtotal = 0, shipping = 0, tax = 0, total = 0, children }) => {
  return (
    <Card className="premium-card sticky top-24 w-full overflow-hidden">
      <CardHeader className="border-b bg-gradient-to-br from-slate-950 to-slate-800 text-white">
        <CardTitle className="flex items-center justify-between text-xl">
          Order Summary
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/80">
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5 p-5 sm:p-6">
        <div className="space-y-3 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal</span>
            <span className="font-medium text-foreground">{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Shipping</span>
            <span className="font-medium text-foreground">{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Tax (18%)</span>
            <span className="font-medium text-foreground">{formatPrice(tax)}</span>
          </div>
        </div>
        <Separator />
        <div className="flex items-center justify-between text-lg font-semibold">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
        {children}
        <div className="grid gap-2 rounded-xl bg-slate-50 p-4 text-xs text-slate-600 dark:bg-muted/40 dark:text-muted-foreground">
          <p className="flex items-center gap-2"><Truck className="h-4 w-4 text-emerald-600" /> Free shipping on orders over Rs. 299</p>
          <p className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-blue-600" /> Secure checkout with multiple payment options</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderSummaryCard;
