import React from "react";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setCart } from "@/redux/productSlice";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { api, getAuthConfig } from "@/lib/api";

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
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">{product.productName}</h1>
      <p className="text-gray-500 text-sm">{product.category} | {product.brand}</p>
      <p className="text-xl text-pink-500 font-bold">Rs. {product.productPrice}</p>
      <p className="line-clamp-12 text-muted-foreground">{product.productDesc}</p>
      <div className="flex items-center gap-5 mt-5">
        <p className="text-gray-800">Quantity :</p>
        <Input className="w-14 border text-center" type="number" defaultValue={1} />
      </div>
      <div className="flex gap-5 mt-5">
        <Button onClick={() => addToCart(product._id)} className="px-5 py-2 bg-pink-500 text-white rounded">
          Add to Cart
        </Button>
      </div>
    </div>
  );
};

export default ProductDesc;
