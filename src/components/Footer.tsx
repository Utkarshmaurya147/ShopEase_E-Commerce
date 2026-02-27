import Link from "next/link";
import { Facebook, Instagram, Twitter, Send, ArrowUpRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0a1128] text-slate-400 py-18 px-6 border-t border-white/5 selection:bg-blue-500/30">
      <div className="max-w-7xl mx-auto">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-20">
          
          {/* Column 1: Brand & Newsletter */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-2xl font-black text-white tracking-tighter mb-4">
                Shop<span className="text-blue-500">Ease</span>
              </h2>
              <p className="text-sm leading-relaxed max-w-xs font-medium">
                Your one-stop destination for next-gen electronics and timeless fashion. 
                Experience quality delivered to your doorstep.
              </p>
            </div>

            {/* Newsletter Input */}
            <div className="max-w-sm">
              <h4 className="text-xs font-medium text-white uppercase tracking-widest mb-4">Join our list</h4>
              <form className="relative group">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                />
                <button className="absolute right-2 top-2 p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-colors">
                  <Send size={18} />
                </button>
              </form>
            </div>
          </div>

          {/* Column 2: Shop */}
          <div>
            <h3 className="text-white font-medium uppercase text-[10px] tracking-[0.2em] mb-6">Shop</h3>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link href="/products" className="hover:text-blue-400 flex items-center gap-1 group">All Products <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" /></Link></li>
              <li><Link href="/categories/electronics" className="hover:text-blue-400">Electronics</Link></li>
              <li><Link href="/categories/fashion" className="hover:text-blue-400">Fashion</Link></li>
              <li><Link href="/deals" className="hover:text-blue-400 text-rose-500">Flash Sales</Link></li>
            </ul>
          </div>

          {/* Column 3: Support */}
          <div>
            <h3 className="text-white font-medium uppercase text-[10px] tracking-[0.2em] mb-6">Support</h3>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link href="/track-order" className="hover:text-blue-400">Track Order</Link></li>
              <li><Link href="/shipping" className="hover:text-blue-400">Shipping Info</Link></li>
              <li><Link href="/returns" className="hover:text-blue-400">Returns</Link></li>
              <li><Link href="/contact" className="hover:text-blue-400">Contact Us</Link></li>
            </ul>
          </div>

          {/* Column 4: Socials */}
          <div>
            <h3 className="text-white font-medium uppercase text-[10px] tracking-[0.2em] mb-6">Connect</h3>
            <div className="flex flex-wrap gap-4">
               <Link href="#" className="p-3 bg-white/5 rounded-2xl border border-white/5 hover:bg-blue-600 hover:text-white transition-all duration-300">
                 <Facebook size={20} />
               </Link>
               <Link href="#" className="p-3 bg-white/5 rounded-2xl border border-white/5 hover:bg-pink-600 hover:text-white transition-all duration-300">
                 <Instagram size={20} />
               </Link>
               <Link href="#" className="p-3 bg-white/5 rounded-2xl border border-white/5 hover:bg-sky-500 hover:text-white transition-all duration-300">
                 <Twitter size={20} />
               </Link>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[12px] font-bold text-slate-600">
            © {new Date().getFullYear()} ShopEase Global. Built for Excellence.
          </p>
          <div className="flex items-center gap-8 text-[12px] font-bold">
            <Link href="/privacy" className="text-slate-600 hover:text-blue-400 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-slate-600 hover:text-blue-400 transition-colors">Terms</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}