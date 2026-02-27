'use client'
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    //SECURITY: Redirect if not admin
    if (!loading && (!user || user.role !== 'admin')) {
      router.push("/login?callback=/admin");
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== 'admin') {
    return <div className="h-screen bg-[#0a1128] flex items-center justify-center text-white">Verifying Admin Access...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar is fixed (doesn't take up space in the flow) */}
      <AdminSidebar />

      {/* Main content needs a margin-left equal to sidebar width (w-64 = 16rem) */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-8 sticky top-0 z-40">
          <h1 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
            Control Panel
          </h1>
        </header>

        <main className="p-8 bg-slate-50 flex-1">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}