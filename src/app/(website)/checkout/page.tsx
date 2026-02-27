"use client";
import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { ShieldCheckIcon, LockClosedIcon, ArrowLeftIcon, CreditCardIcon, TruckIcon} from "@heroicons/react/24/outline";
import Link from "next/link";
import api from "@/utils/api";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const { cartItems, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { user, setUser } = useAuth();
  const [updateProfileAddress, setUpdateProfileAddress] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "razorpay">(
    "razorpay",
  );

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const shipping = subtotal > 0 ? 15 : 0;
  const total = subtotal + shipping;

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    shipping_phone: "",
  });

  // Pre-fill form from Auth Context
  useEffect(() => {
    if (!user) return;
    const addressParts = user.address ? user.address.split(", ") : [];
    setFormData({
      email: user.email || "",
      shipping_phone: user.phone || "",
      firstName: user.name?.split(" ")[0] || "",
      lastName: user.name?.split(" ")[1] || "",
      address: addressParts[0] || "",
      city: addressParts[1] || "",
      state: addressParts[2] || "",
      zip: addressParts[3] || "",
    });
  }, [user]);

  // Utility to load Razorpay SDK
  const loadScript = (src: string) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Main Submission Handler

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const shippingAddress = `${formData.address}, ${formData.city}, ${formData.state}, ${formData.zip}`;

    if (paymentMethod === "razorpay") {
      await handleRazorpayPayment(shippingAddress);
    } else {
      await handleCODPayment(shippingAddress);
    }
  };

  // A: Cash on Delivery (Standard Order Controller)

  const handleCODPayment = async (shippingAddress: string) => {
    try {
      const orderResponse = await api.post("/orders/create", {
        items: cartItems.map((item) => ({
          id: item.id,
          price: item.price,
          quantity: item.quantity,
        })),
        address: shippingAddress,
        shipping_phone: formData.shipping_phone,
      });

      if (orderResponse.data.success) {
        await handleAfterOrderSuccess(
          shippingAddress,
          orderResponse.data.orderId,
        );
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to place COD order");
    } finally {
      setIsSubmitting(false);
    }
  };

  // B: Online Payment (Payment Controller)

  const handleRazorpayPayment = async (shippingAddress: string) => {
    const isLoaded = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js",
    );
    if (!isLoaded) {
      toast.error("Razorpay SDK failed to load");
      setIsSubmitting(false);
      return;
    }

    try {
      // Create Razorpay Order on Backend
      const { data: razorRes } = await api.post("/payments/create-order", {
        amount: total,
      });

      // Configure Razorpay Modal
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: razorRes.order.amount,
        currency: "INR",
        name: "ShopEase",
        description: "Secure Order Payment",
        order_id: razorRes.order.id,
        notes: {
          order_id: razorRes.data.orderId, // This is your MySQL Order ID
        },
        handler: async function (response: any) {
          try {
            const verifyData = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderInfo: {
                totalAmount: total,
                address: shippingAddress,
                shipping_phone: formData.shipping_phone,
                items: cartItems.map((item) => ({
                  productId: item.id,
                  quantity: item.quantity,
                  price: item.price,
                })),
              },
            };

            const res = await api.post("/payments/verify", verifyData);
            if (res.data.success) {
              await handleAfterOrderSuccess(shippingAddress, res.data.orderId);
            }
          } catch (err) {
            toast.error("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          contact: formData.shipping_phone,
        },
        theme: { color: "#2563eb" },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error: any) {
      toast.error("Payment initialization failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Shared logic for updating profile and cleaning up after success

  const handleAfterOrderSuccess = async (
    shippingAddress: string,
    orderId: string,
  ) => {
    if (updateProfileAddress) {
      try {
        await api.put(`/users/update/${user?.id}`, {
          address: shippingAddress,
          phone: formData.shipping_phone,
          name: `${formData.firstName} ${formData.lastName}`,
        });
        setUser({
          ...user,
          address: shippingAddress,
          phone: formData.shipping_phone,
        });
      } catch (err) {
        console.error("Profile update failed, but order was placed.");
      }
    }
    toast.success("Order Placed Successfully!");
    clearCart();
    router.push(`/order-success/${orderId}`);
  };

 if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6">
        <div className="w-20 h-20 bg-gray-50 rounded-[30px] flex items-center justify-center mb-6">
          <LockClosedIcon className="h-10 w-10 text-gray-300" />
        </div>
        <h2 className="text-3xl font-black text-gray-900 tracking-tighter">Your cart is empty</h2>
        <Link
          href="/products"
          className="mt-8 px-10 py-4 bg-blue-600 text-white rounded-[20px] font-black hover:bg-gray-900 transition-all shadow-xl shadow-blue-100"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen selection:bg-blue-100">
      {/* 1. BRANDED HEADER */}
      <section className="relative bg-[#0a1128] py-16 px-6 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />
        </div>
        <div className="relative max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
              Secure <span className="text-blue-400">Checkout</span>
            </h1>
            <p className="text-slate-400 mt-2 font-medium">Finalize your order details securely.</p>
          </div>
          <Link href="/cart" className="flex items-center gap-2 text-sm font-black text-blue-400 hover:text-white transition-colors">
            <ArrowLeftIcon className="h-4 w-4" /> Back to Cart
          </Link>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          
          {/* 2. SHIPPING FORM */}
          <div className="flex-1 w-full">
            <div className="flex items-center gap-3 mb-10">
               <div className="p-3 bg-blue-50 rounded-2xl">
                 <TruckIcon className="h-6 w-6 text-blue-600" />
               </div>
               <h2 className="text-2xl font-black text-gray-900 tracking-tight">Shipping Details</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    placeholder="Utkarsh"
                    className="w-full bg-gray-50 border border-transparent rounded-[20px] p-4 text-sm font-medium text-gray-900 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-200 transition-all outline-none"
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    placeholder="utkarsh@example.com"
                    className="w-full bg-gray-50 border border-transparent rounded-[20px] p-4 text-sm font-medium text-gray-900 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-200 transition-all outline-none"
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Delivery Address</label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  placeholder="Street address, apartment, suite"
                  className="w-full bg-gray-50 border border-transparent rounded-[20px] p-4 text-sm font-medium text-gray-900 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-200 transition-all outline-none"
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-2 md:col-span-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">City</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    className="w-full bg-gray-50 border border-transparent rounded-[20px] p-4 text-sm font-medium text-gray-900 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>
                <div className="space-y-2 md:col-span-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">State</label>
                  <input
                    type="text"
                    required
                    value={formData.state}
                    className="w-full bg-gray-50 border border-transparent rounded-[20px] p-4 text-sm font-medium text-gray-900 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  />
                </div>
                <div className="space-y-2 md:col-span-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">ZIP</label>
                  <input
                    type="text"
                    required
                    value={formData.zip}
                    className="w-full bg-gray-50 border border-transparent rounded-[20px] p-4 text-sm font-medium text-gray-900 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                    onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex items-start gap-3 p-2 bg-gray-50 rounded-2xl border border-gray-100">
                <input
                  id="save-info"
                  type="checkbox"
                  checked={updateProfileAddress}
                  onChange={(e) => setUpdateProfileAddress(e.target.checked)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded cursor-pointer"
                />
                <label
                  htmlFor="save-info"
                  className="text-sm font-bold text-gray-900 cursor-pointer"
                >
                  Save this as my default address
                </label>
              </div>

              {/* Payment Selection */}
              <div className="pt-8 border-t border-gray-100">
                <h3 className="text-xl font-black text-gray-900 mb-6 tracking-tight flex items-center gap-2">
                  <CreditCardIcon className="h-6 w-6 text-blue-600" /> Payment Method
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("razorpay")}
                    className={`p-6 rounded-[24px] border-2 flex flex-col items-center gap-2 transition-all ${paymentMethod === "razorpay" ? "border-blue-600 bg-blue-50/50 shadow-lg shadow-blue-900/5" : "border-gray-100"}`}
                  >
                    <span className={`font-black uppercase tracking-widest text-xs ${paymentMethod === "razorpay" ? "text-blue-600" : "text-gray-400"}`}>Online Payment</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("cod")}
                    className={`p-6 rounded-[24px] border-2 flex flex-col items-center gap-2 transition-all ${paymentMethod === "cod" ? "border-blue-600 bg-blue-50/50 shadow-lg shadow-blue-900/5" : "border-gray-100"}`}
                  >
                    <span className={`font-black uppercase tracking-widest text-xs ${paymentMethod === "cod" ? "text-blue-600" : "text-gray-400"}`}>Cash on Delivery</span>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-5 rounded-[24px] font-black text-xl transition-all flex items-center justify-center gap-3 ${isSubmitting ? "bg-gray-200 text-gray-400" : "bg-blue-600 text-white shadow-2xl shadow-blue-100 hover:bg-gray-900 active:scale-[0.98]"}`}
              >
                {isSubmitting ? "Processing..." : (
                  <><LockClosedIcon className="h-6 w-6" /> {paymentMethod === "razorpay" ? "Pay Now" : "Confirm Order"} — ${total.toLocaleString()}</>
                )}
              </button>
            </form>
          </div>

          {/* 3. ORDER SUMMARY: Glassmorphism */}
          <div className="lg:w-[450px] sticky top-32">
            <div className="bg-gray-50/50 backdrop-blur-xl border border-gray-100 rounded-[40px] p-10 shadow-2xl shadow-gray-200/50">
              <h3 className="text-2xl font-black text-gray-900 mb-8 tracking-tighter">Summary</h3>
              
              <div className="space-y-6 mb-10 overflow-y-auto max-h-[350px] pr-4 no-scrollbar">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-5 group">
                    <div className="relative w-20 h-20 flex-shrink-0">
                        <img src={item.image} className="w-full h-full bg-white rounded-[20px] object-cover border border-gray-100 shadow-sm" alt={item.name} />
                        <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-full border-2 border-white">{item.quantity}</span>
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <h4 className="text-sm font-black text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">{item.name}</h4>
                      <p className="text-sm font-black text-blue-600 mt-1">${(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-8 border-t border-gray-200">
                <div className="flex justify-between font-bold text-gray-500 text-sm">
                  <span>Subtotal</span>
                  <span className="text-gray-900 font-black">${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-gray-500 text-sm">
                  <span>Shipping</span>
                  <span className="text-green-600 font-black">{shipping === 0 ? "FREE" : `$${shipping}`}</span>
                </div>
                <div className="flex justify-between text-2xl font-black text-gray-900 pt-6 border-t border-gray-200">
                  <span>Total</span>
                  <span className="text-blue-600">${total.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <ShieldCheckIcon className="h-4 w-4 text-green-500" /> Secure SSL Encryption
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
 