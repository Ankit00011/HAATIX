import React, { useCallback, useEffect } from "react";
import user from "../assets/user.png";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { ShoppingBag, ShoppingCart, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { setCart } from "@/redux/productSlice";
import { toast } from "sonner";
import { api, getAuthConfig } from "@/lib/api";
import OrderSummaryCard from "@/components/OrderSummaryCard";

const Cart = () => {
  const { cart } = useSelector((store) => store.product);

  const subtotal = cart?.totalPrice || 0;
  const shipping = subtotal > 299 ? 0 : 50;
  const tax = subtotal * 0.18;
  const total = subtotal + shipping + tax;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loadCart = useCallback(async () => {
    try {
      const res = await api.get("/cart", getAuthConfig());
      if (res.data.success) {
        dispatch(setCart(res.data.cart));
      }
    } catch (error) {
      console.log(error);
    }
  }, [dispatch]);

  const handleUpdateQuantity = async (productId, type) => {
    try {
      const res = await api.put("/cart/update", { productId, type }, getAuthConfig());
      if (res.data.success) {
        dispatch(setCart(res.data.cart));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      const authConfig = getAuthConfig();
      const res = await api.delete("/cart/remove", {
        ...authConfig,
        headers: {
          ...authConfig.headers,
        },
        data: { productId },
      });
      if (res.data.success) {
        dispatch(setCart(res.data.cart));
        toast.success("Item removed from cart");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  return (
    <main className="min-h-screen bg-slate-50 pb-14 pt-24 dark:bg-background">
      {cart?.items?.length > 0 ? (
        <div className="container-page">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-pink-600">Your bag</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl dark:text-white">Shopping Cart</h1>
          </div>
          <div className="grid gap-7 lg:grid-cols-[1fr_24rem]">
            <div className="flex flex-col gap-4">
              {cart?.items?.map((product, index) => (
                <div key={index} className="premium-card p-4 sm:p-5">
                  <div className="grid gap-4 sm:grid-cols-[6rem_1fr] lg:grid-cols-[6rem_1fr_auto_auto] lg:items-center">
                    <img src={product?.productId?.productImg?.[0]?.url || user} alt={product?.productId?.productName || "Cart item"} className="h-24 w-24 rounded-2xl bg-slate-100 object-cover" />
                    <div className="min-w-0">
                      <h2 className="truncate text-base font-semibold text-slate-950 dark:text-white">{product?.productId?.productName}</h2>
                      <p className="mt-1 text-sm text-muted-foreground">Rs. {Number(product?.productId?.productPrice || 0).toLocaleString("en-IN")}</p>
                      <button onClick={() => handleRemoveItem(product.productId._id)} className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-red-600 transition hover:text-red-700">
                        <Trash2 className="h-4 w-4" /> Remove
                      </button>
                    </div>
                    <div className="flex w-max items-center gap-2 rounded-full border bg-white p-1 dark:bg-card">
                      <Button onClick={() => handleUpdateQuantity(product.productId._id, "decrease")} variant="ghost" size="icon-sm" className="rounded-full">-</Button>
                      <span className="min-w-7 text-center text-sm font-semibold">{product.quantity}</span>
                      <Button onClick={() => handleUpdateQuantity(product.productId._id, "increase")} variant="ghost" size="icon-sm" className="rounded-full">+</Button>
                    </div>
                    <p className="font-bold text-slate-950 dark:text-white">Rs. {Number((product?.productId?.productPrice || 0) * product.quantity).toLocaleString("en-IN")}</p>
                  </div>
                </div>
              ))}
            </div>
            <OrderSummaryCard itemCount={cart?.items?.length} subtotal={subtotal} shipping={shipping} tax={tax} total={total}>
              <div className="flex gap-2">
                <Input placeholder="Enter coupon code" className="h-11 rounded-full" />
                <Button variant="outline" className="rounded-full bg-transparent">Apply</Button>
              </div>
              <Button onClick={() => navigate("/address")} className="h-11 w-full rounded-full bg-slate-950 text-white hover:bg-slate-800">Proceed to Checkout</Button>
              <Button variant="outline" className="h-11 w-full rounded-full bg-transparent" asChild>
                <Link to="/products">Continue Shopping</Link>
              </Button>
            </OrderSummaryCard>
          </div>
        </div>
      ) : (
        <div className="container-page grid min-h-[70vh] place-items-center">
          <div className="soft-panel max-w-lg p-8 text-center">
            <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-pink-50">
              <ShoppingCart className="h-9 w-9 text-pink-600" />
            </div>
            <h2 className="mt-6 text-3xl font-black text-slate-950 dark:text-white">Your cart is empty</h2>
            <p className="mt-2 text-muted-foreground">Add your favorite electronics and come back when you are ready to checkout.</p>
            <Button className="mt-6 rounded-full bg-slate-950 px-6 text-white hover:bg-slate-800" asChild>
              <Link to="/products"><ShoppingBag className="h-4 w-4" /> Start Shopping</Link>
            </Button>
          </div>
        </div>
      )}
    </main>
  );
};

export default Cart;
