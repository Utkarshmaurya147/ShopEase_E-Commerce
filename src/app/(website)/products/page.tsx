"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShoppingBagIcon,
  SparklesIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/react/24/outline";
import { useCart } from "@/context/CartContext";
import api from "@/utils/api";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { getImageUrl } from "@/utils/imageHelper";

export default function ProductsPage() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search");

  useEffect(() => {
    const getProducts = async () => {
      try {
        let url = "/products/all";
        if (searchQuery) {
          url += `?search=${encodeURIComponent(searchQuery)}`;
        }
        const res = await api.get(url);
        setProducts(res.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    getProducts();
  }, [searchQuery]);

  if (loading) {
    return (
      <div className="flex h-screen bg-[#0a1128] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen selection:bg-blue-100">
      {/* 1. PREMIUM HEADER: Matching the ShopEase identity */}
      <section className="relative bg-[#0a1128] py-16 px-6 lg:px-8 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />
        </div>

        <div className="relative max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-widest mb-4">
              <SparklesIcon className="h-3 w-3" /> Curated Collection
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
              {searchQuery
                ? `Results for "${searchQuery}"`
                : "Explore Everything"}
            </h1>
            <p className="mt-2 text-slate-400 font-medium max-w-md">
              Discover {products.length} premium products selected for your
              modern lifestyle.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <AdjustmentsHorizontalIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select className="appearance-none rounded-2xl border-none bg-white/5 text-white pl-10 pr-10 py-3 text-xs font-black uppercase tracking-widest focus:ring-2 focus:ring-blue-500 transition-all outline-none backdrop-blur-md cursor-pointer">
                <option value="newest" className="bg-[#0a1128]">
                  Newest
                </option>
                <option value="price-low" className="bg-[#0a1128]">
                  Price: Low
                </option>
                <option value="price-high" className="bg-[#0a1128]">
                  Price: High
                </option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PRODUCT GRID */}
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-y-16 gap-x-8 sm:grid-cols-2 lg:grid-cols-4">
          {products?.map((product) => (
            <div key={product.id} className="group flex flex-col">
              {/* Image Container with Custom Cinematic Zoom */}
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[40px] bg-gray-50 border border-gray-100 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-900/5">
                <Link href={`/products/${product.id}`}>
                  <img
                    src={getImageUrl(product.image)}
                    alt={product.name}
                    className="h-full w-full object-cover object-center transition-transform duration-[2000ms] ease-out group-hover:scale-110 group-hover:rotate-1"
                  />
                  {/* Subtle Shimmer Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/0 via-white/20 to-white/0 opacity-0 transition-opacity duration-1000 group-hover:opacity-100 pointer-events-none" />
                </Link>

                {/* Quick Add Button - Appears on Hover */}
                <button
                  onClick={() => {
                    addToCart(product);
                    toast.success(`${product.name} added!`, {
                      style: {
                        borderRadius: "20px",
                        background: "#0a1128",
                        color: "#fff",
                        fontWeight: "bold",
                      },
                      iconTheme: { primary: "#2563eb", secondary: "#fff" },
                    });
                  }}
                  className="absolute bottom-6 right-6 p-4 rounded-[24px] bg-blue-600 text-white opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 shadow-xl shadow-blue-500/40"
                >
                  <ShoppingBagIcon className="h-6 w-6" />
                </button>
              </div>

              {/* Product Info */}
              <div className="mt-6 flex flex-col gap-1 px-2">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-1">
                      {product.category?.name || "Premium"}
                    </span>
                    <Link href={`/products/${product.id}`}>
                      <h3 className="text-lg font-black text-gray-900 group-hover:text-blue-600 transition-colors leading-tight">
                        {product.name}
                      </h3>
                    </Link>
                  </div>
                  <p className="text-lg font-black text-gray-900">
                    ${product.price}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 3. EMPTY STATE */}
        {products.length === 0 && (
          <div className="text-center py-20">
            <h3 className="text-2xl font-black text-gray-900">
              No products found
            </h3>
            <p className="text-gray-500 mt-2">
              Try adjusting your search or filters.
            </p>
            <Link
              href="/products"
              className="inline-block mt-6 text-blue-600 font-bold border-b-2 border-blue-600 pb-1"
            >
              View all products
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
