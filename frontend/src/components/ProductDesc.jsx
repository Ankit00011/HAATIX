import React from "react";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setCart } from "@/redux/productSlice";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { api, getAuthConfig } from "@/lib/api";
import { ShoppingCart, ShieldCheck, Truck } from "lucide-react";

const ProductDesc = ({ product }) => {
  const dispatch = useDispatch();

  const addToCart = async (productId) => {
    try {
      const res = await api.post("/cart/add", { productId }, getAuthConfig());
      if (res.data.success) {
        toast.success("Product added to cart");
        dispatch(setCart(res.data.cart));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="premium-card flex flex-col gap-5 p-6 sm:p-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-pink-600">{product.category} / {product.brand}</p>
        <h1 className="mt-3 text-3xl font-black leading-tight tracking-tight text-slate-950 sm:text-4xl dark:text-white">{product.productName}</h1>
      </div>
      <p className="text-3xl font-black text-slate-950 dark:text-white">Rs. {Number(product.productPrice).toLocaleString("en-IN")}</p>
      <p className="leading-7 text-muted-foreground">{product.productDesc}</p>
      <div className="flex items-center gap-4">
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Quantity</p>
        <Input className="h-11 w-20 rounded-xl border text-center" type="number" defaultValue={1} min={1} />
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button onClick={() => addToCart(product._id)} size="lg" className="rounded-full bg-slate-950 px-7 text-white hover:bg-slate-800">
          <ShoppingCart className="h-4 w-4" /> Add to Cart
        </Button>
      </div>
      <div className="grid gap-3 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600 dark:bg-muted/40 dark:text-slate-300">
        <p className="flex items-center gap-2"><Truck className="h-4 w-4 text-emerald-600" /> Fast delivery and simple returns</p>
        <p className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-blue-600" /> Secure checkout and verified products</p>
      </div>
    </div>
  );
};

export default ProductDesc;
