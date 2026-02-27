'use client'
import { useState, useEffect } from "react";
import api from "@/utils/api";
import { 
  BanknotesIcon, 
  UserGroupIcon, 
  ShoppingBagIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from "@heroicons/react/24/outline";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    customers: 0
  });

  useEffect(() => {
    // Fetch real stats from your /api/admin/stats endpoint
    const fetchStats = async () => {
      try {
        // const { data } = await api.get("/admin/stats");
        // if (data.success) setStats(data.stats);
      } catch (err) {
        console.error("Stats fetch failed");
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      {/* 1. Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Executive Dashboard</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Real-time performance metrics for ShopEase</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors">
            Download Report
          </button>
        </div>
      </div>
      
      {/* 2. Stats Grid - Reduced Border Radius, refined shadows */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Revenue Card */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
              <BanknotesIcon className="h-5 w-5 text-slate-600" />
            </div>
            <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
              <ArrowUpIcon className="h-3 w-3 mr-1" /> 12%
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Revenue</p>
          <div className="flex items-baseline gap-2 mt-1">
            <h2 className="text-3xl font-bold text-slate-900">${stats.revenue.toLocaleString()}</h2>
            <span className="text-xs text-slate-400 font-medium">USD</span>
          </div>
        </div>

        {/* Orders Card */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
              <ShoppingBagIcon className="h-5 w-5 text-slate-600" />
            </div>
            <span className="flex items-center text-xs font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-md">
              Static
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Orders</p>
          <h2 className="text-3xl font-bold text-slate-900 mt-1">{stats.orders}</h2>
        </div>

        {/* Customers Card */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
              <UserGroupIcon className="h-5 w-5 text-slate-600" />
            </div>
            <span className="flex items-center text-xs font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded-md">
              <ArrowDownIcon className="h-3 w-3 mr-1" /> 2%
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Customers</p>
          <h2 className="text-3xl font-bold text-slate-900 mt-1">{stats.customers}</h2>
        </div>
      </div>
      
      {/* 3. Activity Section - Clean Table look */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Recent Activity</h3>
          <button className="text-xs font-bold text-blue-600 hover:text-blue-800">View All</button>
        </div>
        <div className="p-8 text-center bg-white">
          <div className="flex flex-col items-center justify-center py-10">
            <div className="h-12 w-12 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse" />
            </div>
            <p className="text-sm font-semibold text-slate-600 tracking-tight">Streaming live transaction data...</p>
            <p className="text-xs text-slate-400 mt-1">System healthy. All processes nominal.</p>
          </div>
        </div>
      </div>
    </div>
  );
}