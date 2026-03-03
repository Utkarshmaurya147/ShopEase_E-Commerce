'use client'
import React from "react";
import { useState, useEffect } from "react";
import api from "@/utils/api";
import toast from "react-hot-toast";
import { 
  ChevronDownIcon, 
  ChevronUpIcon,
  MapPinIcon,
  PhoneIcon,
  CreditCardIcon,
  CubeIcon
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

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get("/orders/all");
      setOrders(data.orders);
    } catch (err) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId: string, updates: object) => {
    try {
      await api.put(`/orders/update-status/${orderId}`, updates);
      toast.success("Order updated");
      setOrders((prev: any) => prev.map((o: any) =>
         o.id === orderId ? { ...o, ...updates } : o));
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
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Orders</h1>
        <p className="text-gray-500 font-medium">Click a row to see full product details and shipping info</p>
      </div>

      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
        <table className=" w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr className="">
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Order ID</th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Main Item</th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Customer</th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Total</th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Update</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {orders.map((order: any) => (
              <React.Fragment key={order.id}>
                {/* MAIN ROW */}
                <tr 
                  key={order.id} 
                  onClick={() => toggleExpand(order.id)}
                  className={`cursor-pointer transition-all hover:bg-gray-50/80 ${expandedId === order.id ? 'bg-blue-50/40' : ''}`}
                >
                  <td className="px-8 py-5 font-mono text-[10px] text-blue-600 font-black flex items-center gap-3 mt-4">
                    {expandedId === order.id ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />}
                    #{order.id.split('-')[0].toUpperCase()}
                  </td>

                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <img 
                        src={getImageUrl(order.items?.[0]?.product?.image)} 
                        className="h-12 w-12 rounded-xl object-cover border border-gray-100"
                        alt="product"
                      />
                      <div>
                        <p className="text-sm font-bold text-gray-900 line-clamp-1">{order.items?.[0]?.product?.name}</p>
                        <p className="text-[10px] font-bold text-gray-400 tracking-tight">
                           {order.items?.length > 1 ? `+${order.items.length - 1} more items` : 'Single Item'}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-8 py-5">
                    <p className="font-bold text-gray-900 text-sm">{order.user?.name}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">{order.paymentMethod}</p>
                  </td>

                  <td className="px-8 py-5 font-bold text-gray-900">
                    ${parseFloat(order.totalAmount).toLocaleString()}
                  </td>

                  <td className="px-8 py-5">
                    <span className={`px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${statusStyles[order.status]}`}>
                      {order.status}
                    </span>
                  </td>

                  <td className="px-8 py-5 font-black text-gray-700" onClick={(e) => e.stopPropagation()}>
                    <select 
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, {status: e.target.value})}
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

                {/* EXPANDABLE HORIZONTAL DETAIL ROW */}
                {expandedId === order.id && (
                  <tr className="bg-gray-50/50">
                    <td colSpan={6} className="px-8 py-8 animate-in fade-in slide-in-from-top-1 duration-300">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        
                        {/* 1. Full Product List */}
                        <div className="lg:col-span-1 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                           <div className="flex items-center gap-2 mb-6">
                             <CubeIcon className="h-4 w-4 text-blue-600" />
                             <h3 className="text-xs font-black uppercase text-gray-900">Order Items</h3>
                           </div>
                           <div className="space-y-4">
                             {order.items?.map((item: any) => (
                               <div key={item.id} className="flex items-center justify-between group">
                                 <div className="flex items-center gap-4">
                                   <img src={getImageUrl(item.product?.image)} className="h-14 w-14 rounded-2xl object-cover" />
                                   <div>
                                     <p className="text-sm font-bold text-gray-900">{item.product?.name}</p>
                                     <p className="text-xs font-bold text-gray-400">Qty: {item.quantity} × ${item.price}</p>
                                   </div>
                                 </div>
                                 <p className="font-black text-gray-900">${(item.quantity * item.price).toLocaleString()}</p>
                               </div>
                             ))}
                           </div>
                        </div>

                        {/* 2. Logistics & Payment Info */}
                        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                           <div>
                             <h4 className="text-[10px] font-black uppercase text-blue-600 mb-4 flex items-center gap-2">
                               <CreditCardIcon className="h-4 w-4" /> Payment Details
                             </h4>
                             <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-[10px] font-black text-gray-400 uppercase">Method</label>
                                  <select 
                                    value={order.paymentMethod}
                                    onChange={(e) => updateStatus(order.id, { paymentMethod: e.target.value })}
                                    className="w-full mt-1 bg-gray-50 text-gray-900 border-none text-[10px] font-black uppercase rounded-lg p-2"
                                  >
                                    <option value="cod">Cash on Delivery</option>
                                    <option value="razorpay">Razorpay (Online)</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="text-[10px] font-black text-gray-400 uppercase">Payment Status</label>
                                  <select 
                                    value={order.paymentStatus}
                                    onChange={(e) => updateStatus(order.id, { paymentStatus: e.target.value })}
                                    className="w-full mt-1 bg-gray-50 text-gray-900 border-none text-[10px] font-black uppercase rounded-lg p-2"
                                  >
                                    <option value="unpaid">Unpaid</option>
                                    <option value="paid">Paid</option>
                                    <option value="failed">Failed</option>
                                  </select>
                                </div>
                             </div>
                           </div>

                           <div>
                              <h4 className="text-[10px] font-black uppercase text-blue-600 mb-2 flex items-center gap-2">
                                <MapPinIcon className="h-4 w-4" /> Shipping Address
                              </h4>
                              <p className="text-xs font-medium text-gray-600 leading-relaxed">{order.address}</p>
                              <p className="text-xs font-black text-gray-900 mt-2 flex items-center gap-2">
                                <PhoneIcon className="h-3 w-3 text-gray-400" /> {order.shipping_phone}
                              </p>
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
      </div>
    </div>
  );
}