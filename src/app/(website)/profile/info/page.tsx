"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/utils/api";
import toast from "react-hot-toast";

export default function InfoPage() {
  const { user, setUser } = useAuth();
  
  // States for name and phone
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [email, setEmail] = useState(user?.email || ""); // This will be empty if not in User model
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (name === user?.name && phone === user?.phone && email === user?.email) {
      return toast.error("No changes detected");
    }

    setLoading(true);
    try {
      // This sends the data to the /users/update/:id route
      const res = await api.put(`/users/update/${user?.id}`, { 
        name, 
        email, 
        phone,
      });

      if (res.data.success) {
        // We update the AuthContext so the rest of the app knows the new info
        setUser({ 
          ...user, 
          name: res.data.user.name, 
          email: res.data.user.email, 
          phone: res.data.user.phone,
        });
        toast.success("Profile updated!");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#d1daeb] rounded-2xl shadow-sm border border-gray-100 p-8">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Personal Information</h2>
      
      <form onSubmit={handleUpdate} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name Field */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Full Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-200 rounded-xl p-4 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition" 
            />
          </div>

          {/* Email Field (Disabled) */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
              className="w-full border border-gray-200 rounded-xl p-4 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition " 
            />
          </div>

          {/* Phone Field */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Phone Number</label>
            <input 
              type="tel" 
              value={phone}
              maxLength={10}
              placeholder="Add your phone number"
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border border-gray-200 rounded-xl p-4 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition" 
            />
          </div>
        </div>

        <div className="pt-4">
          <button 
            type="submit"
            disabled={loading}
            className="bg-[#1b42e0] text-white px-8 py-4 rounded-xl font-bold hover:bg-gray-900 transition-all disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}