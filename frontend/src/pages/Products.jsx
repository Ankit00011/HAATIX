import FilterSideBar from "@/components/FilterSideBar";
import React, { useCallback, useEffect, useState } from "react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setProducts } from "@/redux/productSlice";
import { api } from "@/lib/api";

const Products = () => {
  const { products } = useSelector((store) => store.product);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [brand, setBrand] = useState("All");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 999999]);
  const [sortOrder, setSortOrder] = useState("");
  const dispatch = useDispatch();

  const getAllProducts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/product/getallproducts");
      if (res.data.success) {
        setAllProducts(res.data.products);
        dispatch(setProducts(res.data.products));
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    if (allProducts.length === 0) return;
    let filtered = [...allProducts];

    if (search.trim() !== "") {
      filtered = filtered.filter((p) => p.productName?.toLowerCase().includes(search.toLowerCase()));
    }

    if (category !== "All") {
      filtered = filtered.filter((p) => p.category === category);
    }

    if (brand !== "All") {
      filtered = filtered.filter((p) => p.brand === brand);
    }

    filtered = filtered.filter((p) => p.productPrice >= priceRange[0] && p.productPrice <= priceRange[1]);

    if (sortOrder === "lowToHigh") {
      filtered.sort((a, b) => a.productPrice - b.productPrice);
    } else if (sortOrder === "highToLow") {
      filtered.sort((a, b) => b.productPrice - a.productPrice);
    }

    dispatch(setProducts(filtered));
  }, [search, category, brand, sortOrder, priceRange, allProducts, dispatch]);

  useEffect(() => {
    getAllProducts();
  }, [getAllProducts]);

  return (
    <main className="min-h-screen bg-slate-50 pb-14 pt-24 dark:bg-background">
      <div className="container-page">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-pink-600">Shop Haatix</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl dark:text-white">Explore electronics</h1>
            <p className="mt-2 text-muted-foreground">{products.length} curated products available</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="rounded-full bg-white md:hidden" onClick={() => setShowMobileFilters(!showMobileFilters)}>
              <SlidersHorizontal className="h-4 w-4" /> Filters
            </Button>
            <Select onValueChange={(value) => setSortOrder(value)}>
              <SelectTrigger className="h-11 w-[190px] rounded-full bg-white">
                <SelectValue placeholder="Sort by Price" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="lowToHigh">Price: Low to High</SelectItem>
                  <SelectItem value="highToLow">Price: High to Low</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid gap-7 md:grid-cols-[16rem_1fr]">
          <div className={`${showMobileFilters ? "block" : "hidden"} md:block`}>
            <FilterSideBar
              search={search}
              setSearch={setSearch}
              brand={brand}
              setBrand={setBrand}
              category={category}
              setCategory={setCategory}
              allProducts={allProducts}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
            />
          </div>
          <div className="min-w-0">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {loading
              ? Array.from({ length: 8 }).map((_, index) => <ProductCard key={index} product={{ productImg: [], productName: "", productPrice: 0 }} loading={loading} />)
              : products.map((product) => (
                  <ProductCard key={product._id} product={product} loading={loading} />
                ))}
          </div>
          {!loading && products.length === 0 && (
            <div className="soft-panel grid min-h-[320px] place-items-center p-8 text-center">
              <div>
                <h2 className="text-2xl font-bold text-slate-950 dark:text-white">No products found</h2>
                <p className="mt-2 text-muted-foreground">Try adjusting your filters or search term.</p>
              </div>
            </div>
          )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Products;
