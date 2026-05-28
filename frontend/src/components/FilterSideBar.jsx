import React from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const FilterSideBar = ({ search, setSearch, category, setCategory, brand, setBrand, setPriceRange, allProducts, priceRange }) => {
  const categories = allProducts.map((p) => p.category);
  const uniqueCategory = ["All", ...new Set(categories.filter(Boolean))];

  const brands = allProducts.map((p) => p.brand);
  const uniqueBrands = ["All", ...new Set(brands.filter(Boolean))];

  const handleMinChange = (e) => {
    const value = Number(e.target.value);
    if (value <= priceRange[1]) setPriceRange([value, priceRange[1]]);
  };

  const handleMaxChange = (e) => {
    const value = Number(e.target.value);
    if (value >= priceRange[0]) setPriceRange([priceRange[0], value]);
  };

  const resetFilters = () => {
    setSearch("");
    setCategory("All");
    setBrand("All");
    setPriceRange([0, 999999]);
  };

  return (
    <aside className="soft-panel h-max w-full p-5 md:sticky md:top-24 md:w-64">
      <div className="mb-5">
        <h2 className="text-lg font-bold text-slate-950 dark:text-white">Filters</h2>
        <p className="text-sm text-muted-foreground">Refine your search</p>
      </div>

      <Input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="h-11 rounded-xl bg-white dark:bg-input/30"
      />

      <h3 className="mt-6 font-semibold">Category</h3>
      <div className="mt-3 flex flex-col gap-2">
        {uniqueCategory.map((item) => (
          <label
            key={item}
            className={`flex cursor-pointer items-center justify-between rounded-xl border px-3 py-2 text-sm transition ${
              category === item
                ? "border-slate-950 bg-slate-950 text-white dark:border-white dark:bg-white dark:text-slate-950"
                : "border-transparent bg-slate-50 text-slate-700 hover:border-slate-200 dark:bg-muted/40 dark:text-slate-200"
            }`}
          >
            <span>{item}</span>
            <input className="sr-only" type="radio" checked={category === item} onChange={() => setCategory(item)} />
          </label>
        ))}
      </div>

      <h3 className="mt-6 font-semibold">Brand</h3>
      <select
        className="mt-3 h-11 w-full rounded-xl border border-input bg-white px-3 text-sm outline-none transition focus:ring-2 focus:ring-ring/30 dark:bg-input/30"
        value={brand}
        onChange={(e) => setBrand(e.target.value)}
      >
        {uniqueBrands.map((item) => (
          <option key={item} value={item}>
            {String(item).toUpperCase()}
          </option>
        ))}
      </select>

      <h3 className="mb-3 mt-6 font-semibold">Price Range</h3>
      <div className="flex flex-col gap-3 text-sm">
        <label className="text-muted-foreground">
          Rs. {priceRange[0].toLocaleString("en-IN")} - Rs. {priceRange[1].toLocaleString("en-IN")}
        </label>
        <div className="flex items-center gap-2">
          <input type="number" min="0" max="5000" value={priceRange[0]} onChange={handleMinChange} className="h-10 w-full rounded-lg border border-input px-2" />
          <span>-</span>
          <input type="number" min="0" max="999999" value={priceRange[1]} onChange={handleMaxChange} className="h-10 w-full rounded-lg border border-input px-2" />
        </div>
        <input type="range" min="0" max="5000" step="100" className="w-full accent-slate-950" value={priceRange[0]} onChange={handleMinChange} />
        <input type="range" min="0" max="999999" step="100" className="w-full accent-slate-950" value={priceRange[1]} onChange={handleMaxChange} />
      </div>

      <Button onClick={resetFilters} variant="outline" className="mt-6 w-full cursor-pointer rounded-full bg-transparent">
        Reset Filters
      </Button>
    </aside>
  );
};

export default FilterSideBar;
