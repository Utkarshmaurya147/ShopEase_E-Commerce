"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  StarIcon,
  ArrowLeftIcon,
  ShoppingCartIcon,
  HeartIcon,
  ShieldCheckIcon,
  TruckIcon,
  ArrowPathIcon
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import { useCart } from "@/context/CartContext";
import api from "@/utils/api";
import toast from "react-hot-toast";
import { getImageUrl } from "@/utils/imageHelper";

export default function ProductDetailPage() {
  const params = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const fetchSingleProduct = async () => {
      try {
        const res = await api.get(`/products/${params.id}`);
        setProduct(res.data);
        checkWishlistStatus(res.data.id);
      } catch (error) {
        console.error("Error in fetching product details", error);
      } finally {
        setLoading(false);
      }
    };

    const checkWishlistStatus = async (productId) => {
      try {
        const { data } = await api.get("/wishlists/all");
        const exists = data.items?.some((item) => item.ProductId === productId);
        setIsWishlisted(exists);
      } catch (err) {
        // Stay false if unauthorized
      }
    };

    if (params.id) fetchSingleProduct();
  }, [params.id]);

  const handleWishlistToggle = async () => {
    try {
      if (isWishlisted) {
        const { data } = await api.get("/wishlists/all");
        const itemToDelete = data.items.find((item) => item.productId === product.id);
        if (itemToDelete) {
          await api.delete(`/wishlists/remove/${itemToDelete.id}`);
          setIsWishlisted(false);
          toast.success("Removed from Wishlist");
        }
      } else {
        await api.post("/wishlists/add", { productId: product.id });
        setIsWishlisted(true);
        toast.success("Saved to Wishlist");
      }
    } catch (err) {
      if (err.response?.status === 401) toast.error("Please login first");
      else toast.error("Action failed");
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
    </div>
  );

  if (!product) return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-black text-gray-900">Item not found.</h1>
      <Link href="/products" className="mt-6 px-8 py-3 bg-gray-900 text-white rounded-2xl font-bold">
        Back to Gallery
      </Link>
    </div>
  );

  return (
    <div className="bg-white min-h-screen pb-24 selection:bg-blue-100">
      {/* 1. TOP NAVIGATION BREADCRUMB */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Link href="/products" className="group inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-blue-600 transition-colors">
          <ArrowLeftIcon className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Shop
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24 items-start">
          
          {/* 2. IMAGE SECTION: Floating Card Look */}
          <div className="sticky top-32">
            <div className="relative group aspect-[4/5] rounded-[48px] overflow-hidden bg-gray-50 border border-gray-100 shadow-2xl shadow-blue-900/5">
               <img
                src={getImageUrl(product.image)}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-[3000ms] group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              
              <button 
                onClick={handleWishlistToggle}
                className="absolute top-8 right-8 p-4 rounded-3xl bg-white/80 backdrop-blur-md shadow-xl text-gray-900 hover:scale-110 active:scale-95 transition-all"
              >
                {isWishlisted ? <HeartIconSolid className="h-6 w-6 text-red-500" /> : <HeartIcon className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* 3. DETAILS SECTION: High-end Typography */}
          <div className="flex flex-col pt-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest w-fit">
              {product.category?.name || "Exclusive"}
            </div>
            
            <h1 className="text-5xl lg:text-3xl font-black text-gray-900 mt-6 tracking-tighter">
              {product.name}
            </h1>

            <div className="flex items-center mt-6 gap-1">
              {[...Array(5)].map((_, i) => (
                <StarIcon key={i} className="h-5 w-5 text-yellow-400 fill-current" />
              ))}
              <span className="ml-3 text-gray-400 text-sm font-bold tracking-tight">
                (4.9 Rating · Trusted Seller)
              </span>
            </div>

            <p className="text-4xl font-black text-gray-900 mt-8">
              ${product.price}
            </p>

            <div className="mt-8 border-t border-gray-100 pt-8">
               <p className="text-gray-500 leading-relaxed text-medium font-medium">
                {product.description || "Crafted with precision and designed for the modern lifestyle. This premium selection offers durability and style in one seamless package."}
              </p>
            </div>

            {/* ACTION BUTTONS */}
            <div className="mt-12 flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => {
                  addToCart(product);
                  toast.success(`${product.name} added!`, {
                    style: { borderRadius: "20px", background: "#0a1128", color: "#fff", fontWeight: "bold" },
                    iconTheme: { primary: "#2563eb", secondary: "#fff" },
                  });
                }}
                className="flex-1 bg-blue-600 text-white py-4 rounded-[24px] font-black text-lg hover:bg-gray-900 transition-all shadow-2xl shadow-blue-100 flex items-center justify-center gap-3 active:scale-[0.98]"
              >
                <ShoppingCartIcon className="h-6 w-6" />
                Add to Bag
              </button>
            </div>

            {/* TRUST BADGES */}
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 border-t border-gray-100">
                <div className="flex items-center gap-3">
                    <TruckIcon className="h-5 w-5 text-blue-600" />
                    <span className="text-xs font-black text-gray-900 uppercase tracking-widest">Free Shipping</span>
                </div>
                <div className="flex items-center gap-3">
                    <ShieldCheckIcon className="h-5 w-5 text-blue-600" />
                    <span className="text-xs font-black text-gray-900 uppercase tracking-widest">2 Year Warranty</span>
                </div>
                <div className="flex items-center gap-3">
                    <ArrowPathIcon className="h-5 w-5 text-blue-600" />
                    <span className="text-xs font-black text-gray-900 uppercase tracking-widest">Easy Returns</span>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}