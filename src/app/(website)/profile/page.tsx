'use client'
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/utils/api";
import Link from "next/link";
import {UserIcon} from "@heroicons/react/24/outline";
import { 
  ShoppingBagIcon, 
  MapPinIcon, 
  CheckBadgeIcon,
  ClockIcon,
  HeartIcon,
  ChevronRightIcon
} from "@heroicons/react/24/outline";

export default function ProfileDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ orders: 0, wishlist: 0 });
  const [latestOrder, setLatestOrder] = useState<any>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [ordersRes, wishlistRes] = await Promise.all([
          api.get("/orders/my-orders"),
          api.get("/wishlists/all")
        ]);
        
        setStats({
          orders: ordersRes.data.orders?.length || 0,
          wishlist: wishlistRes.data.items?.length || 0
        });

        if (ordersRes.data.orders?.length > 0) {
          setLatestOrder(ordersRes.data.orders[0]);
        }
      } catch (err) {
        console.error("Dashboard fetch error", err);
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-[#d1daeb] rounded-3xl shadow-sm border border-gray-100 p-8 relative overflow-hidden group">
        <div className="relative z-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name?.split(' ')[0]}!
          </h2>
          <p className="text-gray-500 text-sm font-medium">
            Manage your orders, update your profile, and track your favorites.
          </p>
        </div>
        {/* Subtle decorative background icon */}
        <UserIcon className="absolute -right-10 -bottom-10 h-64 w-64 text-gray-50 opacity-[0.03] group-hover:text-blue-50 transition-colors" />
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Orders', value: stats.orders, icon: ShoppingBagIcon, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Wishlist', value: stats.wishlist, icon: HeartIcon, color: 'text-red-600', bg: 'bg-red-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-[#d1daeb] p-6 rounded-2xl border border-gray-100 shadow-sm">
            <stat.icon className={`h-6 w-6 ${stat.color} mb-4`} />
            <p className="text-2xl font-black text-gray-900">{stat.value}</p>
            <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Latest Order Preview */}
        <div className="bg-[#d1daeb] rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          <div className="p-5 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
            <h3 className="font-bold text-gray-900 text-xs uppercase tracking-widest flex items-center gap-2">
              <ClockIcon className="h-4 w-4 text-blue-600" /> Latest Order
            </h3>
            {latestOrder && (
               <Link href="/profile/orders" className="text-[10px] font-bold text-blue-600 hover:underline">View All</Link>
            )}
          </div>
          <div className="p-6 flex-1">
             {latestOrder ? (
               <div className="space-y-4">
                 <div className="flex items-center justify-between">
                   <p className="text-sm font-bold text-gray-900">Order #{latestOrder.id.slice(0, 8)}</p>
                   <span className="px-2 py-0.5 rounded-lg bg-blue-50 text-blue-600 text-[10px] font-black uppercase">
                     {latestOrder.status}
                   </span>
                 </div>
                 <div className="flex  items-center gap-3 p-3 bg-[#e8e9ed] rounded-xl">
                   <div className="h-10 w-10 bg-white rounded-lg border border-gray-100 overflow-hidden">
                     <img 
                       src={latestOrder.items?.[0]?.product?.image?.startsWith('http') 
                        ? latestOrder.items[0].product.image 
                        : `http://localhost:5000/uploads/${latestOrder.items?.[0]?.product?.image}`} 
                       className="h-full w-full object-cover" 
                       alt="" 
                     />
                   </div>
                   <div className="flex-1 min-w-0">
                     <p className="text-xs font-bold text-gray-900 truncate">{latestOrder.items?.[0]?.product?.name}</p>
                     <p className="text-[10px] text-gray-400">{new Date(latestOrder.createdAt).toLocaleDateString()}</p>
                   </div>
                 </div>
                 <Link 
                   href={`profile/orders/order-details/${latestOrder.id}`}
                   className="w-full py-3 bg-gray-900 text-white rounded-xl text-xs font-black flex items-center justify-center gap-2 hover:bg-blue-600 transition"
                 >
                   Track Order <ChevronRightIcon className="h-3 w-3" />
                 </Link>
               </div>
             ) : (
               <div className="text-center py-6">
                 <p className="text-sm text-gray-500 font-medium">No recent orders found.</p>
                 <Link href="/products" className="text-xs text-blue-600 font-bold mt-2 inline-block">Start Shopping</Link>
               </div>
             )}
          </div>
        </div>

        {/* Default Address Summary */}
        <div className="bg-[#d1daeb] rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
            <h3 className="font-bold text-gray-900 text-xs uppercase tracking-widest flex items-center gap-2">
              <MapPinIcon className="h-4 w-4 text-blue-600" /> Primary Address
            </h3>
          </div>
          <div className="p-8 text-center h-full flex justify-center">
            {user?.address ? (
               <div className="text-left">
                  <p className="text-sm font-bold text-gray-900 mb-1">{user.name}</p>
                  <p className="text-sm text-gray-500 leading-relaxed">{user.address}</p>
                  <Link href="/profile/address" className="text-xs text-blue-600 font-bold mt-4 inline-block hover:underline">Edit Address</Link>
               </div>
            ) : (
              <>
                <div className="bg-gray-50 h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPinIcon className="h-6 w-6 text-gray-300" />
                </div>
                <p className="text-sm text-gray-500 font-medium">No primary address saved yet.</p>
                <Link href="/profile/address" className="text-xs text-blue-600 font-bold mt-2 inline-block">Add Address</Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Account Security Status */}
      <div className="bg-[#242c4d] rounded-3xl p-6 shadow-sm shadow-blue-100 flex items-center justify-between group">
        <div className="flex items-center gap-5">
          <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
            <CheckBadgeIcon className="h-8 w-8 text-white" />
          </div>
          <div>
            <h4 className="font-black text-white text-lg">Account Verified</h4>
            <p className="text-sm text-blue-100 font-medium">Your security settings are up to date.</p>
          </div>
        </div>
        <Link href="/profile/password" className="hidden md:flex items-center justify-center h-10 w-10 bg-white/10 hover:bg-white/20 rounded-full transition text-white">
          <ChevronRightIcon className="h-5 w-5" />
        </Link>
      </div>
    </div>
  );
}