"use client";
import React, { useState, useEffect } from "react";
import api from "@/utils/api";
import toast from "react-hot-toast";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  MapPinIcon,
  PhoneIcon,
  CreditCardIcon,
  CubeIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { getImageUrl } from "@/utils/imageHelper";

const statusStyles: any = {
  pending: "bg-amber-50 text-amber-600 border-amber-100",
  processing: "bg-blue-50 text-blue-600 border-blue-100",
  shipped: "bg-indigo-50 text-indigo-600 border-indigo-100",
  delivered: "bg-emerald-50 text-emerald-600 border-emerald-100",
  cancelled: "bg-rose-50 text-rose-600 border-rose-100",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1); // Reset to page 1 when search changes
    }, 500); // Wait 500ms after last keystroke

    return () => clearTimeout(timer); // Cleanup timer if user types again
  }, [searchTerm]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      // Corrected: Included searchTerm in the API query
      const { data } = await api.get(
        `/orders/all?page=${page}&limit=10&search=${debouncedSearch}`,
      );
      if (data.success) {
        setOrders(data.orders);
        setTotalPages(data.meta.totalPages);
        setTotalItems(data.meta.totalItems); // Set the count for the UI
      }
    } catch (err) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  // Trigger fetch when page or search term changes
  useEffect(() => {
    fetchOrders();
  }, [page, debouncedSearch]);

  const updateStatus = async (orderId: string, updates: object) => {
    try {
      await api.put(`/orders/update-status/${orderId}`, updates);
      toast.success("Order updated");
      setOrders((prev: any) =>
        prev.map((o: any) => (o.id === orderId ? { ...o, ...updates } : o)),
      );
    } catch (err) {
      toast.error("Failed to update order");
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-8 pb-20">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Orders
        </h1>
        <p className="text-gray-500 font-medium">
          Click a row to see full product details and shipping info
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative max-w-md w-full">
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search Order ID, Status, or Customer..."
            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-100 font-bold text-gray-900 transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Optional: Add a Quick Status Filter Dropdown */}
        <select
          className="bg-white border border-gray-100 rounded-2xl px-5 py-3 font-bold text-sm text-gray-900 outline-none focus:ring-2 focus:ring-blue-100 shadow-sm"
          onChange={(e) => {
            setSearchTerm(e.target.value); // This will trigger the debounced search
            setPage(1);
          }}
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
        </select>
      </div>

      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
        <table className=" w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Order ID
              </th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Main Item
              </th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Customer
              </th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Total
              </th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Status
              </th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">
                Update
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {orders.map((order: any) => (
              <React.Fragment key={order.id}>
                {/* MAIN ROW */}
                <tr
                  onClick={() => toggleExpand(order.id)}
                  className={`cursor-pointer transition-all hover:bg-gray-50/80 ${expandedId === order.id ? "bg-blue-50/40" : ""}`}
                >
                  <td className="px-8 py-5 font-mono text-[10px] text-blue-600 font-black">
                    <div className="flex items-center gap-3">
                      {expandedId === order.id ? (
                        <ChevronUpIcon className="h-4 w-4" />
                      ) : (
                        <ChevronDownIcon className="h-4 w-4" />
                      )}
                      #{order.id.split("-")[0].toUpperCase()}
                    </div>
                  </td>

                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <img
                        src={getImageUrl(order.items?.[0]?.product?.image)}
                        className="h-12 w-12 rounded-xl object-cover border border-gray-100"
                        alt="product"
                      />
                      <div>
                        <p className="text-sm font-bold text-gray-900 line-clamp-1">
                          {order.items?.[0]?.product?.name}
                        </p>
                        <p className="text-[10px] font-bold text-gray-400 tracking-tight">
                          {order.items?.length > 1
                            ? `+${order.items.length - 1} more items`
                            : "Single Item"}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-8 py-5">
                    <p className="font-bold text-gray-900 text-sm">
                      {order.user?.name}
                    </p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">
                      {order.paymentMethod}
                    </p>
                  </td>

                  <td className="px-8 py-5 font-bold text-gray-900">
                    ${parseFloat(order.totalAmount).toLocaleString()}
                  </td>

                  <td className="px-8 py-5">
                    <span
                      className={`px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${statusStyles[order.status]}`}
                    >
                      {order.status}
                    </span>
                  </td>

                  <td
                    className="px-8 py-5 font-black text-gray-700 text-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <select
                      value={order.status}
                      onChange={(e) =>
                        updateStatus(order.id, { status: e.target.value })
                      }
                      className="bg-white border border-gray-200 text-[10px] font-black uppercase rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>

                {/* EXPANDABLE DETAIL ROW */}
                {expandedId === order.id && (
                  <tr className="bg-gray-50/50">
                    <td colSpan={6} className="px-8 py-8">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-1 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                          <div className="flex items-center gap-2 mb-6">
                            <CubeIcon className="h-4 w-4 text-blue-600" />
                            <h3 className="text-xs font-black uppercase text-gray-900">
                              Order Items
                            </h3>
                          </div>
                          <div className="space-y-4">
                            {order.items?.map((item: any) => (
                              <div
                                key={item.id}
                                className="flex items-center justify-between group"
                              >
                                <div className="flex items-center gap-4">
                                  <img
                                    src={getImageUrl(item.product?.image)}
                                    className="h-14 w-14 rounded-2xl object-cover"
                                  />
                                  <div>
                                    <p className="text-sm font-bold text-gray-900">
                                      {item.product?.name}
                                    </p>
                                    <p className="text-xs font-bold text-gray-400">
                                      Qty: {item.quantity} × ${item.price}
                                    </p>
                                  </div>
                                </div>
                                <p className="font-black text-gray-900">
                                  $
                                  {(
                                    item.quantity * item.price
                                  ).toLocaleString()}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                          <div className="grid grid-cols-2 gap-8">
                            <div>
                              <h4 className="text-[10px] font-black uppercase text-blue-600 mb-4 flex items-center gap-2">
                                <CreditCardIcon className="h-4 w-4" /> Payment
                              </h4>
                              <div className="space-y-2">
                                <p className="text-xs font-bold text-gray-900 uppercase">
                                  {order.paymentMethod}
                                </p>
                                <span
                                  className={`px-2 py-0.5 rounded text-[9px] font-black uppercase border ${order.paymentStatus === "paid" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-rose-50 text-rose-600 border-rose-100"}`}
                                >
                                  {order.paymentStatus}
                                </span>
                              </div>
                            </div>
                            <div>
                              <h4 className="text-[10px] font-black uppercase text-blue-600 mb-4 flex items-center gap-2">
                                <MapPinIcon className="h-4 w-4" /> Shipping
                              </h4>
                              <p className="text-xs font-medium text-gray-600 leading-relaxed">
                                {order.address}
                              </p>
                              <p className="text-xs font-black text-gray-900 mt-2 flex items-center gap-2">
                                <PhoneIcon className="h-3 w-3 text-gray-400" />{" "}
                                {order.shipping_phone || "No phone provided"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <div className="px-8 py-5 bg-gray-50 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500 font-medium">
            Showing page <span className="text-gray-900 font-bold">{page}</span>{" "}
            of {totalPages}
            <span className="ml-1 text-[10px] text-gray-400">
              ({totalItems} total orders)
            </span>
          </p>

          <div className="flex items-center gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-all shadow-sm"
            >
              Previous
            </button>
            <span className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-sm font-black">
              {page}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 disabled:opacity-50 transition-all shadow-md shadow-blue-100"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
