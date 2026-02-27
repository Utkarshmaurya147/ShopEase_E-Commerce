'use client'
import { useState, useEffect } from "react";
import api from "@/utils/api";
import toast from "react-hot-toast";
import Link from "next/link";
import { 
  PlusIcon, 
  PencilSquareIcon, 
  TrashIcon, 
  MagnifyingGlassIcon,
  ArchiveBoxIcon
} from "@heroicons/react/24/outline";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get("/products/all");
      setProducts(data);
    } catch (err) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;

    try {
      await api.delete(`/products/${id}`);
      toast.success("Product removed");
      setProducts(products.filter((p: any) => p.id !== id));
    } catch (err) {
      toast.error("Could not delete product");
    }
  };

  const filteredProducts = products.filter((p: any) => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Inventory</h1>
          <p className="text-gray-500 font-medium">Manage your {products.length} active listings</p>
        </div>
        <Link 
          href="/admin/products/new" 
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-4 rounded-2xl text-white font-semibold hover:bg-gray-900 transition-all shadow-xl shadow-blue-100"
        >
          <PlusIcon className="h-5 w-5" />
          Add New Product
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div className="relative max-w-md">
        <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input 
          type="text" 
          placeholder="Filter by name..." 
          className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-100 font-bold text-gray-900 transition-all"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Product</th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Category</th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Price</th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Stock</th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredProducts.map((product: any) => (
              <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-4">
                    <img src={product.image} className="h-12 w-12 rounded-xl object-cover bg-gray-50 border border-gray-100" />
                    <span className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{product.name}</span>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-widest">
                    {product.category?.name || "General"}
                  </span>
                </td>
                <td className="px-8 py-5 font-bold text-gray-900">${product.price}</td>
                <td className="px-8 py-5">
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${product.stock > 10 ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="font-bold text-sm text-gray-600">{product.stock} left</span>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <div className="flex items-center gap-3">
                    <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                      <PencilSquareIcon className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={() => handleDelete(product.id, product.name)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Empty State */}
        {filteredProducts.length === 0 && !loading && (
          <div className="py-20 text-center">
            <ArchiveBoxIcon className="h-12 w-12 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-400 font-medium">No products match your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}