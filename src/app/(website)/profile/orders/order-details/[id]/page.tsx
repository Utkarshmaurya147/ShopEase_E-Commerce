"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/utils/api";
import {
  ArrowLeftIcon,
  MapPinIcon,
  CreditCardIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id;
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    if (!orderId) return;

    const fetchDetails = async () => {
      try {
        const { data } = await api.get(`/orders/details/${orderId}`);
        setOrder(data.order);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDetails();
  }, [orderId]);

  if (!order)
    return (
      <div className="flex justify-center items-center p-20">
        <div className="h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="space-y-6">
      {/* Main Receipt Card */}
      <div className="bg-[#d1daeb] rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header Section */}
        <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row justify-between gap-6 bg-gray-50/30">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-gray-900">
                Order #{order.id.slice(0, 8)}
              </h1>
              <span
                className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-tight ${
                  order.status === "delivered"
                    ? "bg-green-50 text-green-600"
                    : order.status === "cancelled"
                      ? "bg-red-50 text-red-600"
                      : "bg-blue-50 text-blue-600"
                }`}
              >
                {order.status}
              </span>
            </div>
            <p className="text-xs font-bold text-gray-400 flex items-center gap-1">
              <CalendarIcon className="h-3.5 w-3.5" />
              Placed on{" "}
              {new Date(order.created_at || order.createdAt).toLocaleDateString(
                undefined,
                { month: "long", day: "numeric", year: "numeric" },
              )}
            </p>
          </div>

          <div className="md:text-right">
            <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">
              Total Amount
            </p>
            <p className="text-2xl font-black text-blue-600 leading-none">
              ${Number(order.totalAmount).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-gray-50">
          <div className="space-y-3">
            <h3 className="flex items-center gap-2 text-[11px] font-bold text-gray-400 uppercase">
              <MapPinIcon className="h-4 w-4" /> Shipping Details
            </h3>
            <div className="bg-[#e8e9ed] p-4 rounded-2xl border border-gray-100">
              <p className="text-sm font-bold text-gray-900 leading-relaxed">
                {order.address}
              </p>
              <p className="text-xs font-bold text-blue-600 mt-2">
                Phone: {order.shipping_phone}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="flex items-center gap-2 text-[11px] font-bold text-gray-400 uppercase">
              <CreditCardIcon className="h-4 w-4" /> Payment Summary
            </h3>
            <div className="bg-[#e8e9ed] p-4 rounded-2xl border border-gray-100">
              {/* Dynamic Status with Color Coding */}
              <div className="flex justify-between items-center mb-3">
                <p className="text-xs font-bold text-gray-500 uppercase">
                  Status
                </p>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase ${
                    order.paymentStatus === "paid"
                      ? "bg-green-100 text-green-700"
                      : order.paymentStatus === "failed"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {order.paymentStatus}
                </span>
              </div>

              {/* Dynamic Method */}
              <div className="flex justify-between items-center">
                <p className="text-xs font-bold text-gray-500 uppercase">
                  Method
                </p>
                <p className="text-xs font-black text-gray-900 uppercase">
                  {order.paymentMethod === "razorpay"
                    ? "Online Payment"
                    : "Cash on Delivery"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Items List */}
        <div className="p-8">
          <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-6">
            Items Ordered
          </h3>
          <div className="space-y-4">
            {order.items?.map((item: any) => (
              <div
                key={item.id}
                className="group flex items-center gap-5 p-4 rounded-2xl border border-transparent hover:border-gray-100 hover:bg-[#e8e9ed] transition-all duration-300"
              >
                <div className="h-20 w-20 flex-shrink-0 bg-white rounded-xl overflow-hidden border border-gray-100 relative">
                  <img
                    src={
                      item.product?.image?.startsWith("http")
                        ? item.product.image
                        : `http://localhost:5000/uploads/${item.product?.image}`
                    }
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 text-base mb-1 truncate group-hover:text-blue-600 transition">
                    {item.product?.name}
                  </p>
                  <p className="text-xs font-bold text-gray-400">
                    Quantity:{" "}
                    <span className="text-gray-900">{item.quantity}</span>
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm font-black text-gray-900">
                    ${(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Final Receipt Footer */}
        <div className="p-8 bg-gray-900 text-white flex justify-between items-center">
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Grand Total
            </p>
            <p className="text-xs text-white/60">Inclusive of all taxes</p>
          </div>
          <p className="text-3xl font-black">
            ${Number(order.totalAmount).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
