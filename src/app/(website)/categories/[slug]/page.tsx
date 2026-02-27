"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ShoppingBagIcon,
  ArrowLeftIcon,
  StarIcon,
  SparklesIcon
} from "@heroicons/react/24/outline";
import { useCart } from "@/context/CartContext";
import api from "@/utils/api";
import toast from "react-hot-toast";

export default function DepartmentPage() {
  const params = useParams();
  const slug = params.slug;
  const { addToCart } = useCart();

  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/products/category/${slug}`);
        setCategory(res.data);
      } catch (error) {
        console.error("Error fetching category products:", error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchCategoryData();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex h-screen bg-[#0a1128] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  const filteredProducts = category?.products || [];

  return (
    <div className="bg-white min-h-screen selection:bg-blue-100">
      {/* 1. BRANDED HEADER: Consistent with Main Sections */}
      <section className="relative bg-[#0a1128] py-16 px-6 lg:px-8 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />
        </div>

        <div className="relative max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <Link
            href="/categories"
            className="group inline-flex items-center text-xs font-black uppercase tracking-widest text-blue-400 mb-8 hover:text-white transition-colors"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Departments
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-widest mb-4">
                <SparklesIcon className="h-3 w-3" /> Exclusive Store
              </div>
              <h1 className="text-4xl md:text-4xl font-black text-white tracking-tighter capitalize">
                {category?.name || slug.replace("-", " ")}
              </h1>
              <p className="mt-4 text-slate-400 font-medium max-w-md leading-relaxed">
                Experience the finest selection of {filteredProducts.length} premium products curated for the {category?.name || "modern"} collection.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PRODUCT GRID */}
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-y-16 gap-x-8 sm:grid-cols-2 lg:grid-cols-4">
            {filteredProducts.map((product) => (
              <div key={product.id} className="group flex flex-col">
                {/* Cinematic Image Container */}
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[40px] bg-gray-50 border border-gray-100 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-900/5 hover:-translate-y-2">
                  <Link href={`/products/${product.id}`}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover object-center transition-transform duration-[2000ms] ease-out group-hover:scale-110 group-hover:rotate-1"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/0 via-white/20 to-white/0 opacity-0 transition-opacity duration-1000 group-hover:opacity-100 pointer-events-none" />
                  </Link>

                  {/* Floating Action Button */}
                  <button
                    onClick={() => {
                      addToCart(product);
                      toast.success(`${product.name} added!`, {
                        style: { borderRadius: "20px", background: "#0a1128", color: "#fff", fontWeight: "bold" },
                        iconTheme: { primary: "#2563eb", secondary: "#fff" },
                      });
                    }}
                    className="absolute bottom-6 right-6 p-4 rounded-[24px] bg-blue-600 text-white opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 shadow-xl shadow-blue-500/40"
                  >
                    <ShoppingBagIcon className="h-6 w-6" />
                  </button>
                </div>

                {/* Product Meta */}
                <div className="mt-6 flex flex-col gap-1 px-2">
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1 mb-1">
                        <StarIcon className="h-3 w-3 text-yellow-400 fill-current" />
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">4.9 (Top Rated)</span>
                      </div>
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
        ) : (
          /* EMPTY STATE */
          <div className="text-center py-32 px-6 bg-gray-50 rounded-[60px] border-2 border-dashed border-gray-200">
             <div className="inline-flex p-8 bg-white rounded-[40px] shadow-xl shadow-gray-200/50 mb-8">
               <ShoppingBagIcon className="h-16 w-16 text-gray-200" />
            </div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tighter">No items found.</h2>
            <p className="text-gray-500 mt-4 max-w-sm mx-auto font-medium">We're currently restocking this department. Please check back later.</p>
            <Link
              href="/products"
              className="mt-10 inline-block bg-blue-600 text-white px-10 py-5 rounded-[24px] font-black hover:bg-gray-900 transition-all shadow-xl shadow-blue-100"
            >
              Explore Other Collections
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}