'use client'
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/utils/api';
import { MapPinIcon, HomeIcon, BriefcaseIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

export default function AddressPage() {
  const { user, setUser, loading: authLoading } = useAuth(); // Added authLoading
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'India',
    addressType: 'Home'
  });

  // Load and split the single address string from the DB into form fields
  useEffect(() => {
    if (user) {
      // Split by comma and trim whitespace to avoid " Ahmedabad" (with leading space)
      const parts = user.address ? user.address.split(',').map((p: string) => p.trim()) : [];
      
      setFormData({
        street: parts[0] || '',
        city: parts[1] || '',
        state: parts[2] || '',
        zip: parts[3] || '',
        country: parts[4] || 'India',
        addressType: user.addressType || 'Home'
      });
    }
  }, [user]);

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Combine fields into one string for your single DB column
    const fullAddress = `${formData.street}, ${formData.city}, ${formData.state}, ${formData.zip}, ${formData.country}`;

    try {
      const res = await api.put(`/users/update/${user?.id}`, { 
        address: fullAddress,
        addressType: formData.addressType // Ensure your backend saves this too
      });

      if (res.data.success) {
        // Update global context so the whole app knows the new address
        setUser({ ...user, address: fullAddress, addressType: formData.addressType });
        toast.success("Shipping address updated successfully!");
        // ❌ REMOVED: setFormData reset. We want to keep the data visible.
      }
    } catch (err: any) {
      toast.error("Failed to update address");
    } finally {
      setLoading(false);
    }
  };

  // Guard: Don't render the form with empty data while the user is being fetched
  if (authLoading) {
    return (
      <div className="flex justify-center items-center p-20">
        <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#d1daeb] rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex items-center gap-2">
        <MapPinIcon className="h-5 w-5 text-blue-600" />
        <h2 className="text-xl font-bold text-gray-900">Shipping Address</h2>
      </div>

      <form onSubmit={handleSaveAddress} className="p-8 space-y-6">
        {/* Address Type Selector */}
        <div className="flex gap-4 mb-8">
          {['Home', 'Office'].map((type) => (
            <label key={type} className="flex-1 cursor-pointer group">
              <input 
                type="radio" 
                name="addressType" 
                className="peer hidden" 
                checked={formData.addressType === type}
                onChange={() => setFormData({...formData, addressType: type})}
              />
              <div className="flex items-center justify-center gap-2 p-4 border rounded-xl peer-checked:border-blue-600 peer-checked:bg-blue-50 group-hover:bg-gray-50 transition">
                {type === 'Home' ? <HomeIcon className="h-5 w-5 text-gray-600" /> : <BriefcaseIcon className="h-5 w-5 text-gray-600" />}
                <span className="text-sm font-bold text-gray-600">{type}</span>
              </div>
            </label>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-gray-600 uppercase mb-2">Street Address</label>
            <input 
              type="text" 
              required
              value={formData.street}
              onChange={(e) => setFormData({...formData, street: e.target.value})}
              placeholder="House number and street name"
              className="w-full border border-gray-200 rounded-xl p-3 text-sm text-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase mb-2">City</label>
            <input 
              type="text" 
              required
              value={formData.city}
              onChange={(e) => setFormData({...formData, city: e.target.value})}
              placeholder="City"
              className="w-full border border-gray-200 rounded-xl p-3 text-sm text-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase mb-2">State</label>
            <input 
              type="text" 
              required
              value={formData.state}
              onChange={(e) => setFormData({...formData, state: e.target.value})}
              placeholder="State"
              className="w-full border border-gray-200 rounded-xl p-3 text-sm text-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase mb-2">Postal Code</label>
            <input 
              type="text" 
              required
              value={formData.zip}
              onChange={(e) => setFormData({...formData, zip: e.target.value})}
              placeholder="ZIP Code"
              className="w-full border border-gray-200 rounded-xl p-3 text-sm text-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase mb-2">Country</label>
            <select 
              value={formData.country}
              onChange={(e) => setFormData({...formData, country: e.target.value})}
              className="w-full border border-gray-200 rounded-xl p-3 text-sm text-gray-600 focus:ring-2 focus:ring-blue-500 outline-none bg-[#d1daeb]"
            >
              <option>India</option>
              <option>United States</option>
              <option>United Kingdom</option>
            </select>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-50 flex justify-end">
          <button 
            type="submit"
            disabled={loading}
            className="bg-[#1b42e0] text-white px-10 py-3 rounded-xl font-bold hover:bg-blue-500 transition disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Address"}
          </button>
        </div>
      </form>
    </div>
  );
}