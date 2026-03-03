'use client'
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { TrashIcon, MinusIcon, PlusIcon, ArrowLeftIcon, ShoppingBagIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";
import { getImageUrl } from "@/utils/imageHelper";

export default function CartPage() {
  const { cartItems, updateQuantity, removeItem } = useCart();

  const subtotal = cartItems.reduce((acc, item) => {
    const price = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
    return acc + (price * item.quantity);
  }, 0);
  
  const shipping = subtotal > 0 && subtotal < 500 ? 15 : 0; // Added free shipping logic for high orders
  const total = subtotal + shipping;

  return (
    <div className="bg-white min-h-screen selection:bg-blue-100">
      {/* 1. BRANDED HEADER: Consistent with Products/Categories */}
      <section className="relative bg-[#0a1128] py-16 px-6 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />
        </div>
        <div className="relative max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
            Your <span className="text-blue-400">Cart</span>
          </h1>
          <p className="text-slate-400 mt-2 font-medium">Review your items before we secure your order.</p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* 2. ITEMS LIST: Floating Card Aesthetic */}
            <div className="lg:col-span-8 space-y-8">
              {cartItems.map((item) => (
                <div key={item.id} className="group flex flex-col sm:flex-row bg-white p-6 rounded-[40px] border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.06)] transition-all duration-500">
                  <div className="h-32 w-full sm:w-32 flex-shrink-0 overflow-hidden rounded-[30px] bg-gray-50 border border-gray-100">
                    <img 
                        src={getImageUrl(item.image)} 
                        alt={item.name} 
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                  </div>

                  <div className="mt-4 sm:mt-0 sm:ml-8 flex flex-1 flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-xl font-black text-gray-900 group-hover:text-blue-600 transition-colors leading-tight">
                                    {item.name}
                                </h3>
                                <p className="mt-1 text-xs font-black text-blue-500 uppercase tracking-widest">
                                    {typeof item.category === 'object' ? item.category.name : item.category || "Original"}
                                </p>
                            </div>
                            <p className="text-xl font-black text-gray-900">${(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                    </div>

                    <div className="flex items-center justify-between mt-6">
                      {/* TACTILE QUANTITY SELECTOR */}
                      <div className="flex items-center bg-gray-50 rounded-2xl p-1 border border-gray-100">
                        <button 
                          onClick={() => updateQuantity(item.id, -1)} 
                          className="p-2 bg-white rounded-xl shadow-sm text-gray-500 hover:text-blue-600 hover:scale-105 active:scale-95 transition-all"
                        >
                          <MinusIcon className="h-4 w-4" />
                        </button>
                        <span className="px-5 font-black text-gray-900 text-sm">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, 1)} 
                          className="p-2 bg-white rounded-xl shadow-sm text-gray-500 hover:text-blue-600 hover:scale-105 active:scale-95 transition-all"
                        >
                          <PlusIcon className="h-4 w-4" />
                        </button>
                      </div>

                      <button 
                        onClick={() => removeItem(item.id)}
                        className="p-3 text-gray-300 hover:text-red-500 transition-colors duration-300"
                        title="Remove Item"
                      >
                        <TrashIcon className="h-6 w-6" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              <Link href="/products" className="group inline-flex items-center text-sm font-black text-gray-400 hover:text-blue-600 transition-all mt-4">
                <ArrowLeftIcon className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Continue Exploring
              </Link>
            </div>

            {/* 3. ORDER SUMMARY: Glassmorphism Sidebar */}
            <div className="lg:col-span-4 sticky top-32">
              <div className="bg-gray-50/50 backdrop-blur-md p-10 rounded-[48px] border border-gray-100 shadow-2xl shadow-gray-100/50">
                <h2 className="text-2xl font-black text-gray-900 mb-8 tracking-tighter">Summary</h2>
                
                <div className="space-y-6 text-sm">
                  <div className="flex justify-between font-bold text-gray-500">
                    <span>Subtotal</span>
                    <span className="text-gray-900 font-black">${subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-bold text-gray-500">
                    <span>Shipping</span>
                    <span className="text-gray-900 font-black">
                      {shipping === 0 ? "Complimentary" : `$${shipping}`}
                    </span>
                  </div>
                  
                  <div className="h-px bg-gray-200 my-6" />
                  
                  <div className="flex justify-between text-xl font-black text-gray-900">
                    <span>Total</span>
                    <span className="text-blue-600">${total.toLocaleString()}</span>
                  </div>
                </div>

                <Link href="/checkout">
                  <button className="mt-10 w-full rounded-[24px] bg-blue-600 py-5 text-lg font-black text-white shadow-2xl shadow-blue-100 hover:bg-gray-900 hover:scale-[1.02] active:scale-[0.98] transition-all">
                    Checkout Now
                  </button>
                </Link>
                
                <div className="mt-8 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                    <ShieldCheckIcon className="h-4 w-4 text-green-500" /> Secure Encryption Active
                </div>
              </div>
            </div>

          </div>
        ) : (
          /* 4. PREMIUM EMPTY STATE */
          <div className="text-center py-32 px-6 bg-gray-50 rounded-[60px] border-2 border-dashed border-gray-200">
            <div className="inline-flex p-8 bg-white rounded-[40px] shadow-xl shadow-gray-200/50 mb-8">
               <ShoppingBagIcon className="h-16 w-16 text-gray-200" />
            </div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tighter">Your cart is empty.</h2>
            <p className="text-gray-500 mt-4 max-w-sm mx-auto font-medium">It looks like you haven't discovered your next favorite item yet.</p>
            <Link href="/products" className="mt-10 inline-block bg-blue-600 text-white px-10 py-5 rounded-[24px] font-black hover:bg-gray-900 transition-all shadow-xl shadow-blue-100">
              Start Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}