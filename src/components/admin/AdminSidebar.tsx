"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboardIcon,
  ShoppingBagIcon,
  UserIcon,
  CreditCardIcon,
  ArrowLeftIcon,
  ChartBarIcon,
} from "lucide-react";

const menuItems = [
  { name: "Overview", icon: LayoutDashboardIcon, path: "/admin" },
  { name: "Products", icon: ShoppingBagIcon, path: "/admin/products" },
  { name: "Orders", icon: CreditCardIcon, path: "/admin/orders" },
  { name: "Customers", icon: UserIcon, path: "/admin/users" },
  { name: "Analytics", icon: ChartBarIcon, path: "/admin/analytics" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    /* Added: 'fixed', 'inset-y-0', 'left-0' to lock the sidebar.
      Added: 'z-50' to ensure it stays above content.
    */
    <div className="fixed inset-y-0 left-0 w-64 bg-[#0f172a] flex flex-col border-r border-slate-800 z-50">
      {/* Brand - Cleaner, less "italic" */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <Link href="/" className="group flex items-center gap-1.5">
          <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center rotate-[-10deg] group-hover:rotate-0 transition-transform duration-500">
            <ShoppingBagIcon className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-black tracking-tighter text-white uppercase">
            Shop<span className="text-blue-600">Ease</span>
          </span>
        </Link>
      </div>

      {/* Navigation - Standard spacing and normal fonts */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.name}
              href={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? "bg-blue-600 text-white font-semibold"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-200 font-medium"
              }`}
            >
              <item.icon
                className={`h-4 w-4 ${isActive ? "text-white" : "text-slate-500"}`}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-slate-800">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-400 hover:bg-slate-800 hover:text-white transition-all font-medium"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Store
        </Link>
      </div>
    </div>
  );
}