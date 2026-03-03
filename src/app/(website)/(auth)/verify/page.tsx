"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/utils/api";
import toast from "react-hot-toast";

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/verify-otp", { email, code });
      toast.success("Account verified! Please login.");
      router.push("/login");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Invalid Code");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      const res = await api.post("/auth/resend-otp", { email });
      if (res.data.success) {
      toast.success("New code sent! Check your inbox.");
    }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to resend code");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
      <form onSubmit={handleVerify} className="p-8 bg-white rounded-2xl shadow-xl w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4">Check your email</h1>
        <p className="text-slate-500 mb-6">Enter the 6-digit code sent to <b>{email}</b></p>
        
        <input
          type="text"
          maxLength={6}
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
          className="w-full text-center text-3xl tracking-[1rem] py-3 border-2 rounded-xl mb-6 outline-none focus:border-blue-500 font-mono"
          placeholder="000000"
        />

        <button disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all">
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        <button type="button" onClick={handleResend} className="mt-4 text-blue-600 text-sm font-semibold hover:underline">
          Resend New Code
        </button>
      </form>
    </div>
  );
}