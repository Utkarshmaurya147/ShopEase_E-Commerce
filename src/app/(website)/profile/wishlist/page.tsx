'use client'
import { useEffect, useState } from 'react';
import api from '@/utils/api';
import Link from 'next/link';
import { HeartIcon, ShoppingCartIcon, TrashIcon, ShoppingBagIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import { useCart } from "@/context/CartContext";

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  const fetchWishlist = async () => {
    try {
      const { data } = await api.get("/wishlists/all");
      // Ensure we set the items from the backend response
      setWishlist(data.items || []);
    } catch (err) {
      console.error("Error fetching wishlist", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleRemove = async (wishlistId: number) => {
    console.log(wishlistId);
    try {
      await api.delete(`/wishlists/remove/${wishlistId}`);
      
      // Update local state immediately for a fast UI feel
      setWishlist(prev => prev.filter((item: any) => item.id !== wishlistId));
      toast.success("Removed from wishlist");
    } catch (err) {
      toast.error("Failed to remove item");
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center p-20">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="bg-[#d1daeb] rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-[#d1daeb]">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-100 rounded-lg">
            <HeartIcon className="h-6 w-6 text-red-600 fill-red-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">My Wishlist</h2>
            <p className="text-sm text-gray-500">{wishlist.length} items saved</p>
          </div>
        </div>
        <Link href="/products" className="text-sm font-bold text-blue-600 hover:text-blue-700 transition">
          Continue Shopping
        </Link>
      </div>

      <div className="p-8">
        {wishlist.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center">
            <div className="bg-gray-50 p-6 rounded-full mb-6">
              <ShoppingBagIcon className="h-12 w-12 text-gray-300" />
            </div>
            <p className="text-xl font-bold text-gray-900">Your wishlist is empty</p>
            <p className="text-gray-500 mt-2 mb-8 max-w-xs">Seems like you haven't found your favorites yet. Start exploring our latest arrivals!</p>
            <Link href="/products" className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-600 transition shadow-lg shadow-gray-200">
              Go to Shop
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {wishlist.map((item: any) => {
              const product = item.product || item.Product; // Handle potential case differences
              const imageUrl = product?.image?.startsWith("http")
                ? product.image
                : `http://localhost:3001/uploads/${product?.image}`;

              return (
                <div key={item.id} className="group relative bg-[#d1daeb] rounded-2xl p-4 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300">
                  {/* Remove Button - Absolute Positioned */}
                  <button   
                    onClick={() => handleRemove(item.id)}
                    className="absolute top-6 right-6 z-10 p-2 bg-white/80 backdrop-blur-md text-gray-400 hover:text-red-500 rounded-full shadow-sm"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>

                  <div className="flex gap-4">
                    {/* Image Container */}
                    <div className="h-28 w-28 flex-shrink-0 overflow-hidden rounded-xl border border-gray-50">
                      <img
                        src={imageUrl}
                        alt={product?.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <h3 className="text-sm font-bold text-gray-900 leading-tight mb-1 group-hover:text-blue-600 transition">
                          {product?.name}
                        </h3>
                        <p className="text-lg font-black text-gray-900">${product?.price}</p>
                      </div>

                      <button 
                        onClick={() => {
                          addToCart(product);
                          toast.success("Moved to cart!");
                        }}
                        className="w-full mt-3 bg-blue-50 text-blue-700 text-[11px] font-black py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-600 hover:text-white transition-all active:scale-95"
                      >
                        <ShoppingCartIcon className="h-3.5 w-3.5" /> ADD TO CART
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}