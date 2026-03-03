"use client";
import { useState, useEffect } from "react";
import api from "@/utils/api";
import toast from "react-hot-toast";
import Link from "next/link";
import {
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  ArchiveBoxIcon,
} from "@heroicons/react/24/outline";
import { getImageUrl } from "@/utils/imageHelper";

import AddProductModal from "./add/page";
import EditProductModal from "./edit/page";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);


  const fetchProducts = async () => {
    try {
      // const { data } = await api.get("/products/all");
      const { data } = await api.get(
        `/products/all?page=${page}&limit=10&search=${searchTerm}`,
      );
      setProducts(data.products || []);
      setTotalPages(data.meta?.totalPages || 1);
      setTotalItems(data.meta?.totalItems || 0);
    } catch (err) {
      toast.error("Failed to load products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Trigger fetch when page or searchTerm changes
  useEffect(() => {
    fetchProducts();
  }, [page, searchTerm]);

  const handleEditClick = (product: any) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;

    try {
      await api.delete(`/products/delete/${id}`);
      toast.success("Product removed");
      setProducts(products.filter((p: any) => p.id !== id));
    } catch (err) {
      toast.error("Could not delete product");
    }
  };

  products.map((p: any) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-8">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Inventory
          </h1>
          <p className="text-gray-500 font-medium">
            Manage your {products.length} active listings
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-sm text-white px-5 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
        >
          <PlusIcon className="h-5 w-5" />
          Add New Product
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="relative max-w-md">
        <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Filter by name..."
          className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 text-sm rounded-2xl outline-none focus:ring-2 focus:ring-blue-100 font-bold text-gray-900 transition-all"
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Product
              </th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Category
              </th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Price
              </th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Stock
              </th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {products.map((product: any) => (
              <tr
                key={product.id}
                className="hover:bg-gray-50/50 transition-colors group"
              >
                <td className="px-8 py-5">
                  <div className="flex items-center gap-4">
                    <img
                      src={getImageUrl(product.image)}
                      className="h-12 w-12 rounded-xl object-cover bg-gray-50 border border-gray-100"
                    />
                    <span className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {product.name}
                    </span>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-widest">
                    {product.category?.name || "General"}
                  </span>
                </td>
                <td className="px-8 py-5 font-bold text-gray-900">
                  ${product.price}
                </td>
                <td className="px-8 py-5">
                  <div className="flex items-center gap-2">
                    {/* <div
                      className={`h-2 w-2 rounded-full ${product.stock > 10 ? "bg-green-500" : "bg-red-500"}`}
                    /> */}
                    <span className="font-bold text-sm text-gray-600">
                      {product.stock} left
                    </span>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleEditClick(product)}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    >
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

        {/* Pagination Controls */}
        <div className="px-8 py-5 bg-gray-50 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500 font-medium">
            Showing page <span className="text-gray-900 font-bold">{page}</span>{" "}
            of {totalPages}
            <span className="ml-1 text-[10px] text-gray-400">
              ({totalItems} total products)
            </span>
          </p>

          <div className="flex items-center gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              Previous
            </button>

            <div className="flex gap-1">
              {/* Simple logic to show page numbers if you want them later */}
              <span className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-sm font-black">
                {page}
              </span>
            </div>

            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 bg-blue-600 text-white border border-blue-600 rounded-xl text-sm font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-blue-100"
            >
              Next
            </button>
          </div>
        </div>

        {/* Empty State */}
        {products.length === 0 && !loading && (
          <div className="py-20 text-center">
            <ArchiveBoxIcon className="h-12 w-12 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-400 font-medium">
              No products match your search.
            </p>
          </div>
        )}
      </div>

      <AddProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onRefresh={fetchProducts}
      />
      <EditProductModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onRefresh={fetchProducts}
        product={selectedProduct}
      />
    </div>
  );
}
