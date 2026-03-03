"use client";
import { useState, useEffect } from "react";
import api from "@/utils/api";
import toast from "react-hot-toast";
import { PlusIcon, TrashIcon, TagIcon } from "@heroicons/react/24/outline";

export default function CategoryManager() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = async () => {
    const { data } = await api.get("/categories/all");
    if (data.success) setCategories(data.categories);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory) return;
    setLoading(true);
    try {
      await api.post("/categories/create", { name: newCategory });
      toast.success("Category Created");
      setNewCategory("");
      fetchCategories();
    } catch (err) {
      toast.error("Failed to create category");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure? This may affect products in this category.")) return;
    try {
      await api.delete(`/categories/delete/${id}`);
      setCategories(categories.filter((c: any) => c.id !== id));
      toast.success("Category Deleted");
    } catch (err) {
      toast.error("Cannot delete category with active products");
    }
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Category Management</h1>
        <p className="text-sm text-slate-500 font-medium">Organize your ShopEase inventory levels</p>
      </div>

      {/* Add Category Form */}
      <form onSubmit={handleAdd} className="flex gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex-1 relative">
          <TagIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input 
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="New Category Name (e.g. Smart Home)" 
            className="w-full pl-12 text-gray-700 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 font-medium"
          />
        </div>
        <button 
          disabled={loading}
          className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add Category"}
        </button>
      </form>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat: any) => (
          <div key={cat.id} className="group bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-500/30 transition-all flex justify-between items-center">
            <div>
              <p className="font-bold text-slate-900">{cat.name}</p>
              <p className="text-[10px] text-slate-400 font-mono uppercase tracking-tighter">/{cat.slug}</p>
            </div>
            <button 
              onClick={() => handleDelete(cat.id)}
              className="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}