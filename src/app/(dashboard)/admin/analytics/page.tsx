"use client";
import { useState, useEffect } from "react";
import api from "@/utils/api";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  ArrowPathIcon,
  CalendarDaysIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

import RevenueChart from "@/components/admin/RevenueChart";

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/analytics");
      // Data contains: { success, revenue, orders, topProducts }
      setData(data);
    } catch (err) {
      console.error("Analytics fetch failed");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !data) {
    return (
      <div className="h-96 flex items-center justify-center">
        <ArrowPathIcon className="h-8 w-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Analytics Overview
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Live data from your SQL database
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchAnalytics}
            className="p-2.5 text-slate-500 hover:bg-white rounded-lg border border-slate-200 transition-all"
          >
            <ArrowPathIcon
              className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* 1. Real Data Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Revenue"
          value={`$${parseFloat(data?.revenue || 0).toLocaleString()}`}
          change="+12.5%" // You can calculate this if you have historical data
          up={true}
        />
        <StatCard
          title="Total Orders"
          value={data?.orders || 0}
          change="+3.2%"
          up={true}
        />
        <StatCard
          title="Avg. Order Value"
          value={`$${data?.orders > 0 ? (data.revenue / data.orders).toFixed(2) : 0}`}
          change="+2.4%"
          up={true}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-xl border border-slate-200 shadow-sm min-h-[400px] flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Revenue Growth
            </h3>
            <span className="text-[10px] font-black text-slate-400 bg-slate-50 px-2 py-1 rounded">
              DAILY TREND
            </span>
          </div>
          <RevenueChart />
        </div>

        {/* 3. Real Top Selling Products */}
        <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-6">
            Top Performing Products
          </h3>
          <div className="space-y-6">
            {data?.topProducts?.map((item: any, index: number) => (
              <div
                key={item.productId}
                className="flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center text-[10px] font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                      {item.product?.name}
                    </p>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase">
                      Product ID: {String(item.productId).split("-")[0]}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-black text-slate-900">
                    {item.totalSold} Sales
                  </p>
                </div>
              </div>
            ))}
            {data?.topProducts?.length === 0 && (
              <p className="text-center text-slate-400 text-xs italic py-10">
                No sales data recorded yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, change, up }: any) {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-blue-500/30 transition-all group">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
        {title}
      </p>
      <div className="flex items-end justify-between mt-2">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          {value}
        </h2>
        <span
          className={`flex items-center text-[10px] font-black px-2 py-1 rounded-md ${up ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}
        >
          {up ? (
            <ArrowUpIcon className="h-3 w-3 mr-1" />
          ) : (
            <ArrowDownIcon className="h-3 w-3 mr-1" />
          )}
          {change}
        </span>
      </div>
    </div>
  );
}
