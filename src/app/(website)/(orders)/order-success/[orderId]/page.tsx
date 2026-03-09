'use client';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  CheckBadgeIcon, 
  ShoppingBagIcon, 
  ArrowRightIcon, 
  TruckIcon,
  SparklesIcon
} from '@heroicons/react/24/solid';

export default function OrderSuccessPage() {
  const params = useParams();
  const orderId = params.orderId;

  // Mock delivery date: 5 days from now
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 5);
  const formattedDate = deliveryDate.toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });

  return (
    <div className="min-h-screen bg-white selection:bg-blue-100">
      {/* 1. BRANDED HEADER BACKGROUND */}
      <section className="relative bg-[#0a1128] py-20 px-6 overflow-hidden flex items-center justify-center">
        {/* <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-[30%] h-[30%] bg-indigo-600/10 rounded-full blur-[100px]" />
        </div> */}

        {/* 2. SUCCESS CARD */}
        <div className="relative z-10 max-w-lg w-full bg-white rounded-[48px] p-10 md:p-16 shadow-2xl shadow-blue-900/20 text-center border border-white/10">
          
          {/* Animated Success Seal */}
          <div className="mb-10 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-100 rounded-full scale-150 blur-2xl opacity-50 animate-pulse" />
              <div className="relative rounded-full bg-blue-50 p-6 animate-in zoom-in duration-700">
                <CheckBadgeIcon className="h-20 w-20 text-blue-600" />
              </div>
            </div>
          </div>

          <h1 className="text-4xl font-black text-gray-900 tracking-tighter mb-4">
            Order <span className="text-blue-600">Confirmed.</span>
          </h1>
          <p className="text-slate-500 font-medium leading-relaxed mb-10">
            We’ve sent a confirmation email to your inbox. Your items are currently being prepared for dispatch.
          </p>

          {/* 3. ORDER INFO BENTO BOX */}
          <div className="grid grid-cols-1 gap-4 mb-10">
            <div className="bg-gray-50/80 rounded-[30px] p-6 text-left border border-gray-100">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Order Reference</p>
              <p className="text-sm font-black text-gray-900 break-all">#{String(orderId).slice(-12).toUpperCase()}</p>
            </div>
            
            <div className="flex items-center gap-4 bg-blue-50/50 rounded-[30px] p-6 text-left border border-blue-100">
              <div className="p-3 bg-blue-600 rounded-2xl text-white">
                <TruckIcon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Estimated Arrival</p>
                <p className="text-sm font-black text-gray-900">{formattedDate}</p>
              </div>
            </div>
          </div>

          {/* 4. ACTION BUTTONS */}
          <div className="space-y-4">
            <Link 
              href="/products" 
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-5 rounded-[24px] font-black hover:bg-gray-900 transition-all shadow-xl shadow-blue-100 active:scale-95"
            >
              <ShoppingBagIcon className="h-5 w-5" />
              Continue Shopping
            </Link>
            
            <Link 
              href="/profile" 
              className="group w-full flex items-center justify-center gap-2 text-gray-500 py-4 font-black text-sm uppercase tracking-widest hover:text-blue-600 transition-all"
            >
              Track Your Order
              <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* 5. LOYALTY NUDGE */}
          <div className="mt-12 pt-10 border-t border-gray-100 flex items-center justify-center gap-3">
            <SparklesIcon className="h-5 w-5 text-yellow-500" />
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Earned 120 ShopEase Points
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}