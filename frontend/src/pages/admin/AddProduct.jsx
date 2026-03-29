import ImageUpload from "@/components/ImageUpload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { setProducts } from "@/redux/productSlice";
import { api, getAuthConfig } from "@/lib/api";

const AddProduct = () => {
  const dispatch = useDispatch();
  const { products } = useSelector((store) => store.product);
  const [loading, setLoading] = useState(false);
  const [productData, setProductData] = useState({
    productName: "",
    productPrice: 0,
    brand: "",
    category: "",
    productDesc: "",
    productImg: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("productName", productData.productName);
    formData.append("productPrice", productData.productPrice);
    formData.append("brand", productData.brand);
    formData.append("category", productData.category);
    formData.append("productDesc", productData.productDesc);

    if (productData.productImg.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    productData.productImg.forEach((img) => {
      formData.append("files", img);
    });

    try {
      setLoading(true);
      const res = await api.post("/product/add", formData, getAuthConfig());
      if (res.data.success) {
        dispatch(setProducts([...products, res.data.product]));
        toast.success("Product added successfully");
        setProductData({
          productName: "",
          productPrice: 0,
          brand: "",
          category: "",
          productDesc: "",
          productImg: [],
        });
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-4 pb-10 pt-24 md:px-8">
      <div className="mx-auto max-w-4xl">
        <Card className="w-full bg-white/95">
          <CardHeader>
            <CardTitle>Add Product</CardTitle>
            <CardDescription>Enter product details below</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div className="grid gap-2">
                <Label>Product Name</Label>
                <Input type="text" name="productName" value={productData.productName} onChange={handleChange} placeholder="Product Name" required />
              </div>
              <div className="grid gap-2">
                <Label>Price</Label>
                <Input type="number" name="productPrice" value={productData.productPrice} onChange={handleChange} placeholder="Product Price" required />
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label>Brand</Label>
                  <Input type="text" name="brand" value={productData.brand} onChange={handleChange} placeholder="Product Brand" required />
                </div>
                <div className="grid gap-2">
                  <Label>Category</Label>
                  <Input type="text" name="category" value={productData.category} onChange={handleChange} placeholder="Product Category" required />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Description</Label>
                <Textarea name="productDesc" value={productData.productDesc} onChange={handleChange} placeholder="Enter brief description of product" />
              </div>
              <ImageUpload productData={productData} setProductData={setProductData} />
            </div>
            <CardFooter className="px-0">
              <Button disabled={loading} onClick={submitHandler} type="button" className="mt-6 w-full bg-pink-600 cursor-pointer">
                {loading ? "Adding Product..." : "Add Product"}
              </Button>
            </CardFooter>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddProduct;
