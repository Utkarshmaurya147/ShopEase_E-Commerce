'use client'
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/utils/api";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { 
  SparklesIcon, UserIcon, EnvelopeIcon, LockClosedIcon,
  EyeIcon, EyeSlashIcon 
} from "@heroicons/react/24/outline";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPass, setShowPass] = useState(false); // Toggle state
  const { user, loading: authLoading } = useAuth(); 
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && user) router.push("/");
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) return toast.error("Passwords do not match!");
    if (formData.password.length < 6) return toast.error("Min 6 characters required");

    setIsSubmitting(true);
    try {
      const res = await api.post("/auth/signup", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      if (res.data.success) {
        toast.success("Account created!");
        router.push("/login");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Registration failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) return null;

  return (
    <div className="min-h-screen bg-[#0a1128] flex items-center justify-center px-6 py-12 lg:px-8 relative overflow-hidden selection:bg-blue-500/30">
      {/* MESH BACKGROUND */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-indigo-600/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest mb-6">
            <SparklesIcon className="h-3 w-3" /> Get Started
          </div>
          <h2 className="text-4xl font-black tracking-tighter text-white">Join <span className="text-blue-500">ShopEase</span></h2>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[40px] p-8 md:p-10 shadow-2xl">
          <form className="space-y-5" onSubmit={handleSubmit}>
            
            {/* Full Name */}
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                <input
                  type="text" required disabled={isSubmitting}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                  placeholder="Utkarsh"
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative">
                <EnvelopeIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                <input
                  type="email" required disabled={isSubmitting}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                  placeholder="utkarsh@example.com"
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            {/* Password Section */}
            <div className="grid grid-cols-1 gap-5">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Create Password</label>
                <div className="relative">
                  <LockClosedIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                  <input
                    type={showPass ? "text" : "password"} // Dynamic Type
                    required disabled={isSubmitting}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-12 text-sm text-white placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                    placeholder="••••••••"
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                  >
                    {showPass ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirm Password</label>
                <div className="relative">
                  <LockClosedIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                  <input
                    type={showPass ? "text" : "password"} // Dynamic Type
                    required disabled={isSubmitting}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                    placeholder="••••••••"
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit" disabled={isSubmitting}
              className="w-full py-5 bg-blue-600 text-white rounded-[20px] font-black text-sm uppercase tracking-widest hover:bg-white hover:text-blue-600 shadow-xl shadow-blue-900/20 transition-all active:scale-95 disabled:opacity-70"
            >
              {isSubmitting ? "Processing..." : "Create Account"}
            </button>
          </form>
          
          <p className="mt-8 text-center text-xs text-slate-500 font-medium">
            Already a member? <Link href="/login" className="text-blue-400 font-bold hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}