"use client";
import { useState, useEffect } from "react";
import api from "@/utils/api";
import toast from "react-hot-toast";
import {
  UserCircleIcon,
  EnvelopeIcon,
  CalendarIcon,
  ShieldCheckIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  type User = {
    id: string;
    role: string;
    [key: string]: any;
  };

  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get("/users/all");
      if (data.success) setUsers(data.users);
    } catch (err) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  // 1. Handle Soft Delete
  const handleDelete = async (id: number, name: string) => {
    if (
      !window.confirm(
        `Are you sure you want to remove ${name}? This will archive the account.`,
      )
    )
      return;
    try {
      await api.delete(`/users/delete/${id}`);
      toast.success("User archived");
      setUsers((prev) => prev.filter((u: any) => u.id !== id));
    } catch (err) {
      toast.error("Deletion failed");
    }
  };

  // 2. Handle Role Promotion/Demotion
  const toggleRole = async (user: any) => {
    const newRole = user.role === "admin" ? "customer" : "admin";
    if (!window.confirm(`Change ${user.name}'s role to ${newRole}?`)) return;

    try {
      await api.put(`/users/update/${user.id}`, { role: newRole });
      toast.success(`Updated to ${newRole}`);
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, role: newRole } : u)),
      );
    } catch (err) {
      toast.error("Failed to update role");
    }
  };

  const filteredUsers = users.filter(
    (u: any) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-8">
      {/* 1. Header & Stats */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Customers
          </h1>
          <p className="text-gray-500 font-medium">
            Manage your community and access levels
          </p>
        </div>
        <div className="bg-blue-600 px-6 py-3 rounded-2xl text-white shadow-xl shadow-blue-900/20">
          <span className="text-[10px] font-black uppercase tracking-widest block opacity-80">
            Total Users
          </span>
          <span className="text-xl font-bold">{users.length}</span>
        </div>
      </div>

      {/* 2. Search Bar */}
      <div className="relative max-w-md">
        <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search by name or email..."
          className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 font-medium text-slate-900 transition-all shadow-sm"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* 3. Users Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <th className="px-8 py-5">User Profile</th>
              <th className="px-8 py-5">Address</th>
              <th className="px-8 py-5 text-center">Role</th>
              <th className="px-8 py-5">Joined</th>
              <th className="px-8 py-5 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredUsers.map((user: any) => (
              <tr
                key={user.id}
                className="hover:bg-slate-50/50 transition-colors group"
              >
                <td className="px-8 py-5">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-blue-50 border border-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">
                        {user.name}
                      </p>
                      <p className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                        <EnvelopeIcon className="h-3 w-3" /> {user.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-5 text-slate-600 text-xs font-medium max-w-[200px] truncate">
                  {user.address || "No address provided"}
                </td>
                <td className="px-8 py-5 text-center">
                  <button
                    onClick={() => toggleRole(user)}
                    className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border transition-all hover:scale-105 ${
                      user.role === "admin"
                        ? "bg-purple-50 text-purple-600 border-purple-100 hover:bg-purple-100"
                        : "bg-slate-50 text-slate-600 border-slate-100 hover:bg-slate-200"
                    }`}
                  >
                    {user.role}
                  </button>
                </td>
                <td className="px-8 py-5">
                  <div className="text-xs font-semibold text-slate-500 flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-slate-300" />
                    {new Date(user.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                </td>
                <td className="px-8 py-5 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleDelete(user.id, user.name)}
                      disabled={user.role === "admin"}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all disabled:opacity-20"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUsers.length === 0 && !loading && (
          <div className="p-20 text-center text-slate-400 font-medium">
            No customers found matching that search.
          </div>
        )}
      </div>
    </div>
  );
}
