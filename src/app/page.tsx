"use client";
import Link from "next/link";
import {
  ArrowRightIcon,
  SparklesIcon,
  ShoppingBagIcon,
  BoltIcon,
  FireIcon,
} from "@heroicons/react/24/outline";

export default function HomePage() {
  return (
    <div className="bg-white selection:bg-blue-100">
      {/* 1. HERO SECTION: Enhanced with Mesh Gradients & Floating Feel */}
      <section className="relative overflow-hidden bg-[#0a1128] pt-32 pb-24 px-6 lg:px-8">
        {/* Background Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-indigo-600/10 rounded-full blur-[100px]" />
        </div>

        <div className="relative max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-widest mb-8">
            <FireIcon className="h-3 w-3 animate-pulse" /> New Season Arrival
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-white sm:text-7xl lg:text-8xl mb-8">
            Upgrade your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
              Lifestyle
            </span>
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-slate-400 max-w-2xl mx-auto font-medium">
            ShopEase curates the next generation of electronics and fashion.
            Experience premium quality with seamless delivery.
          </p>
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/products"
              className="w-full sm:w-auto rounded-2xl bg-blue-600 px-8 py-4 text-sm font-black text-white shadow-xl shadow-blue-900/20 hover:bg-blue-500 hover:-translate-y-1 transition-all active:scale-95"
            >
              Explore Collection
            </Link>
            <Link
              href="/categories"
              className="group text-sm font-bold text-white flex items-center gap-2 px-6 py-4"
            >
              View Categories
              <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* 2. BENTO CATEGORIES: Replacing the simple grid */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="text-4xl font-black text-gray-900 tracking-tight">
              Popular Collections
            </h2>
            <p className="text-gray-500 mt-2 font-medium">
              Curated by our design experts.
            </p>
          </div>
          <Link
            href="/categories"
            className="text-blue-600 font-bold flex items-center gap-1 group"
          >
            See all categories{" "}
            <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Large Feature Card (Bento Style) */}
          <div className="md:col-span-2 md:row-span-2 group relative overflow-hidden rounded-[40px] bg-slate-900 p-10 flex flex-col justify-end min-h-[500px] transition-all hover:shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/20 to-transparent z-10" />
            {/* Placeholder for a featured image */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop')] bg-cover bg-center group-hover:scale-110 transition-transform duration-[3000ms]" />

            <div className="relative z-20">
              <SparklesIcon className="h-12 w-12 text-blue-400 mb-6" />
              <h3 className="text-3xl font-black text-white mb-2">
                Next-Gen Tech
              </h3>
              <p className="text-slate-400 text-sm max-w-xs mb-6">
                Revolutionary gadgets designed for the modern workspace.
              </p>
              <Link href={"/categories/lighting"} className="bg-white text-black px-6 py-3 rounded-2xl font-bold text-sm hover:bg-blue-500 hover:text-white transition-colors">
                Browse Electronics
              </Link>
            </div>
          </div>

          {/* Square Card 1 */}
          <div className="md:col-span-2 group relative overflow-hidden rounded-[40px] bg-indigo-50 p-10 flex items-center justify-between hover:bg-indigo-100 transition-colors">
            <div>
              <ShoppingBagIcon className="h-10 w-10 text-indigo-600 mb-4" />
              <h3 className="text-2xl font-black text-indigo-950">Fashion</h3>
              <p className="text-indigo-600/70 text-sm font-bold">
                Timeless Essentials
              </p>
            </div>
            <div className="w-32 h-32 bg-indigo-200 rounded-3xl rotate-12 group-hover:rotate-0 transition-transform duration-500 shadow-inner" />
          </div>

          {/* Square Card 2 */}
          <div className="md:col-span-2 group relative overflow-hidden rounded-[40px] bg-yellow-50 p-10 flex items-center justify-between hover:bg-yellow-100 transition-colors">
            <div>
              <BoltIcon className="h-10 w-10 text-yellow-600 mb-4" />
              <h3 className="text-2xl font-black text-yellow-950">
                Flash Deals
              </h3>
              <p className="text-yellow-600/70 text-sm font-bold">
                Up to 50% Off
              </p>
            </div>
            <div className="flex gap-2">
              <div className="w-12 h-24 bg-yellow-200 rounded-full animate-bounce" />
              <div className="w-12 h-24 bg-yellow-300 rounded-full animate-bounce [animation-delay:0.2s]" />
              <div className="w-12 h-24 bg-yellow-200 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. CTA SECTION: Modern "Floating Card" Look */}
      <section className="py-24 px-6 bg-white">
        <div className="mx-auto max-w-7xl rounded-[50px] bg-[#0a1128] p-12 md:p-24 overflow-hidden relative text-center">
          {/* Background elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-[80px]" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/10 rounded-full blur-[80px]" />

          <div className="relative z-10 max-w-3xl mx-auto">
            <p className="text-blue-400 font-black uppercase tracking-widest text-xs mb-6">
              Join the Community
            </p>
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-8">
              Ready to elevate your <br />
              shopping experience?
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link
                href="/login"
                className="w-full sm:w-auto rounded-2xl bg-white px-10 py-5 text-sm font-black text-black hover:bg-blue-500 hover:text-white transition-all active:scale-95"
              >
                Get Started Free
              </Link>
              <Link
                href="/about"
                className="text-white/60 font-bold hover:text-white transition-colors"
              >
                Learn more about ShopEase
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
