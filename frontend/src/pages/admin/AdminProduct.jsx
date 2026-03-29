import { Input } from "@/components/ui/input";
import { Edit, Search, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDispatch, useSelector } from "react-redux";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ImageUpload from "@/components/ImageUpload";
import { toast } from "sonner";
import { setProducts } from "@/redux/productSlice";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { api, getAuthConfig } from "@/lib/api";

const AdminProduct = () => {
  const { products } = useSelector((store) => store.product);
  const [editProduct, setEditProduct] = useState(null);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProducts = async () => {
      if (products.length > 0) return;

      try {
        const res = await api.get("/product/getallproducts");
        if (res.data.success) {
          dispatch(setProducts(res.data.products));
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to load products");
      }
    };

    fetchProducts();
  }, [dispatch, products.length]);

  const filteredProducts = products.filter((product) =>
    [product.productName, product.brand, product.category].join(" ").toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (sortOrder === "lowToHigh") {
    filteredProducts.sort((a, b) => a.productPrice - b.productPrice);
  } else if (sortOrder === "highToLow") {
    filteredProducts.sort((a, b) => b.productPrice - a.productPrice);
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("productName", editProduct.productName);
    formData.append("productPrice", editProduct.productPrice);
    formData.append("productDesc", editProduct.productDesc);
    formData.append("brand", editProduct.brand);
    formData.append("category", editProduct.category);

    const existingImages = editProduct.productImg
      .filter((img) => !(img instanceof File) && img.public_id)
      .map((img) => img.public_id);

    formData.append("existingImages", JSON.stringify(existingImages));

    editProduct.productImg
      .filter((img) => img instanceof File)
      .forEach((file) => {
        formData.append("files", file);
      });

    try {
      const res = await api.put(`/product/update/${editProduct._id}`, formData, getAuthConfig());
      if (res.data.success) {
        toast.success("Product updated successfully");
        const updatedProducts = products.map((product) => (product._id === editProduct._id ? res.data.product : product));
        dispatch(setProducts(updatedProducts));
        setOpen(false);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update product");
    }
  };

  const deleteProductHandler = async (productId) => {
    try {
      const remainingProducts = products.filter((product) => product._id !== productId);
      const res = await api.delete(`/product/delete/${productId}`, getAuthConfig());
      if (res.data.success) {
        toast.success("Product deleted successfully");
        dispatch(setProducts(remainingProducts));
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete product");
    }
  };

  return (
    <div className="min-h-screen px-4 pb-10 pt-24 md:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-4">
        <div>
          <h1 className="text-4xl font-bold text-slate-950">Product Inventory</h1>
          <p className="mt-2 text-sm text-slate-600">Search, update, and clean up the product catalog from one place.</p>
        </div>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative rounded-lg bg-white">
            <Input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search product..." className="w-80 pl-10" />
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          <Select onValueChange={(value) => setSortOrder(value)}>
            <SelectTrigger className="w-[200px] bg-white">
              <SelectValue placeholder="Sort by price" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="lowToHigh">Price: Low to High</SelectItem>
                <SelectItem value="highToLow">Price: High to Low</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        {filteredProducts.map((product) => (
          <Card key={product._id} className="bg-white/95 px-4 py-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-3">
                <img src={product.productImg?.[0]?.url} alt={product.productName} className="h-24 w-24 rounded-2xl object-cover" />
                <div>
                  <h2 className="max-w-xl font-semibold text-slate-950">{product.productName}</h2>
                  <p className="mt-1 text-sm text-slate-500">{product.brand} • {product.category}</p>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-slate-950">Rs. {product.productPrice}</h3>
              <div className="flex gap-3">
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Edit onClick={() => { setOpen(true); setEditProduct(product); }} size={18} className="cursor-pointer text-blue-500" />
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[625px] max-h-[740px] overflow-y-scroll">
                    <DialogHeader>
                      <DialogTitle>Edit Product</DialogTitle>
                      <DialogDescription>Make changes to your product here. Click save when you&apos;re done.</DialogDescription>
                    </DialogHeader>
                    <FieldGroup>
                      <Field>
                        <Label>Product Name</Label>
                        <Input type="text" value={editProduct?.productName || ""} onChange={handleChange} name="productName" placeholder="Product Name" required />
                      </Field>
                      <Field>
                        <Label>Price</Label>
                        <Input type="number" value={editProduct?.productPrice || ""} onChange={handleChange} placeholder="Product Price" name="productPrice" required />
                      </Field>
                    </FieldGroup>
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <Field>
                        <Label>Brand</Label>
                        <Input type="text" value={editProduct?.brand || ""} onChange={handleChange} name="brand" placeholder="Brand Name" required />
                      </Field>
                      <Field>
                        <Label>Category</Label>
                        <Input type="text" value={editProduct?.category || ""} onChange={handleChange} name="category" placeholder="Category" required />
                      </Field>
                    </div>
                    <Field className="mt-4">
                      <Label>Description</Label>
                      <Textarea name="productDesc" value={editProduct?.productDesc || ""} onChange={handleChange} placeholder="Enter brief description of product" />
                    </Field>
                    <ImageUpload productData={editProduct} setProductData={setEditProduct} />
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogClose>
                      <Button onClick={handleSave} type="submit">Save changes</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Trash2 size={18} className="cursor-pointer text-red-500" />
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This product and its uploaded images will be removed permanently.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deleteProductHandler(product._id)}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminProduct;
