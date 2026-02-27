'use client'
import { useEffect, useState } from 'react';
import api from '@/utils/api';
import Link from 'next/link';
import { ShoppingBagIcon, ChevronRightIcon, ClockIcon } from "@heroicons/react/24/outline";
import { toast } from 'react-hot-toast';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  const fetchOrders = async () => {
    try {
      const { data } = await api.get("/orders/my-orders");
      setOrders(data.orders || []);
    } catch (err) { 
      console.error("Fetch error:", err); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm("Are you sure you want to cancel this order?")) return;
    try {
      await api.put(`/orders/cancel/${orderId}`);
      toast.success("Order Cancelled successfully");
      fetchOrders(); 
    } catch (err: any) { 
      toast.error(err.response?.data?.message || "Error cancelling order"); 
    }
  };

  const filteredOrders = orders.filter((order: any) => {
    if (filter === 'All') return true;
    return order.status.toLowerCase() === filter.toLowerCase();
  });

  if (loading) return (
    <div className="flex justify-center items-center py-20">
      <div className="h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="bg-[#d1daeb] rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      
      {/* 🟦 Header & Modern Tabs */}
      <div className="p-6 md:p-8 border-b border-gray-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">My Orders</h2>
          <p className="text-sm text-gray-500 mt-1">Manage and track your recent purchases</p>
        </div>
        
        {/* Horizontal Scroll Tabs with custom scroll-hide */}
        <div className="flex overflow-x-auto gap-2 w-full md:w-auto no-scrollbar pb-1 md:pb-0">
          {['All', 'Shipped', 'Delivered', 'Cancelled'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`whitespace-nowrap px-5 py-2 rounded-full text-xs font-bold uppercase   transition-all ${
                filter === tab 
                ? 'bg-[#1b42e0] text-white shadow-lg shadow-blue-100' 
                : 'bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/*List of Orders */}
      <div className="p-4 md:p-8 space-y-4 md:space-y-6 hover:shadow-xl hover:shadow-blue-900/50 ">
        {filteredOrders.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center">
            <div className="bg-gray-50 p-6 rounded-full mb-4">
              <ShoppingBagIcon className="h-10 w-10 text-gray-200" />
            </div>
            <p className="text-gray-900 font-black text-lg">No {filter !== 'All' ? filter.toLowerCase() : ''} orders found</p>
            <p className="text-gray-500 text-sm mt-1 max-w-xs">Once you place an order, it will appear here for you to track.</p>
          </div>
        ) : (
          filteredOrders.map((order: any) => {
            const items = order.items || [];
            const firstItem = items[0];
            const product = firstItem?.product;
            const imageUrl = product?.image?.startsWith('https') 
              ? product.image 
              : `http://localhost:5000/uploads/${product?.image}`;

            return (
              <div key={order.id} className="group bg-[#e8e9ed] rounded-2xl p-4 md:p-6 hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-300 relative border-b border-gray-50">
                
                {/* Status and Price Row */}
                <div className="flex justify-between items-start mb-5 pb-5">
                   <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-tight ${
                          order.status === 'delivered' ? 'bg-green-50 text-green-600' : 
                          order.status === 'cancelled' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                        }`}> 
                          {order.status} 
                        </span>
                        <span className="text-[11px] text-gray-400 font-bold flex items-center gap-1">
                           <ClockIcon className="h-3.5 w-3.5" /> 
                           {new Date(order.created_at || order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-400 font-mono tracking-tighter uppercase">ID: {order.id.slice(0, 18)}</p>
                   </div>
                   <div className="text-right">
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest leading-none mb-1">Total</p>
                      <p className="text-xl font-black text-gray-900 leading-none">${Number(order.totalAmount).toLocaleString()}</p>
                   </div>
                </div>

                <div className="flex items-center gap-5 ">
                  {/* High Quality Thumbnail */}
                  <div className="h-24 w-24 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden border border-gray-50 relative">
                    {product?.image ? (
                      <img 
                        src={imageUrl} 
                        className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" 
                        alt={product?.name} 
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-[10px] text-gray-300">No Image</div>
                    )}
                  </div>

                  {/* Product Details & Call to Action */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between h-24 py-1 ">
                    <div>
                      <h4 className="font-bold text-gray-900 truncate text-sm md:text-base group-hover:text-blue-600 transition">
                        {product?.name || "Order Package"}
                      </h4>
                      {items.length > 1 && (
                        <p className="text-[10px] text-blue-600 font-black uppercase mt-1.5 flex items-center gap-1">
                           <span className="h-1 w-1 rounded-full bg-blue-600"></span>
                           + {items.length - 1} MORE ITEMS
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between ">
                      <Link 
                        href={`orders/order-details/${order.id}`} 
                        className="inline-flex items-center gap-1 text-[13px] font-bold text-blue-600 hover:gap-2 transition-all"
                      >
                        Order Details <ChevronRightIcon className="h-3 w-3" />
                      </Link>

                      {order.status === 'pending' && (
                        <button 
                          onClick={() => handleCancelOrder(order.id)} 
                          className="text-[13px] font-bold text-gray-500 hover:text-red-500 transition"
                        >
                          Cancel Order
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}