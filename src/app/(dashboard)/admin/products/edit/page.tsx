"use client";
import { useState, useEffect } from "react";
import api from "@/utils/api";
import toast from "react-hot-toast";
import { XMarkIcon, PhotoIcon } from "@heroicons/react/24/outline";
import { getImageUrl } from "@/utils/imageHelper";

export default function EditProductModal({
  isOpen,
  onClose,
  onRefresh,
  product,
}: any) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    categoryId: "",
    image: null as File | null,
  });

  // Pre-fill form when product changes
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        price: product.price || "",
        description: product.description || "",
        categoryId: product.categoryId || "",
        image: null, // Reset file input
      });
    }
  }, [product]);

  // fetch categories
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
    // Only append image if a new file was selected
    if (formData.image) data.append("image", formData.image);

    try {
      await api.put(`/products/update/${product.id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Product updated successfully");
      onRefresh();
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Edit Product
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-200 rounded-full transition-colors"
          >
            <XMarkIcon className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-left">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">
                Name
              </label>
              <input
                value={formData.name}
                required
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-gray-600 focus:ring-2 focus:ring-blue-500/10 outline-none"
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">
                Price
              </label>
              <input
                value={formData.price}
                required
                type="number"
                step="0.01"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-gray-600 focus:ring-2 focus:ring-blue-500/10 outline-none"
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
              />
            </div>
          </div>

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
              <option value="">Select Category</option>
              {categories.map((cat: any) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">
              Description
            </label>
            <textarea
              value={formData.description}
              rows={3}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-gray-600 outline-none resize-none"
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            ></textarea>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">
              New Image (Optional)
            </label>
            <div className="flex items-center gap-4">
              {product.image && !formData.image && (
                <img
                  src={getImageUrl(product.image)}
                  className="h-16 w-16 rounded-lg object-cover border"
                  alt="current"
                />
              )}
              <label className="flex-1 flex flex-col items-center justify-center h-16 border-2 border-dashed border-slate-200 rounded-lg bg-slate-50 hover:bg-slate-100 cursor-pointer">
                <span className="text-[10px] font-bold text-slate-500">
                  {formData.image ? formData.image.name : "Choose New File"}
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
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-slate-200 rounded-lg font-bold text-xs text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg font-bold text-xs hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Updating..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
