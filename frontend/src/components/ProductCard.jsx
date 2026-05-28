import { Eye, ShoppingCart } from "lucide-react";
import React from "react";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import { toast } from "sonner";
import { setCart } from "@/redux/productSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { api, getAuthConfig } from "@/lib/api";

const ProductCard = ({ product, loading }) => {
  const { productImg, productPrice, productName } = product;
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
    <div className="group h-full overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_24px_70px_rgba(15,23,42,0.12)] dark:border-white/10 dark:bg-card">
      <div className="relative aspect-square w-full overflow-hidden bg-slate-50 dark:bg-muted/30">
        {loading ? (
          <Skeleton className="h-full w-full rounded-none" />
        ) : (
          <>
            <img
              onClick={() => navigate(`/products/${product._id}`)}
              src={productImg[0]?.url}
              alt={productName}
              className="h-full w-full cursor-pointer object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <button
              onClick={() => navigate(`/products/${product._id}`)}
              className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-slate-900 opacity-0 shadow-md backdrop-blur transition-all duration-300 hover:bg-white group-hover:opacity-100"
              aria-label={`View ${productName}`}
            >
              <Eye className="h-4 w-4" />
            </button>
          </>
        )}
      </div>
      {loading ? (
        <div className="space-y-3 p-4">
          <Skeleton className="h-4 w-11/12" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-10 w-full rounded-full" />
        </div>
      ) : (
        <div className="space-y-3 p-4">
          <h1 className="line-clamp-2 min-h-11 text-sm font-semibold leading-6 text-slate-900 dark:text-white">{productName}</h1>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-950 dark:text-white">Rs. {Number(productPrice).toLocaleString("en-IN")}</h2>
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">In stock</span>
          </div>
          <Button onClick={() => addToCart(product._id)} className="w-full rounded-full bg-slate-950 text-white hover:bg-slate-800">
            <ShoppingCart />
            Add to Cart
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
