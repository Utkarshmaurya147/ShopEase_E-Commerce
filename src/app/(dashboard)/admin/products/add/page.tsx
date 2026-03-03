"use client";
import { useState, useEffect } from "react";
import api from "@/utils/api";
import toast from "react-hot-toast";
import { XMarkIcon, PhotoIcon } from "@heroicons/react/24/outline";

export default function AddProductModal({ isOpen, onClose, onRefresh }: any) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    categoryId: "",
    image: null as File | null,
  });

  // Fetch categories
  useEffect(() => {
    if (isOpen) {
      api
        .get("/categories/all")
        .then((res) => {
          setCategories(res.data.categories);
        })
        .catch((err) => {
          console.error("Failed to fetch categories:", err);
        });
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append("name", formData.name);
    data.append("price", formData.price);
    data.append("description", formData.description);
    data.append("categoryId", formData.categoryId);
    if (formData.image) data.append("image", formData.image);

    try {
      await api.post("/products/create", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Product added to inventory");
      onRefresh(); // Refresh the table list
      onClose(); // Close modal
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Add New Product
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-200 rounded-full transition-colors"
          >
            <XMarkIcon className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name & Price */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">
                Product Name
              </label>
              <input
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-gray-600 focus:ring-2 focus:ring-blue-500/20 outline-none"
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">
                Price (USD)
              </label>
              <input
                required
                type="number"
                step="0.01"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-gray-600 focus:ring-2 focus:ring-blue-500/20 outline-none"
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
              />
            </div>
          </div>

          {/* Category Selection */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">
              Category
            </label>
            <select
              required
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-gray-600 outline-none"
              onChange={(e) =>
                setFormData({ ...formData, categoryId: e.target.value })
              }
            >
              <option value="">Select a Category</option>
              {categories.map((cat: any) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">
              Description
            </label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-gray-600 outline-none resize-none"
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            ></textarea>
          </div>

          {/* Image Upload UI */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">
              Product Image
            </label>
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors group">
              <PhotoIcon className="h-8 w-8 text-slate-300 group-hover:text-blue-500 transition-colors" />
              <span className="text-xs text-slate-400 mt-2 font-medium">
                {formData.image ? formData.image.name : "Click to upload image"}
              </span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    image: e.target.files?.[0] || null,
                  })
                }
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-200 transition-all disabled:opacity-50"
          >
            {loading ? "Processing..." : "Create Product"}
          </button>
        </form>
      </div>
    </div>
  );
}
