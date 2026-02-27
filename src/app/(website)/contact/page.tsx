"use client";
import { useState } from "react";
import api from "@/utils/api";
import toast from "react-hot-toast";
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  PaperAirplaneIcon,
  ChevronDownIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

const faqs = [
  {
    question: "How long does shipping take?",
    answer:
      "Standard shipping typically takes 3-5 business days. Express shipping is available for 1-2 day delivery.",
  },
  {
    question: "What is your return policy?",
    answer:
      "We offer a 30-day money-back guarantee. If you're not satisfied, simply return the product in its original packaging.",
  },
  {
    question: "Can I track my order in real-time?",
    answer:
      "Yes! Once your order is shipped, you will receive a tracking link via email and in your ShopEase profile.",
  },
  {
    question: "Do you offer international shipping?",
    answer:
      "Currently, we ship to over 20 countries. Shipping costs and delivery times vary by location.",
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/supports/contact", formData);
      toast.success("Message sent! We'll get back to you soon.");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white selection:bg-blue-100">
      {/* 1. PREMIUM HEADER: Matching your Home/Account style */}
      <section className="relative bg-[#0a1128] py-20 px-6 overflow-hidden">
        {/* Subtle mesh gradient glows */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-[30%] h-[30%] bg-indigo-600/10 rounded-full blur-[100px]" />
        </div>

        <div className="relative max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-widest mb-6">
            <SparklesIcon className="h-3 w-3" /> Support Center
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-4">
            How can we <span className="text-blue-400">help?</span>
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto font-medium">
            Have a question about an order or a product? Our specialized team is
            available 24/7 to assist you.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-20 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* 2. CONTACT INFO: More vertical breathing room */}
          <div className="space-y-10">
            <div className="group flex gap-5 items-start">
              <div className="bg-blue-50 p-4 rounded-[20px] group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                <EnvelopeIcon className="h-6 w-6 text-blue-600 group-hover:text-white" />
              </div>
              <div>
                <h4 className="font-black text-gray-900 text-sm  mb-1">
                  Email Us
                </h4>
                <p className="text-sm text-gray-500 font-medium">
                  support@shopease.com
                </p>
              </div>
            </div>

            <div className="group flex gap-5 items-start">
              <div className="bg-green-50 p-4 rounded-[20px] group-hover:bg-green-600 transition-all duration-300">
                <PhoneIcon className="h-6 w-6 text-green-600 group-hover:text-white" />
              </div>
              <div>
                <h4 className="font-black text-gray-900 text-sm  mb-1">
                  Call Us
                </h4>
                <p className="text-sm text-gray-500 font-medium">
                  +1 (555) 000-0000
                </p>
              </div>
            </div>

            <div className="group flex gap-5 items-start">
              <div className="bg-purple-50 p-4 rounded-[20px] group-hover:bg-purple-600 transition-all duration-300">
                <MapPinIcon className="h-6 w-6 text-purple-600 group-hover:text-white" />
              </div>
              <div>
                <h4 className="font-black text-gray-900 text-sm  mb-1">
                  Visit Us
                </h4>
                <p className="text-sm text-gray-500 font-medium leading-relaxed">
                  123, Gandhinagar,
                  <br />
                  Gift City, India
                </p>
              </div>
            </div>
          </div>

          {/* 3. CONTACT FORM: Cleaner inputs */}
          <div className="lg:col-span-2 bg-white border border-gray-100 p-8 md:p-12 rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.04)]">
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  className="w-full text-gray-900 p-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-200 transition-all outline-none placeholder:text-gray-400"
                  placeholder="John"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  className="w-full text-gray-900 p-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-200 transition-all outline-none placeholder:text-gray-400"
                  placeholder="utkarsh@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">
                  Subject
                </label>
                <input
                  type="text"
                  required
                  className="w-full text-gray-900 p-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-200 transition-all outline-none placeholder:text-gray-400"
                  placeholder="Order Assistance"
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">
                  Message
                </label>
                <textarea
                  required
                  rows={4}
                  className="w-full text-gray-900 p-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-200 transition-all outline-none resize-none placeholder:text-gray-400"
                  placeholder="Tell us how we can help..."
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                />
              </div>
              <div className="md:col-span-2">
                <button
                  disabled={loading}
                  className="w-full md:w-auto bg-blue-600 text-white font-black py-4 px-12 rounded-2xl hover:bg-gray-900 transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-100"
                >
                  {loading ? (
                    "Sending..."
                  ) : (
                    <>
                      <PaperAirplaneIcon className="h-5 w-5" /> Send Inquiry
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* 4. FAQ SECTION: Modern Accordion */}
        <div className="mt-32 max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">
              Common Questions
            </h2>
            <p className="text-gray-500 mt-2 font-medium">
              We might have already answered your question below.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`border border-gray-100 rounded-[30px] overflow-hidden transition-all duration-300 ${activeIndex === index ? "shadow-lg shadow-gray-100 border-blue-100" : ""}`}
              >
                <button
                  onClick={() =>
                    setActiveIndex(activeIndex === index ? null : index)
                  }
                  className="w-full flex items-center justify-between p-7 text-left bg-white hover:bg-gray-50/50 transition-colors"
                >
                  <span className="font-bold text-gray-800 text-lg">
                    {faq.question}
                  </span>
                  <div
                    className={`p-2 rounded-full transition-all duration-300 ${activeIndex === index ? "bg-blue-600 text-white rotate-180" : "bg-gray-50 text-gray-400"}`}
                  >
                    <ChevronDownIcon className="h-4 w-4" />
                  </div>
                </button>

                <div
                  className={`transition-all duration-500 ease-in-out overflow-hidden ${
                    activeIndex === index
                      ? "max-h-60 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="p-7 pt-0 text-gray-500 font-medium leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
