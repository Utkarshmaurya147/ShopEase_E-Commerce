"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/utils/api";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import GlobalSearch from "./GlobalSearch";

import {
  ShoppingBagIcon,
  MagnifyingGlassIcon,
  UserIcon,
  ChevronDownIcon,
  UserCircleIcon,
  Bars3Icon,
  XMarkIcon,
  BellIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

export default function Navbar() {
  const { user, logout, loading } = useAuth(); // Added 'loading' to prevent flickering
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const router = useRouter();

  const { cartCount } = useCart();

  useEffect(() => {
    const getCategories = async () => {
      try {
        const res = await api.get("/categories/all");
        setCategories(res.data.categories || []);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };
    getCategories();
  }, []);

  useEffect(() => {
    if (cartCount === 0) return;
    setShouldAnimate(true);
    const timer = setTimeout(() => setShouldAnimate(false), 300);
    return () => clearTimeout(timer);
  }, [cartCount]);

  // Notification Logic
  const fetchUnread = useCallback(async () => {
    if (!user) {
      setUnreadCount(0);
      return;
    }
    try {
      const { data } = await api.get("/notifications/my-notifications");
      const unread = data.notifications.filter((n: any) => !n.isRead).length;
      setUnreadCount(unread);
    } catch (err) {
      // If we get a 401 here, it means the token expired
      console.error("Notification fetch failed");
    }
  }, [user]);

  // Initial fetch when user changes
  useEffect(() => {
    fetchUnread();
  }, [fetchUnread]);

  // Listen for "notificationRead" event from the Notifications Page
  useEffect(() => {
    const handleUpdate = () => fetchUnread();
    window.addEventListener("notificationRead", handleUpdate);
    return () => window.removeEventListener("notificationRead", handleUpdate);
  }, [fetchUnread]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${searchQuery}`);
      setSearchQuery("");
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 px-4 py-4 md:px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Mobile: Hamburger */}
        <button
          className="md:hidden p-2 text-gray-600"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <Bars3Icon className="h-6 w-6" />
          )}
        </button>

        {/* Logo */}
        <Link href="/" className="group flex items-center gap-1.5">
          <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center rotate-[-10deg] group-hover:rotate-0 transition-transform duration-500">
            <ShoppingBagIcon className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-black tracking-tighter text-gray-900 uppercase">
            Shop<span className="text-blue-600">Ease</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-700">
          <Link href="/products" className="hover:text-blue-600 transition">
            Products
          </Link>

          <div
            className="relative group"
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <Link
              href="/categories"
              className="flex items-center hover:text-blue-600 transition gap-1 py-2"
            >
              Categories <ChevronDownIcon className="h-3 w-3" />
            </Link>

            {isDropdownOpen && (
              <div className="absolute top-full -left-4 w-56 bg-white shadow-xl border border-gray-100 rounded-lg py-2 z-50">
                <div className="max-h-60 overflow-y-auto">
                  {categories.map((cat: any) => (
                    <Link
                      key={cat.id}
                      href={`/categories/${cat.slug}`}
                      className="block px-4 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 capitalize"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
          <Link href="/contact" className="hover:text-blue-600 transition">
            Contact
          </Link>
        </div>

        {/* Search Bar */}
        <div className="hidden lg:flex flex-1 max-w-sm mx-8 justify-end">
          <GlobalSearch />
        </div>
        {/* <form
          onSubmit={handleSearch}
          className="hidden lg:flex flex-1 max-w-sm mx-8"
        >
          <div className="relative w-full">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
              <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full text-gray-600 bg-gray-50 border border-gray-200 rounded-full py-2 pl-10 pr-4 text-sm focus:bg-white transition"
            />
          </div>
        </form> */}

        {/* Right Side Icons */}
        <div className="flex items-center space-x-2 md:space-x-4">
          {/* AUTH SECTION HANDLER */}
          {loading ? (
            /* Skeleton state while AuthProvider checks the session */
            <div className="h-10 w-24 bg-gray-100 animate-pulse rounded-xl hidden sm:block"></div>
          ) : user ? (
            <div className="flex items-center gap-2 md:gap-4">
              <Link
                href="/profile/notifications"
                className="relative p-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-full transition"
              >
                <BellIcon className="h-6 w-6" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white animate-bounce">
                    {unreadCount}
                  </span>
                )}
              </Link>
              <Link
                href="/profile"
                className="flex items-center gap-2 p-2 rounded-xl hover:bg-blue-50 transition group"
                title="View Profile & Orders"
              >
                <div className="bg-blue-100 p-1.5 rounded-lg group-hover:bg-blue-200 transition">
                  <UserCircleIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="hidden sm:flex flex-col items-start leading-tight">
                  <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                    Account
                  </span>
                  <span className="text-sm font-bold text-gray-900 group-hover:text-blue-600">
                    {user.name.split(" ")[0]}{" "}
                    {/* Show only first name for cleaner UI */}
                  </span>
                </div>
              </Link>

              <button
                onClick={logout}
                className="p-2 rounded-full hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition"
                title="Logout"
              >
                <ArrowRightOnRectangleIcon className="h-6 w-6" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center text-gray-700 hover:text-blue-600 p-2"
            >
              <UserIcon className="h-6 w-6" />
              <span className="hidden sm:block ml-1 text-sm font-bold">
                Login
              </span>
            </Link>
          )}

          {/* Cart Icon */}
          <Link
            href="/cart"
            className={`relative group p-2 transition-transform ${shouldAnimate ? "scale-110" : "scale-100"}`}
          >
            <ShoppingBagIcon className="h-6 w-6 text-gray-700 group-hover:text-blue-600 transition" />
            {/* <p className="text-gray-700 group-hover:text-blue-600 transition" >Cart</p> */}
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ring-2 ring-white">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-xl z-50">
          <div className="flex flex-col p-4 space-y-4">
            <form onSubmit={handleSearch} className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full bg-gray-50 border rounded-xl py-2 pl-10 text-sm text-gray-900"
              />
              <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </form>

            <Link
              href="/"
              className="text-sm font-bold text-gray-700 px-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/products"
              className="text-sm font-bold text-gray-700 px-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Products
            </Link>

            <div className="pt-2">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 mb-2">
                Categories
              </p>
              <div className="grid grid-cols-2 gap-y-3 px-2">
                {categories.slice(0, 6).map((cat: any) => (
                  <Link
                    key={cat.id}
                    href={`/categories/${cat.slug}`}
                    className="text-sm text-gray-600 capitalize hover:text-blue-600"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Mobile Auth */}
            <div className="pt-4 border-t border-gray-50">
              {loading ? (
                <div className="h-8 w-full bg-gray-100 animate-pulse rounded-lg"></div>
              ) : user ? (
                <div className="flex items-center justify-between px-2">
                  <Link
                    href="/profile"
                    className="font-bold text-gray-900"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {user.name}
                  </Link>
                  <button
                    onClick={logout}
                    className="text-red-500 text-sm font-bold"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center text-gray-700 font-bold px-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <UserIcon className="h-5 w-5 mr-2" /> Login
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
