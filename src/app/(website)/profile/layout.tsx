'use client'
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext'; 
import { 
  ShoppingBagIcon, UserIcon, MapPinIcon, HeartIcon, 
  BellIcon, LockClosedIcon, ArrowRightOnRectangleIcon,
  ChevronRightIcon
} from "@heroicons/react/24/outline";

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const menuItems = [
    { name: 'Info', fullName: 'Personal Information', icon: UserIcon, href: '/profile/info' },
    { name: 'Address', fullName: 'Address', icon: MapPinIcon, href: '/profile/address' },
    { name: 'Wishlist', fullName: 'Wishlist', icon: HeartIcon, href: '/profile/wishlist' },
    { name: 'Orders', fullName: 'My Orders', icon: ShoppingBagIcon, href: '/profile/orders' },
    { name: 'Alerts', fullName: 'Notifications', icon: BellIcon, href: '/profile/notifications' },
    { name: 'Security', fullName: 'Change Password', icon: LockClosedIcon, href: '/profile/password' },
  ];

  return (
    <div className="relative bg-[#0a1128] py-10 lg:py-14 mb-8 lg:mb-12">
      {/* Shared Hero Section */}
      {/* 1. Subtle Background Accents (The "Modern" Look) */}
      {/* <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px]"></div>
      </div> */}

      <div className="relative max-w-7xl mx-auto px-6 text-center mb-4">
        {/* 2. Personalized Badge */}
        {user && (
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-widest mb-4 animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Active Session
          </div>
        )}

        {/* 3. Typography with better weighting */}
        <h1 className="text-3xl lg:text-4xl font-black text-white mb-4 tracking-tighter">
          {user ? `Welcome, ${user.name.split(" ")[0]}!` : "My Account"}
        </h1>

        {/* 4. Breadcrumbs with better contrast */}
        <nav className="flex justify-center items-center gap-3 text-sm font-semibold">
          <Link 
            href="/" 
            className="text-gray-400 hover:text-white transition-colors duration-200"
          >
            Home
          </Link>
          <div className="w-1 h-1 rounded-full bg-gray-600" /> {/* Dot separator looks cleaner than "/" */}
          <span className="text-blue-500">Account Settings</span>
        </nav>
      </div>

      {/* Mobile Horizontal Scroll Navigation (Hidden on LG) */}
      <div className="lg:hidden px-6 mb-6">
        <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide no-scrollbar">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all border ${
                pathname === item.href 
                ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-100' 
                : 'bg-white text-gray-500 border-gray-100'
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar Navigation (Hidden on Mobile) */}
        <aside className="hidden lg:block lg:col-span-1">
          <div className="bg-[#d1daeb] rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-32">
            <div className="flex items-center gap-4 mb-4 pb-6 border-b border-gray-50">
              <div className="h-12 w-12 bg-blue-50 rounded-full flex items-center justify-center border border-blue-100">
                <UserIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] uppercase font-black text-gray-400 mb-0.5">Welcome back,</p>
                <h3 className="text-sm font-bold text-gray-900 truncate">{user?.name}</h3>
              </div>
            </div>
            
            <nav className="space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between group px-4 py-3 text-sm font-bold rounded-xl transition-all ${
                    pathname === item.href 
                    ? 'bg-[#1b42e0] text-white shadow-md shadow-blue-100' 
                    : 'text-gray-500 hover:bg-[#e6e8f0] hover:text-blue-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className={`h-5 w-5 ${pathname === item.href ? 'text-white' : 'text-gray-600 group-hover:text-blue-600'}`} />
                    {item.fullName}
                  </div>
                  {pathname === item.href && <ChevronRightIcon className="h-4 w-4 text-white/50" />}
                </Link>
              ))}
              
              <button 
                onClick={logout} 
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-[#1b42e0] hover:bg-red-50 rounded-xl transition mt-6 border border-transparent hover:border-red-100"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" /> Logout
              </button>
            </nav>
          </div>
        </aside>

        {/* Page Content */}
        <main className="lg:col-span-3 min-h-[500px]">
          {children}
        </main>
      </div>
    </div>
  );
}