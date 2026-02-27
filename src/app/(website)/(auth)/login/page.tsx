'use client'
import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams} from "next/navigation";
import api from "@/utils/api"; 
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { SparklesIcon, LockClosedIcon, EnvelopeIcon } from "@heroicons/react/24/outline";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useAuth();
  const callback = searchParams.get("callback");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/auth/login", { email, password });
      if (res.data.success) {
        setUser(res.data.user);
        toast.success(`Welcome back, ${res.data.user.name}!`);
        router.push(callback || "/");
      }
    } catch (error: any) {
      const message = error.response?.data?.message || "Check your credentials.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a1128] flex items-center justify-center px-6 py-12 lg:px-8 relative overflow-hidden">
      {/* 1. MESH BACKGROUND BLURS */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-indigo-600/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black tracking-tighter text-white">
            Sign in to <span className="text-blue-500">ShopEase</span>
          </h2>
          <p className="mt-3 text-sm text-slate-400 font-medium">
            New here?{' '}
            <Link href="/register" className="font-bold text-blue-400 hover:text-white transition-colors">
              Create an account
            </Link>
          </p>
        </div>

        {/* 2. GLASSMORPHIC FORM CARD */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[40px] p-8 md:p-12 shadow-2xl">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative">
                <EnvelopeIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                <input
                  type="email"
                  required
                  disabled={loading}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none disabled:opacity-50"
                  placeholder="utkarsh@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Password</label>
                <Link href="#" className="text-[10px] font-black text-blue-400 uppercase tracking-widest hover:text-white transition-colors">Forgot?</Link>
              </div>
              <div className="relative">
                <LockClosedIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                <input
                  type="password"
                  required
                  disabled={loading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none disabled:opacity-50"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-blue-600 text-white rounded-[20px] font-black text-sm uppercase tracking-widest hover:bg-white hover:text-blue-600 shadow-xl shadow-blue-900/20 transition-all active:scale-[0.98] disabled:opacity-70"
            >
              {loading ? "Authenticating..." : "Sign In"}
            </button>
          </form>

          {/* 3. REFINED SOCIALS */}
          <div className="mt-10">
            <div className="relative flex justify-center text-[10px] uppercase tracking-[0.2em] mb-6">
              <span className="bg-[#0c142d] px-4 text-slate-500 font-bold">Or connect via</span>
              <div className="absolute inset-y-1/2 left-0 w-full border-t border-white/5 -z-10" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center py-3 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all active:scale-95">
                <img className="h-5 w-5" src="https://www.svgrepo.com/show/355037/google.svg" alt="Google" />
                <span className="ml-3 text-xs font-bold text-white uppercase tracking-widest">Google</span>
              </button>
              <button className="flex items-center justify-center py-3 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all active:scale-95">
                <img className="h-5 w-5 filter invert" src="https://www.svgrepo.com/show/511330/apple-173.svg" alt="Apple" />
                <span className="ml-3 text-xs font-bold text-white uppercase tracking-widest">Apple</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}